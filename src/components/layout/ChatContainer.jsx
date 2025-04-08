import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import Message from '../ui/Message';
import { useConversation } from '../../hooks/useConversation';

const ChatContainer = () => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { currentConversation, loading, sendMessage } = useConversation();

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
    content: "Hello! I'm your virtual psychiatrist. I'm here to listen and support you. How are you feeling today?",
    timestamp: new Date().toISOString()
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
      
      <div className="border-t border-gray-200 p-4 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="input-primary flex-1"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!message.trim() || isSubmitting}
            className={`btn-primary flex items-center justify-center w-10 h-10 p-0 rounded-lg
              ${(!message.trim() || isSubmitting) 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
              }`}
          >
            <FiSend className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;