import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-2">
        
        <h1 className="text-xl font-semibold">
          <Link to="/" className="text-purple-600 hover:text-purple-700 transition-colors duration-150">
            ClarityBot
          </Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;
