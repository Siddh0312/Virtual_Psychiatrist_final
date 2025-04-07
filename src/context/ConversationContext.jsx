import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchConversations, saveConversation } from '../services/azureService';

export const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load conversations from Azure
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await fetchConversations();
        setConversations(data);
        
        // Set the most recent conversation as current if none selected
        if (data.length > 0 && !currentConversation) {
          setCurrentConversation(data[0]);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load conversations');
        setLoading(false);
        console.error('Error loading conversations:', err);
      }
    };
    
    loadConversations();
  }, []);

  // Create a new conversation
  const createConversation = async () => {
    const newConversation = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await saveConversation(newConversation);
      setConversations([newConversation, ...conversations]);
      setCurrentConversation(newConversation);
      return newConversation;
    } catch (err) {
      setError('Failed to create new conversation');
      console.error('Error creating conversation:', err);
      return null;
    }
  };

  // Add message to conversation
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
      await saveConversation(updatedConversation);
      
      setConversations(
        conversations.map(c => 
          c.id === conversationId ? updatedConversation : c
        )
      );
      
      if (currentConversation && currentConversation.id === conversationId) {
        setCurrentConversation(updatedConversation);
      }
      
      return updatedConversation;
    } catch (err) {
      setError('Failed to save message');
      console.error('Error saving message:', err);
      return null;
    }
  };

  // Extract title from first message
  const extractTitle = (content) => {
    // Limit title to first 30 characters of first message
    return content.length > 30 ? content.substring(0, 30) + '...' : content;
  };

  // Select a conversation
  const selectConversation = (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  // Delete a conversation
  const deleteConversation = async (conversationId) => {
    try {
      // Implementation for deleting from Azure would go here
      
      const updatedConversations = conversations.filter(c => c.id !== conversationId);
      setConversations(updatedConversations);
      
      if (currentConversation && currentConversation.id === conversationId) {
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