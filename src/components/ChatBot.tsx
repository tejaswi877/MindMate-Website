
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, MessageSquare, X, Settings, RotateCcw, Trash2, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getBotResponse } from '@/utils/botResponses';
import { detectEmotion } from '@/utils/emotionAnalysis';
import { useChatSessions } from '@/hooks/useChatSessions';
import ChatMessage from './chat/ChatMessage';
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
      const greetingMessage = `Hello ${getUserDisplayName()}! 👋 I'm MindMate, your AI mental health companion. I'm here to support you on your wellness journey. How are you feeling today?`;
      
      const botMessage = {
        id: `greeting-${Date.now()}`,
        message: greetingMessage,
        is_bot: true,
        created_at: new Date().toISOString(),
      };
      
      setMessages([botMessage]);
      
      // Save greeting to database
      await supabase.from('chat_messages').insert([
        {
          user_id: user.id,
          session_id: data.id,
          message: greetingMessage,
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
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-indigo-100">
      <Card className="h-full flex flex-col shadow-xl border-0">
        <CardHeader className="pb-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-semibold">MindMate</div>
                <div className="text-sm text-purple-100 font-normal">Your AI Mental Health Companion 💜</div>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSessions(!showSessions)}
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={createNewSession}
                className="text-white hover:bg-white/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {showSessions && (
          <div className="border-b bg-purple-50">
            <ChatSessionsList
              previousSessions={sessions}
              loadChatSession={selectSession}
            />
          </div>
        )}

        <CardContent className="flex-1 flex flex-col p-6 bg-white">
          <ScrollArea className="flex-1 mb-4 pr-4">
            <div className="space-y-4">
              {messages.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to MindMate!</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    I'm here to support your mental wellness journey. Feel free to share what's on your mind, 
                    ask about coping strategies, or just have a conversation.
                  </p>
                </div>
              )}
              
              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  getUserDisplayName={getUserDisplayName}
                />
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center animate-pulse">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <span>MindMate is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              disabled={isLoading || !currentSessionId}
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim() || !currentSessionId}
              size="icon"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
