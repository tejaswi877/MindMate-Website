
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
      // Get or create chat session
      const { data: existingSession } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      let session;
      if (existingSession) {
        session = existingSession;
      } else {
        const { data: newSession, error } = await supabase
          .from("chat_sessions")
          .insert([{ 
            user_id: user.id, 
            session_name: `${user.user_metadata?.username || 'User'}'s Chat Session` 
          }])
          .select()
          .single();

        if (error) throw error;
        session = newSession;
      }

      if (session) {
        setSessionId(session.id);

        // Load previous messages
        const { data: previousMessages } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", session.id)
          .order("created_at", { ascending: true });

        if (previousMessages && previousMessages.length > 0) {
          setMessages(previousMessages);
        } else {
          // Add welcome message if no previous messages
          const welcomeMessage = {
            id: "welcome",
            message: `Hello ${user.user_metadata?.username || 'there'}! 👋 I'm MindMate, your AI mental health companion. How are you feeling today? I'm here to listen, provide support, and share coping strategies whenever you need them. 🌟`,
            is_bot: true,
            created_at: new Date().toISOString(),
          };
          setMessages([welcomeMessage]);
        }
      }
    } catch (error: any) {
      console.error("Error initializing chat:", error);
      toast({
        title: "Error",
        description: "Failed to initialize chat",
        variant: "destructive",
      });
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Crisis detection - highest priority
    if (lowerMessage.includes("suicide") || lowerMessage.includes("kill myself") || 
        lowerMessage.includes("end it all") || lowerMessage.includes("hurt myself") ||
        lowerMessage.includes("self harm")) {
      return "🚨 I'm really concerned about you right now. Please reach out for immediate help: National Suicide Prevention Lifeline: 988. You matter, and there are people who want to help. Would you like me to guide you to crisis resources? Remember, you're not alone in this.";
    }

    // Coping strategies requests
    if (lowerMessage.includes("coping") || lowerMessage.includes("cope") || 
        lowerMessage.includes("strategies") || lowerMessage.includes("help me") ||
        lowerMessage.includes("tips") || lowerMessage.includes("what can i do")) {
      const copingTips = [
        "Here are some helpful coping strategies:\n\n🌟 **Breathing Exercise**: Try the 4-7-8 technique - breathe in for 4, hold for 7, exhale for 8\n\n🧘 **Grounding (5-4-3-2-1)**: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste\n\n💭 **Mindfulness**: Focus on the present moment without judgment\n\n🚶 **Movement**: Take a short walk or do gentle stretches\n\n📝 **Journaling**: Write down your thoughts and feelings",
        "Let me share some powerful coping techniques:\n\n🎵 **Music Therapy**: Listen to calming music or sounds of nature\n\n🛁 **Self-Care**: Take a warm bath, practice skincare, or do something nurturing\n\n🤝 **Social Support**: Reach out to a trusted friend or family member\n\n🎨 **Creative Expression**: Draw, paint, write, or engage in any creative activity\n\n⏰ **Routine**: Stick to a daily routine to provide structure and stability",
        "Here are some evidence-based coping strategies:\n\n🔄 **Progressive Muscle Relaxation**: Tense and release each muscle group\n\n🧊 **Ice Cube Technique**: Hold an ice cube to ground yourself in the moment\n\n📱 **Positive Affirmations**: Remind yourself of your strengths and worth\n\n🌱 **Nature Connection**: Spend time outdoors or with plants\n\n😴 **Sleep Hygiene**: Maintain a consistent sleep schedule"
      ];
      return copingTips[Math.floor(Math.random() * copingTips.length)];
    }

    // Anxiety-specific responses
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || 
        lowerMessage.includes("worried") || lowerMessage.includes("panic")) {
      const anxietyResponses = [
        "I understand you're feeling anxious right now. 💙 Try this quick technique: Place one hand on your chest, one on your belly. Breathe slowly and feel your belly rise more than your chest. Anxiety is temporary - you've gotten through difficult moments before, and you can get through this one too.",
        "Anxiety can feel overwhelming, but you're stronger than you know. 🌸 Remember: this feeling will pass. Try to focus on what you can control right now. Would you like to try a grounding exercise together, or would you prefer to talk about what's making you feel this way?",
        "I hear that you're struggling with anxiety. 🤗 It's okay to feel this way - anxiety is your mind's way of trying to protect you. Let's work through this together. What's one small thing that usually brings you comfort?"
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
    }

    // Depression-specific responses
    if (lowerMessage.includes("depressed") || lowerMessage.includes("depression") || 
        lowerMessage.includes("sad") || lowerMessage.includes("hopeless") ||
        lowerMessage.includes("empty") || lowerMessage.includes("worthless")) {
      const depressionResponses = [
        "I'm sorry you're feeling this way. 💜 Depression can make everything feel harder, but please know that your feelings are valid and you're not alone. Even small steps count - have you been able to take care of your basic needs today? Sometimes that's enough.",
        "Depression can feel like a heavy weight, but you're brave for reaching out. 🌅 Remember that healing isn't linear - some days will be harder than others, and that's okay. What's one tiny thing that used to bring you joy? We don't have to do it now, just remember it exists.",
        "Thank you for trusting me with how you're feeling. 🫂 Depression lies to us and tells us we're not worth it, but that's not true. You matter. Your life has value. Would it help to talk about what depression feels like for you, or would you prefer some gentle suggestions for today?"
      ];
      return depressionResponses[Math.floor(Math.random() * depressionResponses.length)];
    }

    // Stress-related responses
    if (lowerMessage.includes("stressed") || lowerMessage.includes("stress") || 
        lowerMessage.includes("overwhelmed") || lowerMessage.includes("pressure")) {
      const stressResponses = [
        "Stress can feel like everything is happening at once. 🌊 Let's break it down together. What's the most urgent thing on your mind right now? Sometimes just naming our stressors can help reduce their power over us.",
        "I can hear that you're feeling overwhelmed. 🕯️ When stress builds up, our bodies and minds need extra care. Have you had water today? Have you taken any breaks? Let's start with the basics and work from there.",
        "Stress is your body's natural response, but when it's chronic, it can be exhausting. 🌿 Try this: take three deep breaths with me. In... and out. You're doing the best you can with what you have right now, and that's enough."
      ];
      return stressResponses[Math.floor(Math.random() * stressResponses.length)];
    }

    // Positive/gratitude responses
    if (lowerMessage.includes("good") || lowerMessage.includes("better") || 
        lowerMessage.includes("happy") || lowerMessage.includes("grateful") ||
        lowerMessage.includes("thankful") || lowerMessage.includes("great")) {
      const positiveResponses = [
        "It's wonderful to hear some positivity in your message! 🌟 I'm so glad you're having a good moment. What's contributing to you feeling this way? It's important to acknowledge and celebrate these feelings when they come.",
        "I love hearing that you're doing well! ✨ Positive moments are so precious - they remind us that difficult times don't last forever. Would you like to share what's going well, or talk about how to maintain this positive energy?",
        "That's fantastic! 🎉 I'm genuinely happy to hear you're feeling good. These moments of happiness and gratitude are like sunshine for our mental health. What's bringing you joy today?"
      ];
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    }

    // Sleep-related responses
    if (lowerMessage.includes("sleep") || lowerMessage.includes("tired") || 
        lowerMessage.includes("insomnia") || lowerMessage.includes("can't sleep")) {
      return "Sleep is so important for mental health. 😴 If you're having trouble sleeping, try creating a calming bedtime routine: dim lights 1 hour before bed, avoid screens, try reading or gentle stretching. The 4-7-8 breathing technique can also help calm your mind. What's your current sleep situation like?";
    }

    // General supportive responses
    const generalResponses = [
      "Thank you for sharing with me. 💙 I'm here to listen and support you. What's been on your mind lately? Remember, there's no judgment here - this is your safe space.",
      "I appreciate you opening up to me. 🤗 Whatever you're going through, you don't have to face it alone. How are you taking care of yourself today?",
      "I'm glad you're here. 🌸 Sometimes just talking can help us process our thoughts and feelings. What would be most helpful for you right now - practical advice, a listening ear, or something else?",
      "It's brave to reach out and talk about your mental health. 💜 You're taking an important step by being here. How can I best support you today?",
      "I'm here for you, and I want you to know that your feelings matter. 🌈 Whether you're having a tough day or just need someone to talk to, I'm listening. What's going on in your world?"
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
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

      // Generate bot response
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

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-600" />
          Chat with MindMate
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your AI mental health companion - here to listen and support you 💜
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.is_bot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.is_bot
                    ? "bg-purple-50 text-purple-900 border border-purple-200"
                    : "bg-blue-50 text-blue-900 border border-blue-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.is_bot ? (
                    <Bot className="h-4 w-4 mt-1 text-purple-600 flex-shrink-0" />
                  ) : (
                    <UserIcon className="h-4 w-4 mt-1 text-blue-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.message}
                    </p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-3 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message... Share what's on your mind"
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={loading || !inputMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • MindMate is here to support your mental wellness journey
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
