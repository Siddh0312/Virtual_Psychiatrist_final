import { BlobServiceClient } from '@azure/storage-blob';

// These would come from environment variables in production
const connectionString = process.env.REACT_APP_AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'psychiatrist-conversations';

// Initialize the BlobServiceClient
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

// Fetch all conversations
export const fetchConversations = async () => {
  try {
    // For development/testing - return sample data if Azure connection isn't set up
    if (!connectionString) {
      console.warn('Azure connection string not found, using sample data');
      return getSampleConversations();
    }

    const conversations = [];
    
    // List all blobs in the container
    for await (const blob of containerClient.listBlobsFlat()) {
      const blobClient = containerClient.getBlobClient(blob.name);
      const downloadResponse = await blobClient.download();
      const content = await streamToText(downloadResponse.readableStreamBody);
      conversations.push(JSON.parse(content));
    }
    
    // Sort by updated date (newest first)
    return conversations.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  } catch (error) {
    console.error('Error fetching conversations from Azure:', error);
    // Fall back to sample data for development/testing
    return getSampleConversations();
  }
};

// Save a conversation
export const saveConversation = async (conversation) => {
  try {
    // For development/testing - log data if Azure connection isn't set up
    if (!connectionString) {
      console.warn('Azure connection string not found, logging conversation data:', conversation);
      return conversation;
    }

    const blobName = `conversation-${conversation.id}.json`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    const data = JSON.stringify(conversation);
    await blockBlobClient.upload(data, data.length);
    
    return conversation;
  } catch (error) {
    console.error('Error saving conversation to Azure:', error);
    throw error;
  }
};

// Helper function to convert a readable stream to text
async function streamToText(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => {
      chunks.push(data.toString());
    });
    readableStream.on('end', () => {
      resolve(chunks.join(''));
    });
    readableStream.on('error', reject);
  });
}

// Sample data for development/testing
function getSampleConversations() {
  return [
    {
      id: '1',
      title: 'Discussing anxiety management techniques',
      createdAt: '2025-04-01T10:30:00Z',
      updatedAt: '2025-04-01T11:15:00Z',
      messages: [
        {
          id: '1-1',
          role: 'user',
          content: 'I\'ve been feeling really anxious lately, especially at work. Do you have any techniques that might help?',
          timestamp: '2025-04-01T10:30:00Z'
        },
        {
          id: '1-2',
          role: 'assistant',
          content: 'I understand how difficult anxiety can be, especially in a work environment. There are several techniques that might help you manage these feelings. Deep breathing exercises, progressive muscle relaxation, and mindfulness meditation can be effective in the moment. Would you like me to explain any of these in more detail?',
          timestamp: '2025-04-01T10:32:00Z'
        },
        {
          id: '1-3',
          role: 'user',
          content: 'Yes, could you tell me more about mindfulness meditation? I\'ve heard about it but never tried it.',
          timestamp: '2025-04-01T10:35:00Z'
        },
        {
          id: '1-4',
          role: 'assistant',
          content: 'Mindfulness meditation is about being fully present and engaged in the current moment, aware of your thoughts and feelings without judgment. Here\'s a simple practice to start with:\n\n1. Find a quiet place to sit comfortably\n2. Focus your attention on your breathing\n3. Notice the sensation of each inhale and exhale\n4. When your mind wanders (which is normal), gently bring your focus back to your breathing\n5. Start with just 5 minutes daily and gradually increase\n\nWould you like to try a brief guided session now?',
          timestamp: '2025-04-01T10:40:00Z'
        }
      ]
    },
    {
      id: '2',
      title: 'Sleep improvement strategies',
      createdAt: '2025-03-28T20:15:00Z',
      updatedAt: '2025-03-28T20:45:00Z',
      messages: [
        {
          id: '2-1',
          role: 'user',
          content: 'I\'m having trouble sleeping lately. I toss and turn for hours before falling asleep. Any advice?',
          timestamp: '2025-03-28T20:15:00Z'
        },
        {
          id: '2-2',
          role: 'assistant',
          content: 'I\'m sorry to hear you\'re struggling with sleep. Insomnia can be really frustrating. There are several evidence-based strategies that might help improve your sleep quality. Would you like to tell me more about your current sleep routine? This could help me provide more tailored suggestions.',
          timestamp: '2025-03-28T20:17:00Z'
        }
      ]
    }
  ];
}