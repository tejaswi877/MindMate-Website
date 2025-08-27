
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
      className={`flex items-start gap-4 ${message.is_bot ? "justify-start" : "justify-end"}`}
    >
      {message.is_bot && (
        <Avatar className="w-10 h-10 border-3 border-white shadow-lg">
          <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[75%] p-4 rounded-2xl shadow-lg break-words ${
          message.is_bot
            ? "bg-white/80 backdrop-blur-sm border border-indigo-100 text-gray-800"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
        }`}
      >
        <div className="flex flex-col">
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {message.message}
          </p>
          <div className={`flex items-center gap-2 mt-3 text-xs ${
            message.is_bot ? "text-gray-500" : "text-indigo-100"
          }`}>
            <span className="font-semibold">
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
        <Avatar className="w-10 h-10 border-3 border-white shadow-lg">
          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <UserIcon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
