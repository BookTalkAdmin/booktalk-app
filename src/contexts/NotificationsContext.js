import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter(n => !n.read).length);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'message':
        navigate(`/messages/${notification.data.conversationId}`);
        break;
      case 'bookmark':
        navigate(`/videos/${notification.data.videoId}`);
        break;
      case 'comment':
        navigate(`/videos/${notification.data.videoId}?comment=${notification.data.commentId}`);
        break;
      default:
        console.warn('Unknown notification type:', notification.type);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      handleNotificationClick,
      clearAllNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
