
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Bot, RefreshCw, History, Plus, Trash2 } from "lucide-react";

interface ChatHeaderProps {
  showPreviousSessions: boolean;
  setShowPreviousSessions: (show: boolean) => void;
  createNewChatSession: () => void;
  clearCurrentChat: () => void;
  initializeChat: () => void;
}

const ChatHeader = ({
  showPreviousSessions,
  setShowPreviousSessions,
  createNewChatSession,
  clearCurrentChat,
  initializeChat,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
          <Bot className="h-7 w-7 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            Chat with MindMate
          </h3>
          <p className="text-sm text-indigo-100 font-normal">
            Your AI mental health companion 💜
          </p>
        </div>
      </CardTitle>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowPreviousSessions(!showPreviousSessions)}
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white rounded-xl"
          title="Previous Chat"
        >
          <History className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={createNewChatSession}
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white rounded-xl"
          title="New Chat"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearCurrentChat}
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-red-500/50 hover:text-white rounded-xl"
          title="Clear Chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={initializeChat}
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white rounded-xl"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
