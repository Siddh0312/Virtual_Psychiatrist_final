import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const ConversationItem = ({ title, date, active, onClick, onDelete }) => {
  return (
    <div 
      className={`group flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
        active ? 'active-conversation bg-purple-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0 mr-4">
        <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{date}</p>
      </div>
      
      <button 
        className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-150"
        onClick={onDelete}
        title="Delete conversation"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ConversationItem;