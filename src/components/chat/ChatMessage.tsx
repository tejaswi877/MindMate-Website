
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User as UserIcon } from "lucide-react";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
  getUserDisplayName: () => string;
}

const ChatMessage = ({ message, getUserDisplayName }: ChatMessageProps) => {
  return (
    <div
      className={`flex items-start gap-3 ${message.is_bot ? "justify-start" : "justify-end"}`}
    >
      {message.is_bot && (
        <Avatar className="w-8 h-8 border-2" style={{ borderColor: '#c7d2fe' }}>
          <AvatarFallback className="text-white text-xs" style={{ backgroundColor: '#8b5cf6' }}>
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
          message.is_bot
            ? "text-gray-800"
            : "text-white"
        }`}
        style={{
          backgroundColor: message.is_bot ? '#ffffff' : '#8b5cf6',
          border: message.is_bot ? '1px solid #e0e7ff' : 'none'
        }}
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
        <Avatar className="w-8 h-8 border-2" style={{ borderColor: '#c7d2fe' }}>
          <AvatarFallback className="text-white text-xs" style={{ backgroundColor: '#6366f1' }}>
            <UserIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
