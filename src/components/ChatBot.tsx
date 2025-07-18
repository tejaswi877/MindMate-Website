
import { useState, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Message, ChatBotProps } from "@/types/chat";
import { generateBotResponse } from "@/utils/botResponses";
import { useChatSessions } from "@/hooks/useChatSessions";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatSessionsList from "@/components/chat/ChatSessionsList";

const ChatBot = ({ user }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreviousSessions, setShowPreviousSessions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessionId,
    setSessionId,
    previousSessions,
    loadPreviousSessions,
    createNewChatSession,
    initializeChat,
    loadChatSession,
  } = useChatSessions(user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeAndLoadMessages();
  }, []);

  const initializeAndLoadMessages = async () => {
    const sessionId = await initializeChat();
    if (sessionId) {
      await loadMessagesForSession(sessionId);
    }
  };

  const loadMessagesForSession = async (sessionId: string) => {
    try {
      const { data: previousMessages } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (previousMessages && previousMessages.length > 0) {
        setMessages(previousMessages);
      } else {
        // Add welcome message if no previous messages
        const username = user.user_metadata?.username || user.email?.split('@')[0] || 'there';
        const welcomeMessage = {
          id: "welcome",
          message: `Hello ${username}! 👋 I'm MindMate, your AI mental health companion. How are you feeling today? I'm here to listen, provide support, and share coping strategies whenever you need them. 🌟`,
          is_bot: true,
          created_at: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error: any) {
      console.error("Error loading messages:", error);
    }
  };

  const handleCreateNewChatSession = async () => {
    const newSessionId = await createNewChatSession();
    if (newSessionId) {
      setMessages([]);
      setShowPreviousSessions(false);
      
      // Add welcome message for new session
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'there';
      const welcomeMessage = {
        id: "welcome-new",
        message: `Hello ${username}! 👋 Welcome to a new chat session. I'm MindMate, ready to support you on your mental wellness journey. How can I help you today? 🌟`,
        is_bot: true,
        created_at: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const clearCurrentChat = async () => {
    if (!sessionId) return;

    try {
      // Delete all messages in current session
      const { error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("session_id", sessionId);

      if (error) throw error;

      // Reset messages with welcome message
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'there';
      const welcomeMessage = {
        id: "welcome-clear",
        message: `Hello ${username}! 👋 Chat cleared! I'm MindMate, ready to support you on your mental wellness journey. How can I help you today? 🌟`,
        is_bot: true,
        created_at: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);

      toast({
        title: "Chat Cleared",
        description: "All messages have been removed from this session",
      });
    } catch (error: any) {
      console.error("Error clearing chat:", error);
      toast({
        title: "Error",
        description: "Failed to clear chat",
        variant: "destructive",
      });
    }
  };

  const handleLoadChatSession = async (session: any) => {
    const loadedSessionId = await loadChatSession(session);
    if (loadedSessionId) {
      await loadMessagesForSession(loadedSessionId);
      setShowPreviousSessions(false);
    }
  };

  const handleInitializeChat = async () => {
    const sessionId = await initializeChat();
    if (sessionId) {
      await loadMessagesForSession(sessionId);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || loading) return;

    setLoading(true);
    const userMessage = inputMessage.trim();
    setInputMessage("");

    try {
      // Add user message to database
      const { data: savedUserMessage, error: userError } = await supabase
        .from("chat_messages")
        .insert([{
          session_id: sessionId,
          user_id: user.id,
          message: userMessage,
          is_bot: false,
        }])
        .select()
        .single();

      if (userError) throw userError;

      // Add user message to UI immediately
      setMessages(prev => [...prev, savedUserMessage]);

      // Generate bot response based on emotion analysis
      const botResponse = generateBotResponse(userMessage);

      // Add bot message to database
      const { data: savedBotMessage, error: botError } = await supabase
        .from("chat_messages")
        .insert([{
          session_id: sessionId,
          user_id: user.id,
          message: botResponse,
          is_bot: true,
        }])
        .select()
        .single();

      if (botError) throw botError;

      // Add bot message to UI
      setMessages(prev => [...prev, savedBotMessage]);

    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUserDisplayName = () => {
    return user.user_metadata?.username || user.email?.split('@')[0] || 'You';
  };

  return (
    <Card className="h-[700px] flex flex-col shadow-lg border-purple-200">
      <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
        <ChatHeader
          showPreviousSessions={showPreviousSessions}
          setShowPreviousSessions={setShowPreviousSessions}
          createNewChatSession={handleCreateNewChatSession}
          clearCurrentChat={clearCurrentChat}
          initializeChat={handleInitializeChat}
        />
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Previous Sessions Panel */}
        {showPreviousSessions && (
          <ChatSessionsList
            previousSessions={previousSessions}
            loadChatSession={handleLoadChatSession}
          />
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 p-6 bg-gradient-to-b from-purple-25 to-blue-25">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              getUserDisplayName={getUserDisplayName}
            />
          ))}
          
          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="w-8 h-8 border-2 border-purple-200">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-purple-100 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">MindMate is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-purple-100 bg-white">
          <div className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Share what's on your mind... I'm here to listen and support you 💜"
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={loading || !inputMessage.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • MindMate provides emotional support and coping strategies
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
