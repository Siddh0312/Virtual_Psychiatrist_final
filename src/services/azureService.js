import { BlobServiceClient } from '@azure/storage-blob';

// These would come from environment variables in production
const connectionString = process.env.REACT_APP_AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'psychiatrist-conversations';

// Initialize the BlobServiceClient only if connection string is available
let blobServiceClient = null;
let containerClient = null;

if (connectionString) {
  try {
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    containerClient = blobServiceClient.getContainerClient(containerName);
  } catch (error) {
    console.error('Error initializing Azure clients:', error);
  }
}

// Fetch all conversations
export const fetchConversations = async () => {
  try {
    // For development/testing - return sample data if Azure connection isn't set up
    if (!connectionString || !containerClient) {
      console.warn('Azure connection not available, using sample data');
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
    // For development/testing - just return the conversation if Azure connection isn't set up
    if (!connectionString || !containerClient) {
      console.warn('Azure connection not available, skipping save');
      return conversation;
    }

    const blobName = `conversation-${conversation.id}.json`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    const data = JSON.stringify(conversation);
    await blockBlobClient.upload(data, data.length);
    
    return conversation;
  } catch (error) {
    console.error('Error saving conversation to Azure:', error);
    // Return the conversation even if save fails
    return conversation;
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