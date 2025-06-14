
export interface Message {
  id: string;
  message: string;
  is_bot: boolean;
  created_at: string;
  sentiment_score?: number;
}

export interface ChatSession {
  id: string;
  session_name: string;
  created_at: string;
}

export interface ChatBotProps {
  user: any;
}
