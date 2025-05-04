import { sendToChatbotFunction, sendToEmotionFunction } from '../services/chatApiService';
import { useContext, useState } from 'react';
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

  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [baselineEmotion, setBaselineEmotion] = useState(null);
  const userId = 'student123';

  const sendMessage = async (content) => {
    try {
      let conversation = currentConversation;
      let newConversationCreated = false;

      // 1. Ensure conversation exists
      if (!conversation) {
        conversation = await createConversation();
        newConversationCreated = true;
        if (!conversation) return null;
      }

      const conversationId = conversation.id;

      // 2. Add user message
      const userMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

      if (newConversationCreated) {
        conversation.messages.push(userMessage);
        selectConversation(conversationId);
      }

      await addMessage(conversationId, userMessage);

      // 3. Get assistant message
      let assistantContent = '';
      if (isFirstMessage) {
        const emotionRes = await sendToEmotionFunction(userId, content);
        setBaselineEmotion(emotionRes.emotion);
      
        const chatRes = await sendToChatbotFunction(userId, content, emotionRes.emotion, true);
        assistantContent = chatRes.response;
      
        setIsFirstMessage(false);
      } else {
        const chatRes = await sendToChatbotFunction(userId, content, baselineEmotion);
        assistantContent = chatRes.response;
      }
      

      const botMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date().toISOString()
      };
      await addMessage(conversationId, botMessage);

      return userMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
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
