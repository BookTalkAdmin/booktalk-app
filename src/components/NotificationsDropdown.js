import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageCircle, Bookmark, MessageSquare, Trash2 } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, handleNotificationClick, clearAllNotifications } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'bookmark':
        return <Bookmark className="w-5 h-5 text-purple-500" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'message':
        return `${notification.data.sender} sent you a message`;
      case 'bookmark':
        return `${notification.data.user} bookmarked your video "${notification.data.videoTitle}"`;
      case 'comment':
        return `${notification.data.user} commented on your video "${notification.data.videoTitle}"`;
      default:
        return notification.message;
    }
  };

  return (
    <div className="relative">
      {/* Bell icon with notification count */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-700">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <motion.button
                    key={notification.id}
                    onClick={() => {
                      handleNotificationClick(notification);
                      setIsOpen(false);
                    }}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 text-left ${
                      notification.read ? 'bg-white' : 'bg-blue-50'
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 mb-1">
                        {getNotificationMessage(notification)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown;
