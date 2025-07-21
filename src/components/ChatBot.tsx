
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

  // Check if user session is valid and strong
  const isSessionValid = () => {
    if (!user || !user.id) return false;
    // Add additional session validation
    const sessionAge = user.last_sign_in_at ? 
      Date.now() - new Date(user.last_sign_in_at).getTime() : 
      Infinity;
    // Session expires after 24 hours for security
    return sessionAge < 24 * 60 * 60 * 1000;
  };

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
    // Enhanced security check
    if (!inputMessage.trim() || !sessionId || loading || !isSessionValid()) {
      if (!isSessionValid()) {
        toast({
          title: "Session Expired",
          description: "Please sign in again for security",
          variant: "destructive",
        });
        await supabase.auth.signOut();
      }
      return;
    }

    setLoading(true);
    const userMessage = inputMessage.trim();
    setInputMessage("");

    try {
      // Enhanced user authentication check
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.id !== user.id) {
        throw new Error("Authentication required");
      }

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

      // Generate enhanced bot response
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
      
      if (error.message.includes("Authentication") || error.message.includes("JWT")) {
        toast({
          title: "Authentication Required",
          description: "Please sign in again to continue",
          variant: "destructive",
        });
        await supabase.auth.signOut();
      } else {
        toast({
          title: "Message Failed",
          description: "Please try again or refresh the page",
          variant: "destructive",
        });
      }
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

  // Don't show sensitive data if session is invalid
  if (!isSessionValid()) {
    return (
      <Card className="h-[700px] flex flex-col justify-center items-center shadow-xl border-0 bg-gradient-to-br from-indigo-50 via-purple-25 to-blue-50">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Bot className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Session Expired
          </h3>
          <p className="text-gray-600 mb-6 text-lg">For your security, please sign in again to continue</p>
          <Button 
            onClick={() => supabase.auth.signOut()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Sign In Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[700px] flex flex-col shadow-xl border-0 bg-gradient-to-br from-indigo-50 via-purple-25 to-blue-50">
      <CardHeader className="pb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-t-xl">
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
        <div className="flex-1 overflow-y-auto space-y-6 p-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              getUserDisplayName={getUserDisplayName}
            />
          ))}
          
          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="w-10 h-10 border-3 border-white shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 p-4 rounded-2xl shadow-lg max-w-[80%]">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">MindMate is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
          <div className="flex gap-4">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Share what's on your mind... I'm here to listen and support you 💜"
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-xl bg-white/80 backdrop-blur-sm text-gray-700 placeholder:text-gray-500"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={loading || !inputMessage.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Press Enter to send • MindMate provides emotional support and coping strategies
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
