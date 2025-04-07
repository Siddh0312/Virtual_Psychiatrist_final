import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import Message from '../ui/Message';
import { useConversation } from '../../hooks/useConversation';

const ChatContainer = () => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { currentConversation, sendMessage } = useConversation();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await sendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const welcomeMessage = {
    role: 'assistant',
    content: "Hello, I'm your virtual psychiatrist. How are you feeling today?",
    timestamp: new Date().toISOString()
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {(!currentConversation || currentConversation.messages.length === 0) ? (
          <Message
            role={welcomeMessage.role}
            content={welcomeMessage.content}
            timestamp={welcomeMessage.timestamp}
          />
        ) : (
          currentConversation.messages.map((msg) => (
            <Message
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!message.trim() || isSubmitting}
            className={`bg-purple-600 text-white py-2 px-4 rounded-r-md 
              ${(!message.trim() || isSubmitting) 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-purple-700'
              }`}
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;