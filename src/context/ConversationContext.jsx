import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setConversations([]);
    setCurrentConversation(null);
    setLoading(false);
  }, []);

  const createConversation = async () => {
    const newConversation = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      return newConversation;
    } catch (err) {
      setError('Failed to create new conversation');
      console.error('Error creating conversation:', err);
      return null;
    }
  };

  const addMessage = async (conversationId, message) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const updatedMessages = [...conversation.messages, message];
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      title: updatedMessages.length === 1 ? extractTitle(message.content) : conversation.title,
      updatedAt: new Date().toISOString(),
    };

    try {
      setConversations(prev =>
        prev.map(c => (c.id === conversationId ? updatedConversation : c))
      );

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(updatedConversation);
      }

      return updatedConversation;
    } catch (err) {
      setError('Failed to save message');
      console.error('Error saving message:', err);
      return null;
    }
  };

  const extractTitle = (content) => {
    return content.length > 30 ? content.substring(0, 30) + '...' : content;
  };

  const selectConversation = (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      const updatedConversations = conversations.filter(c => c.id !== conversationId);
      setConversations(updatedConversations);

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(updatedConversations[0] || null);
      }
    } catch (err) {
      setError('Failed to delete conversation');
      console.error('Error deleting conversation:', err);
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        currentConversation,
        loading,
        error,
        createConversation,
        addMessage,
        selectConversation,
        deleteConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
