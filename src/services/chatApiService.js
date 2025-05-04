import axios from 'axios';

const AZURE_FUNC_URL = 'http://localhost:7071/api';

export const sendToEmotionFunction = async (userId, message) => {
  const response = await axios.post(`${AZURE_FUNC_URL}/EmotionDetectionFunction`, {
    userId,
    message
  });
  return response.data; // returns: { emotion, confidence, status }
};

export const sendToChatbotFunction = async (userId, message, baselineEmotion = null, isInit = false) => {
  const endpoint = isInit ? 'chatbot/init' : 'chatbot/chat';

  const body = isInit
    ? { userId, firstMessage: message, emotion: baselineEmotion }
    : { userId, student_query: message };

  const response = await axios.post(`http://localhost:7071/api/${endpoint}`, body);
  return response.data;
};
