
export interface Message {
  id: string;
  message: string;
  is_bot: boolean;
  emotion_detected?: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  session_name: string;
  created_at: string;
}

export interface ChatBotProps {
  user: any;
}

export interface UserProfile {
  id: string;
  username?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}
