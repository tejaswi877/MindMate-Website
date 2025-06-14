
import { MessageSquare } from "lucide-react";
import { ChatSession } from "@/types/chat";

interface ChatSessionsListProps {
  previousSessions: ChatSession[];
  loadChatSession: (session: ChatSession) => void;
}

const ChatSessionsList = ({ previousSessions, loadChatSession }: ChatSessionsListProps) => {
  return (
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
  );
};

export default ChatSessionsList;
