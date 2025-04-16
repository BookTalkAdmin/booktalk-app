import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationsDropdown from './NotificationsDropdown';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BookTalk
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/browse" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              Browse
            </Link>
            {user && (
              <Link to="/messages" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                Messages
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationsDropdown />
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <img
                      src={user.avatar || 'https://via.placeholder.com/32'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  </button>
                  <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {/* Handle login */}}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            {user && (
              <Link
                to="/messages"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Messages
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  /* Handle login */
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
