
import React from 'react';

interface ChatHeaderProps {
  sessionId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ sessionId }) => {
  return (
    <div className="text-xs text-muted-foreground mb-2 text-center">
      Session: {sessionId.slice(0, 8)}...
    </div>
  );
};

export default ChatHeader;
