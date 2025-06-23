import React, { useState } from 'react';
import { Bell, User, Search } from 'lucide-react';

const Header: React.FC = () => {
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center flex-1">
          <h1 className="text-2xl font-semibold text-gray-800 hidden md:block">Employee Sidekick</h1>
        </div>
        
        <div className="flex items-center md:ml-6 space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="hidden md:block w-64 rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <button className="p-2 text-gray-500 hover:text-gray-700 relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 inline-block h-4 w-4 rounded-full bg-red-500 text-xs text-white font-bold text-center">
                {notifications}
              </span>
            )}
          </button>
          
          <div className="border-l border-gray-200 h-6 mx-2" />
          
          <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
            <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
              <User className="h-5 w-5" />
            </span>
            <span className="hidden md:block">John Doe</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;