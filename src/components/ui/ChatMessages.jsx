// ✅ FILE: src/components/ui/ChatMessages.jsx

import React from 'react';
import Message from './Message';

const ChatMessages = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-4 px-4 overflow-y-auto max-h-[75vh]">
      {messages.map((msg) => (
        <Message
          key={msg.id}
          role={msg.role}
          content={msg.content}
          timestamp={msg.timestamp}
        />
      ))}
    </div>
  );
};

export default ChatMessages;
