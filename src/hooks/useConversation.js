import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ConversationContext } from '../context/ConversationContext';

export const useConversation = () => {
  const context = useContext(ConversationContext);
  
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  
  const { 
    conversations, 
    currentConversation, 
    loading, 
    error,
    createConversation,
    addMessage,
    selectConversation,
    deleteConversation
  } = context;

  // Send a user message and prepare for response
  const sendMessage = async (content) => {
    // If no current conversation, create one
    let conversation = currentConversation;
    if (!conversation) {
      conversation = await createConversation();
    }
    
    if (!conversation) return null;
    
    // Create user message
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    // Add user message to conversation
    await addMessage(conversation.id, userMessage);
    
    // Normally, you would send the message to your neural network model here
    // For demo purposes, we'll simulate a response
    await simulateResponse(conversation.id);
    
    return userMessage;
  };

  // Simulate a response from the virtual psychiatrist
  const simulateResponse = async (conversationId) => {
    // In a real implementation, this would call your neural network model
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const assistantMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: getSimulatedResponse(),
      timestamp: new Date().toISOString()
    };
    
    await addMessage(conversationId, assistantMessage);
    return assistantMessage;
  };

  // Get a simulated response for testing
  const getSimulatedResponse = () => {
    const responses = [
      "It sounds like you've been going through a challenging time. Could you tell me more about when you first started noticing these feelings?",
      "That's a common experience, and I appreciate your willingness to share. How has this been affecting your daily activities?",
      "I understand this might be difficult to talk about. What strategies have you tried so far to manage these feelings?",
      "It's important to recognize your feelings without judgment. Have you noticed any patterns in when these thoughts occur?",
      "That's a thoughtful observation. Let's explore some techniques that might help you navigate these challenges. Would you be open to trying some mindfulness exercises?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return {
    conversations,
    currentConversation,
    loading,
    error,
    sendMessage,
    selectConversation,
    createConversation,
    deleteConversation
  };
};