import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useConversation } from '../../hooks/useConversation';
import ConversationItem from '../ui/ConversationItem';

const Sidebar = () => {
  const navigate = useNavigate();
  const { 
    conversations, 
    currentConversation, 
    createConversation, 
    selectConversation,
    deleteConversation,
    loading
  } = useConversation();

  const handleNewConversation = async () => {
    const newConversation = await createConversation();
    if (newConversation) {
      navigate(`/conversation/${newConversation.id}`);
    }
  };

  const handleSelectConversation = (id) => {
    selectConversation(id);
    navigate(`/conversation/${id}`);
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4">
        <button 
          onClick={handleNewConversation}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
        >
          <FiPlus /> New Conversation
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="flex justify-center p-4">
            <p>Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            <p>No conversations yet</p>
            <p className="text-sm mt-2">Start a new conversation to begin</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <ConversationItem 
                key={conversation.id}
                title={conversation.title}
                date={format(new Date(conversation.updatedAt), 'MMM d, yyyy')}
                active={currentConversation && currentConversation.id === conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                onDelete={(e) => {
                  e.stopPropagation();
                  deleteConversation(conversation.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;