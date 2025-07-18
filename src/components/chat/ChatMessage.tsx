
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
        <Avatar className="w-8 h-8 border-2 border-purple-200">
          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
          message.is_bot
            ? "bg-white border border-gray-200 text-gray-800"
            : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
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
        <Avatar className="w-8 h-8 border-2 border-purple-200">
          <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs">
            <UserIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
