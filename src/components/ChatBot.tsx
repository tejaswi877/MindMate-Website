
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, MessageSquare, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getBotResponse } from '@/utils/botResponses';
import { detectEmotion } from '@/utils/emotionAnalysis';
import { useChatSessions } from '@/hooks/useChatSessions';
import ChatMessage from './chat/ChatMessage';
import ChatHeader from './chat/ChatHeader';
import ChatSessionsList from './chat/ChatSessionsList';
import type { Message, ChatBotProps } from '@/types/chat';

const ChatBot: React.FC<ChatBotProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSessions, setShowSessions] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sessions, refetchSessions } = useChatSessions(user?.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
    }
  }, [currentSessionId]);

  useEffect(() => {
    if (isFirstVisit && sessions.length > 0) {
      const latestSession = sessions[0];
      setCurrentSessionId(latestSession.id);
      setIsFirstVisit(false);
    }
  }, [sessions, isFirstVisit]);

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load chat messages",
        variant: "destructive"
      });
    }
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.username || user?.email?.split('@')[0] || 'there';
  };

  const createNewSession = async () => {
    if (!user?.id) return;

    try {
      const sessionName = `Chat ${new Date().toLocaleDateString()}`;
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([
          {
            user_id: user.id,
            session_name: sessionName,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setCurrentSessionId(data.id);
      setMessages([]);
      await refetchSessions();
      
      // Add greeting message for new session
      const botResponse = getBotResponse("");
      const greetingMessage = {
        id: `greeting-${Date.now()}`,
        message: botResponse.response,
        is_bot: true,
        created_at: new Date().toISOString(),
      };
      
      setMessages([greetingMessage]);
      
      // Save greeting to database
      await supabase.from('chat_messages').insert([
        {
          user_id: user.id,
          session_id: data.id,
          message: botResponse.response,
          is_bot: true,
        },
      ]);

    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create new chat session",
        variant: "destructive"
      });
    }
  };

  const selectSession = async (session: any) => {
    setCurrentSessionId(session.id);
    setShowSessions(false);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSessionId || !user?.id) return;

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      message: inputMessage,
      is_bot: false,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Save user message
      const { error: userError } = await supabase
        .from('chat_messages')
        .insert([
          {
            user_id: user.id,
            session_id: currentSessionId,
            message: inputMessage,
            is_bot: false,
          },
        ]);

      if (userError) throw userError;

      // Get bot response
      const emotion = detectEmotion(inputMessage);
      const botResponse = getBotResponse(inputMessage);
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        message: botResponse.response,
        is_bot: true,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Save bot message
      const { error: botError } = await supabase
        .from('chat_messages')
        .insert([
          {
            user_id: user.id,
            session_id: currentSessionId,
            message: botResponse.response,
            is_bot: true,
            emotion_detected: emotion,
          },
        ]);

      if (botError) throw botError;

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Start new session if none exists
  useEffect(() => {
    if (!currentSessionId && sessions.length === 0 && !isFirstVisit && user?.id) {
      createNewSession();
    }
  }, [currentSessionId, sessions.length, isFirstVisit, user?.id]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Companion
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSessions(!showSessions)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={createNewSession}
            >
              New Chat
            </Button>
          </div>
        </div>
      </CardHeader>

      {showSessions && (
        <div className="px-4 pb-3">
          <ChatSessionsList
            previousSessions={sessions}
            loadChatSession={selectSession}
          />
        </div>
      )}

      <CardContent className="flex-1 flex flex-col p-4">
        {currentSessionId && (
          <ChatHeader sessionId={currentSessionId} />
        )}
        
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                getUserDisplayName={getUserDisplayName}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="h-4 w-4 animate-pulse" />
                <span>AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="flex-1"
            disabled={isLoading || !currentSessionId}
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !inputMessage.trim() || !currentSessionId}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
