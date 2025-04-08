import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchConversations, saveConversation } from '../services/azureService';

export const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load conversations from Azure or sample data
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
        console.error('Error loading conversations:', err);
        // Initialize with sample data if there's an error
        const sampleData = getSampleConversations();
        setConversations(sampleData);
        if (sampleData.length > 0) {
          setCurrentConversation(sampleData[0]);
        }
        setLoading(false);
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
      // For now, just update the local state
      setConversations(prev => [newConversation, ...prev]);
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
      // For now, just update the local state
      setConversations(prev =>
        prev.map(c => c.id === conversationId ? updatedConversation : c)
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

// Sample data for development/testing
function getSampleConversations() {
  return [
    {
      id: '1',
      title: 'Discussing anxiety management techniques',
      createdAt: '2024-04-01T10:30:00Z',
      updatedAt: '2024-04-01T11:15:00Z',
      messages: [
        {
          id: '1-1',
          role: 'user',
          content: 'I\'ve been feeling really anxious lately, especially at work. Do you have any techniques that might help?',
          timestamp: '2024-04-01T10:30:00Z'
        },
        {
          id: '1-2',
          role: 'assistant',
          content: 'I understand how difficult anxiety can be, especially in a work environment. There are several techniques that might help you manage these feelings. Deep breathing exercises, progressive muscle relaxation, and mindfulness meditation can be effective in the moment. Would you like me to explain any of these in more detail?',
          timestamp: '2024-04-01T10:32:00Z'
        }
      ]
    }
  ];
}