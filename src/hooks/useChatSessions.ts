
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Message, ChatSession } from '@/types/chat';

export const useChatSessions = (user: User) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [previousSessions, setPreviousSessions] = useState<ChatSession[]>([]);

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
      loadPreviousSessions();

      toast({
        title: "New Chat Created",
        description: "Started a fresh conversation with MindMate",
      });

      return newSession.id;
    } catch (error: any) {
      console.error("Error creating new session:", error);
      toast({
        title: "Error",
        description: "Failed to create new chat session",
        variant: "destructive",
      });
      return null;
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
        return session.id;
      }
    } catch (error: any) {
      console.error("Error initializing chat:", error);
      toast({
        title: "Error",
        description: "Failed to initialize chat",
        variant: "destructive",
      });
      return null;
    }
  };

  const loadChatSession = async (session: ChatSession) => {
    try {
      setSessionId(session.id);

      toast({
        title: "Chat Loaded",
        description: `Loaded chat: ${session.session_name}`,
      });

      return session.id;
    } catch (error: any) {
      console.error("Error loading chat session:", error);
      toast({
        title: "Error",
        description: "Failed to load chat session",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    loadPreviousSessions();
  }, []);

  return {
    sessionId,
    setSessionId,
    previousSessions,
    loadPreviousSessions,
    createNewChatSession,
    initializeChat,
    loadChatSession,
  };
};
