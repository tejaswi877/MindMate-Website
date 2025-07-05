
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ChatSession } from '@/types/chat';

export const useChatSessions = (userId: string | undefined) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const fetchSessions = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load chat sessions",
        variant: "destructive"
      });
    }
  };

  const refetchSessions = async () => {
    await fetchSessions();
  };

  useEffect(() => {
    fetchSessions();
  }, [userId]);

  return {
    sessions,
    refetchSessions
  };
};
