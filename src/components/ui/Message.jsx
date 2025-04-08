import React from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { FiUser } from 'react-icons/fi';

const Message = ({ role, content, timestamp }) => {
  const isUser = role === 'user';
  const formattedTime = format(new Date(timestamp), 'h:mm a');
  
  return (
    <div className={`flex mb-6 animate-fadeIn ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl rounded-lg p-4 ${isUser ? 'message-human' : 'message-assistant'}`}>
        <div className="flex items-center mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'
          }`}>
            {isUser ? (
              <FiUser className="w-4 h-4" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L10.12 9.88L4 12L10.12 14.12L12 20L13.88 14.12L20 12L13.88 9.88L12 4Z" fill="currentColor" />
              </svg>
            )}
          </div>
          <div className="ml-2">
            <div className={`font-medium ${isUser ? 'text-white' : 'text-gray-900'}`}>
              {isUser ? 'You' : 'Virtual Psychiatrist'}
            </div>
            <div className={`text-xs ${isUser ? 'text-white/80' : 'text-gray-500'}`}>
              {formattedTime}
            </div>
          </div>
        </div>
        
        <div className={`prose max-w-none ${isUser ? 'text-white' : 'text-gray-900'}`}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;