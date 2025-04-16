import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Videos from './pages/Videos';
import Notification from './components/Notification';
import LoginModal from './components/LoginModal';
import { useAuth } from './contexts/AuthContext';

const AppContent = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/messages/:conversationId?" 
          element={user ? <Messages /> : <LoginModal />} 
        />
        <Route 
          path="/videos/:videoId" 
          element={<Videos />} 
        />
      </Routes>
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.show}
        onClose={() => setNotification({ show: false, message: '', type: 'success' })}
      />
    </div>
  );
};

export default AppContent;
