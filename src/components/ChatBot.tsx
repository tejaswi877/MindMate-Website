
import { useState, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User as UserIcon, RefreshCw, History, Plus, MessageSquare, Trash2 } from "lucide-react";
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

interface ChatSession {
  id: string;
  session_name: string;
  created_at: string;
}

const ChatBot = ({ user }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [previousSessions, setPreviousSessions] = useState<ChatSession[]>([]);
  const [showPreviousSessions, setShowPreviousSessions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
    loadPreviousSessions();
  }, []);

  const loadPreviousSessions = async () => {
    try {
      const { data: sessions, error } = await supabase
        .from("chat_sessions")
        .select("id, session_name, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPreviousSessions(sessions || []);
    } catch (error: any) {
      console.error("Error loading previous sessions:", error);
    }
  };

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
          const username = user.user_metadata?.username || user.email?.split('@')[0] || 'there';
          const welcomeMessage = {
            id: "welcome",
            message: `Hello ${username}! 👋 I'm MindMate, your AI mental health companion. How are you feeling today? I'm here to listen, provide support, and share coping strategies whenever you need them. 🌟`,
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

  const createNewChatSession = async () => {
    try {
      const sessionName = `Chat Session ${new Date().toLocaleDateString()}`;
      const { data: newSession, error } = await supabase
        .from("chat_sessions")
        .insert([{ 
          user_id: user.id, 
          session_name: sessionName 
        }])
        .select()
        .single();

      if (error) throw error;

      setSessionId(newSession.id);
      setMessages([]);
      setShowPreviousSessions(false);
      loadPreviousSessions();

      // Add welcome message for new session
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'there';
      const welcomeMessage = {
        id: "welcome-new",
        message: `Hello ${username}! 👋 Welcome to a new chat session. I'm MindMate, ready to support you on your mental wellness journey. How can I help you today? 🌟`,
        is_bot: true,
        created_at: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);

      toast({
        title: "New Chat Created",
        description: "Started a fresh conversation with MindMate",
      });
    } catch (error: any) {
      console.error("Error creating new session:", error);
      toast({
        title: "Error",
        description: "Failed to create new chat session",
        variant: "destructive",
      });
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

  const loadChatSession = async (session: ChatSession) => {
    try {
      setSessionId(session.id);

      // Load messages for selected session
      const { data: sessionMessages, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", session.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(sessionMessages || []);
      setShowPreviousSessions(false);

      toast({
        title: "Chat Loaded",
        description: `Loaded chat: ${session.session_name}`,
      });
    } catch (error: any) {
      console.error("Error loading chat session:", error);
      toast({
        title: "Error",
        description: "Failed to load chat session",
        variant: "destructive",
      });
    }
  };

  const analyzeEmotion = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Crisis keywords - highest priority
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 'want to die', 'no point', 'give up'];
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'crisis';
    }

    // Anxiety keywords
    const anxietyKeywords = ['anxious', 'anxiety', 'worried', 'panic', 'nervous', 'scared', 'fear', 'stress', 'overwhelmed', 'tense'];
    if (anxietyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'anxiety';
    }

    // Depression keywords
    const depressionKeywords = ['depressed', 'depression', 'sad', 'hopeless', 'empty', 'worthless', 'lonely', 'numb', 'dark', 'heavy'];
    if (depressionKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'depression';
    }

    // Anger keywords
    const angerKeywords = ['angry', 'mad', 'furious', 'rage', 'irritated', 'frustrated', 'annoyed', 'pissed'];
    if (angerKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'anger';
    }

    // Positive keywords
    const positiveKeywords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic', 'grateful', 'thankful', 'blessed', 'joy'];
    if (positiveKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'positive';
    }

    // Coping request keywords
    const copingKeywords = ['help', 'tips', 'advice', 'strategies', 'coping', 'cope', 'what can i do', 'how to', 'support'];
    if (copingKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'coping';
    }

    // Sleep keywords
    const sleepKeywords = ['sleep', 'insomnia', 'tired', 'exhausted', 'can\'t sleep', 'sleepless'];
    if (sleepKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'sleep';
    }

    return 'neutral';
  };

  const generateBotResponse = (userMessage: string): string => {
    const emotion = analyzeEmotion(userMessage);
    console.log('Detected emotion:', emotion);
    
    switch (emotion) {
      case 'crisis':
        const crisisResponses = [
          "🚨 I'm really concerned about you right now. Your life has value and you matter. Please reach out for immediate help:\n\n🔴 **Crisis Hotlines:**\n• National Suicide Prevention Lifeline: **988**\n• Crisis Text Line: Text HOME to **741741**\n• International Association for Suicide Prevention: **iasp.info**\n\nYou're not alone in this. Would you like me to guide you to more crisis resources? Please consider reaching out to someone you trust or emergency services if you're in immediate danger.",
          "🚨 I hear that you're in a lot of pain right now, and I want you to know that your life matters. Please don't give up. There are people who want to help:\n\n**Immediate Support:**\n• Call 988 - National Suicide Prevention Lifeline\n• Text 'HELLO' to 741741 - Crisis Text Line\n• Go to your nearest emergency room\n\nRemember: This pain you're feeling is temporary, but ending your life is permanent. You deserve support and care. Can you reach out to someone today?"
        ];
        return crisisResponses[Math.floor(Math.random() * crisisResponses.length)];

      case 'anxiety':
        const anxietyResponses = [
          "I can hear the anxiety in your message, and I want you to know that what you're feeling is valid. 💙 Let's try this together:\n\n**Quick Anxiety Relief:**\n🌬️ **Box Breathing**: Breathe in for 4, hold for 4, out for 4, hold for 4\n🏠 **5-4-3-2-1 Grounding**: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste\n💭 **Remind yourself**: 'This feeling will pass. I am safe right now.'\n\nAnxiety is your mind trying to protect you, but sometimes it gets overactive. You've gotten through anxious moments before - you can get through this one too.",
          "Anxiety can feel so overwhelming, but remember - you are stronger than your anxiety. 🌸 Here's what can help right now:\n\n**Immediate Techniques:**\n🤲 **Progressive Muscle Relaxation**: Tense your shoulders for 5 seconds, then release\n🧊 **Cold Water**: Splash cold water on your face or hold an ice cube\n📱 **Positive Self-Talk**: 'I am safe. This will pass. I can handle this.'\n\nWhat's one small thing that usually brings you comfort? Sometimes focusing on tiny, manageable actions helps break the anxiety cycle."
        ];
        return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];

      case 'depression':
        const depressionResponses = [
          "I'm so sorry you're feeling this heavy right now. Depression can make everything feel impossible, but please know you're not alone. 💜\n\n**Gentle Steps for Today:**\n💧 **Hydration**: Try to drink a glass of water\n🌅 **Sunlight**: Sit by a window or step outside for 2 minutes\n🤗 **Self-Compassion**: Talk to yourself like you would a good friend\n✅ **One Small Task**: Maybe just making your bed or brushing teeth\n\nDepression lies to us and says we're worthless, but that's not true. You matter. Your life has value. What's one tiny thing you managed to do today?",
          "Thank you for trusting me with how you're feeling. Depression can feel like being stuck in a dark tunnel, but there is light ahead. 🌅\n\n**Small Acts of Self-Care:**\n🛁 **Comfort**: Take a warm shower or wrap yourself in a soft blanket\n📝 **Journaling**: Write down one thing you're grateful for, even if it's small\n🎵 **Music**: Listen to one song that used to make you feel something\n📞 **Connection**: Consider texting one person you trust\n\nHealing isn't linear - some days will be harder than others, and that's okay. You're brave for reaching out."
        ];
        return depressionResponses[Math.floor(Math.random() * depressionResponses.length)];

      case 'anger':
        const angerResponses = [
          "I can feel the intensity of your emotions right now. Anger is a valid feeling, and it's okay to feel this way. 🔥\n\n**Healthy Ways to Process Anger:**\n🚶 **Movement**: Go for a walk, do jumping jacks, or punch a pillow\n📝 **Expression**: Write your feelings in a journal or voice memo\n🌬️ **Breathing**: Take 10 deep breaths, focusing on the exhale\n❄️ **Cool Down**: Splash cold water on your face or hold an ice pack\n\nAnger often masks other emotions like hurt, frustration, or fear. What do you think might be underneath this anger?",
          "Your anger is telling you that something important to you has been affected. Let's channel this energy constructively. 💪\n\n**Anger Management Techniques:**\n⏰ **Time-Out**: Step away from the situation for 10-15 minutes\n🎯 **Focus**: Ask yourself 'What can I control in this situation?'\n💭 **Reframe**: Try to see the situation from another perspective\n🎨 **Creative Outlet**: Draw, write, or create something with your hands\n\nWhat's one constructive action you could take to address what's making you angry?"
        ];
        return angerResponses[Math.floor(Math.random() * angerResponses.length)];

      case 'positive':
        const positiveResponses = [
          "It's wonderful to hear some positivity in your message! 🌟 I'm genuinely happy you're feeling good. These moments are so precious.\n\n**Amplifying Positive Feelings:**\n📝 **Gratitude Journal**: Write down what's making you feel good\n📞 **Share Joy**: Tell someone about your positive experience\n🎯 **Savor**: Take a moment to really feel and appreciate this feeling\n🌱 **Plant Seeds**: What can you do to create more moments like this?\n\nPositive emotions are like sunshine for our mental health. What specifically is contributing to you feeling this way today?",
          "Your positive energy is contagious! ✨ I love hearing when you're doing well. Let's make the most of this good feeling:\n\n**Building on Positivity:**\n🎯 **Mindful Appreciation**: Take 30 seconds to really notice what feels good\n📸 **Memory Making**: Do something small to remember this moment\n💪 **Future Planning**: How can you create more experiences like this?\n🤗 **Self-Recognition**: Give yourself credit for creating this positive moment\n\nWhat's bringing you the most joy right now?"
        ];
        return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];

      case 'coping':
        const copingResponses = [
          "I'm so glad you're asking for coping strategies! That shows real self-awareness and strength. 💪 Here are some powerful techniques:\n\n**Immediate Coping Strategies:**\n🌬️ **4-7-8 Breathing**: Inhale 4, hold 7, exhale 8 (repeat 4 times)\n🧘 **Grounding (5-4-3-2-1)**: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste\n❄️ **Ice Technique**: Hold ice cubes or splash cold water on face\n🚶 **Movement**: Take a 5-minute walk or do gentle stretches\n📱 **Distraction**: Call a friend, watch funny videos, or listen to music\n\nWhich of these feels most doable for you right now?",
          "You're taking such a positive step by seeking coping strategies! 🌟 Here's a toolkit of techniques:\n\n**Emotional Regulation Tools:**\n📝 **Journaling**: Write your thoughts without judgment for 10 minutes\n🎨 **Creative Expression**: Draw, paint, or create something with your hands\n🛁 **Self-Soothing**: Take a warm bath, use aromatherapy, or listen to calming music\n🤗 **Self-Compassion**: Talk to yourself like you would your best friend\n📞 **Social Connection**: Reach out to someone you trust\n🌱 **Nature**: Spend time outdoors or with plants\n\nWhat type of situation are you hoping to cope with better?",
          "Asking for coping strategies is a sign of wisdom and self-care! 🧠💚 Here are evidence-based techniques:\n\n**Stress Management Arsenal:**\n💭 **Cognitive Restructuring**: Challenge negative thoughts with 'Is this thought helpful? Is it true?'\n⏰ **Time Management**: Break overwhelming tasks into tiny, manageable steps\n🎯 **Problem-Solving**: Write down the problem, brainstorm solutions, pick one to try\n🔄 **Progressive Muscle Relaxation**: Tense and release each muscle group\n📚 **Learning**: Read, listen to podcasts, or watch videos on topics that interest you\n🎶 **Music Therapy**: Create playlists for different moods\n\nWhich area of your life feels most challenging right now?"
        ];
        return copingResponses[Math.floor(Math.random() * copingResponses.length)];

      case 'sleep':
        return "Sleep is so crucial for mental health, and I understand how frustrating sleep issues can be. 😴\n\n**Better Sleep Strategies:**\n🌅 **Sleep Hygiene**: Go to bed and wake up at the same time daily\n📱 **Digital Sunset**: No screens 1 hour before bed\n🛁 **Wind-Down Ritual**: Warm bath, reading, or gentle stretching\n🌡️ **Cool Environment**: Keep bedroom around 65-68°F (18-20°C)\n🌬️ **4-7-8 Breathing**: This technique can help calm your nervous system\n☕ **Limit Caffeine**: Avoid after 2 PM\n\nWhat's your current bedtime routine like? Sometimes small changes can make a big difference.";

      default:
        const neutralResponses = [
          "Thank you for sharing with me. 💙 I'm here to listen and support you through whatever you're experiencing. Your feelings are valid, and this is a safe space for you.\n\n**How I Can Help:**\n🎯 **Specific Support**: Tell me what's on your mind and I'll provide targeted strategies\n💭 **Processing**: Sometimes just talking through feelings can be incredibly helpful\n🛠️ **Practical Tools**: I can share coping techniques for whatever you're facing\n🤗 **Emotional Support**: I'm here to remind you that you're not alone\n\nWhat would be most helpful for you right now?",
          "I'm grateful you're here and willing to share with me. 🌸 Whatever brought you here today, know that reaching out is a brave and positive step.\n\n**Remember:**\n💪 You're stronger than you realize\n🌱 Growth happens one day at a time\n🤝 You don't have to face challenges alone\n🌈 Difficult feelings are temporary\n✨ You deserve support and care\n\nWhat's been on your mind lately? I'm here to listen without judgment.",
          "Hello! I'm so glad you're here. 🌟 As your mental health companion, I want you to know that this is your space - free from judgment, full of support.\n\n**What I'm Here For:**\n👂 **Active Listening**: Share anything that's on your heart or mind\n🧠 **Mental Health Education**: Learn about emotions, coping, and wellness\n🛠️ **Practical Strategies**: Get tools you can use immediately\n💚 **Encouragement**: Remind you of your strength and worth\n\nHow are you feeling today? What brought you here to chat with me?"
        ];
        return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Chat with MindMate
              </h3>
              <p className="text-sm text-muted-foreground font-normal">
                Your AI mental health companion 💜
              </p>
            </div>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPreviousSessions(!showPreviousSessions)}
              className="hover:bg-purple-50"
              title="Previous Chat"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={createNewChatSession}
              className="hover:bg-purple-50"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearCurrentChat}
              className="hover:bg-red-50 hover:border-red-200"
              title="Clear Chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={initializeChat}
              className="hover:bg-purple-50"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Previous Sessions Panel */}
        {showPreviousSessions && (
          <div className="border-b border-purple-100 bg-purple-25 p-4 max-h-40 overflow-y-auto">
            <h4 className="text-sm font-medium text-purple-800 mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Previous Chat Sessions
            </h4>
            <div className="space-y-2">
              {previousSessions.length > 0 ? (
                previousSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => loadChatSession(session)}
                    className="w-full text-left p-2 text-xs bg-white rounded-lg hover:bg-purple-50 border border-purple-100"
                  >
                    <div className="font-medium text-purple-700">{session.session_name}</div>
                    <div className="text-gray-500">
                      {new Date(session.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-500">No previous sessions found</p>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 p-6 bg-gradient-to-b from-purple-25 to-blue-25">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.is_bot ? "justify-start" : "justify-end"}`}
            >
              {message.is_bot && (
                <Avatar className="w-8 h-8 border-2 border-purple-200">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                  message.is_bot
                    ? "bg-white border border-purple-100 text-gray-800"
                    : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                }`}
              >
                <div className="flex flex-col">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.message}
                  </p>
                  <div className={`flex items-center gap-2 mt-2 text-xs ${
                    message.is_bot ? "text-gray-500" : "text-purple-100"
                  }`}>
                    <span className="font-medium">
                      {message.is_bot ? "MindMate" : getUserDisplayName()}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              {!message.is_bot && (
                <Avatar className="w-8 h-8 border-2 border-blue-200">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
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
