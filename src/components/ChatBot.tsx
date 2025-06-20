
import { useState, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User as UserIcon, Plus, History } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getBotResponse } from "@/utils/botResponses";
import { analyzeEmotion } from "@/utils/emotionAnalysis";
import { useChatSessions } from "@/hooks/useChatSessions";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatSessionsList from "@/components/chat/ChatSessionsList";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  emotion?: string;
}

interface ChatBotProps {
  user: User;
}

const ChatBot = ({ user }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    sessionId,
    previousSessions,
    createNewChatSession,
    initializeChat,
    loadChatSession,
  } = useChatSessions(user);

  useEffect(() => {
    if (!sessionId) {
      initializeChat();
    } else {
      loadMessages();
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Send initial greeting when chat starts
    if (sessionId && messages.length === 0) {
      const greetingResponse = getBotResponse("");
      const greetingMessage: Message = {
        id: Date.now().toString(),
        text: greetingResponse.response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages([greetingMessage]);
      saveMessageToDatabase(greetingMessage, null);
    }
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    if (!sessionId) return;

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const loadedMessages: Message[] = data.map((msg) => ({
        id: msg.id,
        text: msg.message,
        isBot: msg.is_bot,
        timestamp: new Date(msg.created_at),
        emotion: msg.emotion_detected || undefined,
      }));

      setMessages(loadedMessages);
    } catch (error: any) {
      console.error("Error loading messages:", error);
    }
  };

  const saveMessageToDatabase = async (message: Message, emotion: string | null) => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from("chat_messages")
        .insert([
          {
            session_id: sessionId,
            user_id: user.id,
            message: message.text,
            is_bot: message.isBot,
            emotion_detected: emotion,
          },
        ]);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error saving message:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Analyze emotion
    const emotion = analyzeEmotion(userMessage.text);
    
    // Save user message
    await saveMessageToDatabase(userMessage, emotion);

    // Get bot response
    const botResponse = getBotResponse(userMessage.text);

    // Create bot message
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse.response,
      isBot: true,
      timestamp: new Date(),
    };

    // Add bot response with slight delay for natural feel
    setTimeout(async () => {
      setMessages((prev) => [...prev, botMessage]);
      await saveMessageToDatabase(botMessage, null);

      // Add follow-up message if exists
      if (botResponse.followUp) {
        setTimeout(async () => {
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: botResponse.followUp!,
            isBot: true,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, followUpMessage]);
          await saveMessageToDatabase(followUpMessage, null);
          setIsLoading(false);
        }, 1000);
      } else {
        setIsLoading(false);
      }
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = async () => {
    const newSessionId = await createNewChatSession();
    if (newSessionId) {
      setMessages([]);
      setShowSessions(false);
    }
  };

  const handleLoadSession = async (session: any) => {
    await loadChatSession(session);
    setShowSessions(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MessageCircle className="h-6 w-6" />
            Chat with MindMate
          </CardTitle>
          <p className="text-purple-100">
            Your caring AI companion is here to listen and support you 💜
          </p>
        </CardHeader>
      </Card>

      {/* Chat Controls */}
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={() => setShowSessions(!showSessions)}
          className="flex items-center gap-2"
        >
          <History className="h-4 w-4" />
          Chat History
        </Button>
        <Button
          onClick={handleNewChat}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Previous Sessions */}
      {showSessions && (
        <Card>
          <ChatSessionsList
            sessions={previousSessions}
            onSelectSession={handleLoadSession}
            onClose={() => setShowSessions(false)}
          />
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <ChatHeader currentSessionId={sessionId} />
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Bot className="h-5 w-5" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">MindMate is thinking...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • MindMate is here to listen and support you
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
