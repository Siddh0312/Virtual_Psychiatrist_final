import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiUser } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-primary">
          <Link to="/" className="text-purple-700 hover:text-purple-800">
            Virtual Psychiatrist
          </Link>
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/settings" className="text-gray-600 hover:text-gray-800" title="Settings">
          <FiSettings size={20} />
        </Link>
        <Link to="/profile" className="text-gray-600 hover:text-gray-800" title="Profile">
          <FiUser size={20} />
        </Link>
      </div>
    </header>
  );
};

export default Header;