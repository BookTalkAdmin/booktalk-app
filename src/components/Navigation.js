import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Book, MessageSquare, ShoppingBag, Search, X, Bookmark, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            <div className="flex items-center gap-3 p-4 border-b">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search books, people, or videos..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <button
                onClick={() => setShowSearch(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="text-gray-600" size={24} />
              </button>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Add your search results here */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Search Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-2 hidden md:block">
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            placeholder="Search books, people, or videos..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <button
              onClick={() => navigate('/')}
              className={`flex flex-col items-center ${
                isActive('/') ? 'text-[#5D4037]' : 'text-gray-600 hover:text-[#5D4037]'
              }`}
            >
              <Book size={24} />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => setShowSearch(true)}
              className={`flex flex-col items-center md:hidden ${
                showSearch ? 'text-[#5D4037]' : 'text-gray-600 hover:text-[#5D4037]'
              }`}
            >
              <Search size={24} />
              <span className="text-xs mt-1">Search</span>
            </button>
            <button
              onClick={() => navigate('/tbr')}
              className={`flex flex-col items-center ${
                isActive('/tbr') ? 'text-[#5D4037]' : 'text-gray-600 hover:text-[#5D4037]'
              }`}
            >
              <BookOpen size={24} />
              <span className="text-xs mt-1">TBR</span>
            </button>
            <button
              onClick={() => navigate('/messages')}
              className={`flex flex-col items-center ${
                isActive('/messages') ? 'text-[#5D4037]' : 'text-gray-600 hover:text-[#5D4037]'
              }`}
            >
              <MessageSquare size={24} />
              <span className="text-xs mt-1">Messages</span>
            </button>
            <button
              onClick={() => navigate('/bookstore')}
              className={`flex flex-col items-center ${
                isActive('/bookstore') ? 'text-[#5D4037]' : 'text-gray-600 hover:text-[#5D4037]'
              }`}
            >
              <ShoppingBag size={24} />
              <span className="text-xs mt-1">Bookstore</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
