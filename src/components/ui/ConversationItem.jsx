import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const ConversationItem = ({ title, date, active, onClick, onDelete }) => {
  return (
    <div 
      className={`flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 border-l-3 ${active ? 'active-conversation' : ''}`}
      onClick={onClick}
    >
      <div className="flex-1 truncate">
        <h3 className="text-sm font-medium truncate">{title}</h3>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      
      <button 
        className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
        title="Delete conversation"
      >
        <FiTrash2 size={16} />
      </button>
    </div>
  );
};

export default ConversationItem;