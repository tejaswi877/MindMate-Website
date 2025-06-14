
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
  );
};

export default ChatHeader;
