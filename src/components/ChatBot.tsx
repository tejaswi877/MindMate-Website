
import { useState, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User as UserIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ChatBotProps {
  user: User;
}

interface Message {
  id: string;
  message: string;
  is_bot: boolean;
  created_at: string;
  sentiment_score?: number;
}

const ChatBot = ({ user }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      // Create or get existing chat session
      const { data: session, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert([{ user_id: user.id, session_name: "MindMate Chat" }])
        .select()
        .single();

      if (sessionError) throw sessionError;
      
      if (session) {
        setSessionId(session.id);

        // Add welcome message
        const welcomeMessage = {
          id: "welcome",
          message: "Hello! I'm MindMate, your AI mental health companion. How are you feeling today? I'm here to listen and support you. 🌟",
          is_bot: true,
          created_at: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to initialize chat",
        variant: "destructive",
      });
    }
  };

  const analyzeSentiment = (message: string): number => {
    // Simple rule-based sentiment analysis
    const positiveWords = ["happy", "good", "great", "excellent", "wonderful", "amazing", "love", "joy", "excited", "grateful"];
    const negativeWords = ["sad", "bad", "terrible", "awful", "hate", "angry", "depressed", "anxious", "worried", "scared"];
    
    const words = message.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    // Normalize score between -1 and 1
    return Math.max(-1, Math.min(1, score / words.length));
  };

  const generateBotResponse = (userMessage: string, sentiment: number): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Crisis detection
    if (lowerMessage.includes("suicide") || lowerMessage.includes("kill myself") || lowerMessage.includes("end it all")) {
      return "I'm really concerned about you. Please reach out for immediate help: National Suicide Prevention Lifeline: 988. You matter, and there are people who want to help. Would you like me to guide you to crisis resources?";
    }
    
    // Sentiment-based responses
    if (sentiment < -0.5) {
      const responses = [
        "I hear that you're going through a difficult time. It's okay to feel this way, and I'm here to support you. What's been weighing on your mind?",
        "It sounds like you're struggling right now. Remember that it's brave to acknowledge difficult feelings. Would you like to talk about what's bothering you?",
        "I can sense you're having a hard time. Your feelings are valid, and you don't have to go through this alone. What would help you feel a little better right now?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else if (sentiment > 0.5) {
      const responses = [
        "It's wonderful to hear some positivity in your message! What's been going well for you lately?",
        "I'm glad you're feeling good! Celebrating these moments is important for your mental health. What brought this joy to your day?",
        "Your positive energy is beautiful! It's great when we can appreciate the good things in life. How can we build on this feeling?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else {
      // Neutral responses with helpful suggestions
      const responses = [
        "Thank you for sharing with me. How has your day been overall? Sometimes talking through our experiences can help us process them.",
        "I'm here to listen and support you. What's on your mind today? Even small things can be worth discussing.",
        "It's good that you're taking time to check in with yourself. What would you like to explore or talk about right now?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || loading) return;

    setLoading(true);
    const userMessage = inputMessage.trim();
    setInputMessage("");

    try {
      // Analyze sentiment
      const sentiment = analyzeSentiment(userMessage);

      // Add user message
      const userMessageObj = {
        session_id: sessionId,
        user_id: user.id,
        message: userMessage,
        is_bot: false,
        sentiment_score: sentiment,
      };

      const { data: savedUserMessage, error: userError } = await supabase
        .from("chat_messages")
        .insert([userMessageObj])
        .select()
        .single();

      if (userError) throw userError;

      setMessages(prev => [...prev, savedUserMessage]);

      // Generate bot response
      const botResponse = generateBotResponse(userMessage, sentiment);

      // Add bot message
      const botMessageObj = {
        session_id: sessionId,
        user_id: user.id,
        message: botResponse,
        is_bot: true,
      };

      const { data: savedBotMessage, error: botError } = await supabase
        .from("chat_messages")
        .insert([botMessageObj])
        .select()
        .single();

      if (botError) throw botError;

      setMessages(prev => [...prev, savedBotMessage]);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          Chat with MindMate
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.is_bot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.is_bot
                    ? "bg-blue-100 text-blue-900"
                    : "bg-purple-100 text-purple-900"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.is_bot ? (
                    <Bot className="h-4 w-4 mt-1 text-blue-500" />
                  ) : (
                    <UserIcon className="h-4 w-4 mt-1 text-purple-500" />
                  )}
                  <div>
                    <p className="text-sm">{message.message}</p>
                    {message.sentiment_score !== undefined && (
                      <span className="text-xs opacity-60">
                        Sentiment: {message.sentiment_score > 0 ? "😊" : message.sentiment_score < 0 ? "😔" : "😐"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={loading}
          />
          <Button onClick={handleSendMessage} disabled={loading || !inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
