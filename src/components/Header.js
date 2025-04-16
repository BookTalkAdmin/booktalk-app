import React from 'react';
import { Search, Bell, Upload, BookOpen, User } from 'lucide-react';

const Header = ({ onSearch, setIsUploadOpen }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 py-2 flex items-center gap-4">
        <BookOpen className="w-6 h-6 text-[#5D4037]" />
        
        <div className="flex-1 relative">
          <input
            type="search"
            placeholder="Search books..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
            onChange={(e) => onSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Upload className="w-5 h-5 text-gray-600" />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
