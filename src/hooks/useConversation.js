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
    try {
      // If no current conversation, create one
      let conversation = currentConversation;
      if (!conversation) {
        conversation = await createConversation();
      }
      
      if (!conversation) {
        console.error('Failed to create or get conversation');
        return null;
      }
      
      // Create user message
      const userMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };
      
      // Add user message to conversation
      await addMessage(conversation.id, userMessage);
      
      // Simulate a response from the virtual psychiatrist
      await simulateResponse(conversation.id);
      
      return userMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  // Simulate a response from the virtual psychiatrist
  const simulateResponse = async (conversationId) => {
    try {
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
    } catch (error) {
      console.error('Error simulating response:', error);
      return null;
    }
  };

  // Get a simulated response for testing
  const getSimulatedResponse = () => {
    const responses = [
      "I understand you're going through a challenging time. Could you tell me more about what's been on your mind?",
      "Thank you for sharing that with me. How have these feelings been affecting your daily life?",
      "It's brave of you to open up about this. What coping strategies have you tried so far?",
      "I hear you, and I want you to know that your feelings are valid. Have you noticed any specific triggers for these emotions?",
      "That's a significant observation. Would you be interested in exploring some mindfulness techniques together?",
      "I appreciate your honesty. How does your support system look like? Do you have people you can talk to?",
      "It sounds like you're dealing with a lot right now. Have you considered speaking with a mental health professional?",
      "Your feelings matter, and it's okay to not be okay. What kind of support would be most helpful for you right now?"
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