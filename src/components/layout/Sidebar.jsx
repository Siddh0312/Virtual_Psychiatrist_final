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
    <aside className="w-80 min-w-80 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <button 
          onClick={handleNewConversation}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <FiPlus className="w-5 h-5" /> New Conversation
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-gray-600">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center p-8 space-y-2">
            <p className="text-gray-600 font-medium">No conversations yet</p>
            <p className="text-sm text-gray-500">Start a new conversation to begin</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
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