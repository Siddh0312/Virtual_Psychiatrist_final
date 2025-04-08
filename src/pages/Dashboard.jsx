import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ChatContainer from '../components/layout/ChatContainer';
import { useConversation } from '../hooks/useConversation';

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentConversation, 
    selectConversation, 
    createConversation, 
    conversations,
    loading 
  } = useConversation();

  // Handle conversation selection based on URL parameter
  useEffect(() => {
    const handleConversationSelection = async () => {
      if (id) {
        selectConversation(id);
      } else if (!currentConversation && !loading && conversations.length > 0) {
        // If no ID in URL but conversations exist, navigate to the first one
        navigate(`/conversation/${conversations[0].id}`);
      } else if (!loading && conversations.length === 0) {
        // If no conversations exist and not loading, create a new one
        const newConversation = await createConversation();
        if (newConversation) {
          navigate(`/conversation/${newConversation.id}`);
        }
      }
    };

    handleConversationSelection();
  }, [id, currentConversation, loading, conversations, selectConversation, navigate, createConversation]);

  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <div className="flex flex-1 overflow-hidden w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <ChatContainer />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;