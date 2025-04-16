import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await auth.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login...');
      const { token } = await auth.login(email, password);
      console.log('AuthContext: Login successful, got token');
      localStorage.setItem('token', token);
      const userData = await auth.getCurrentUser();
      console.log('AuthContext: Got user data:', userData);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to login. Please check your credentials.');
      }
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('AuthContext: Attempting registration...');
      const { token } = await auth.register(username, email, password);
      console.log('AuthContext: Registration successful, got token');
      localStorage.setItem('token', token);
      const userData = await auth.getCurrentUser();
      console.log('AuthContext: Got user data:', userData);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('AuthContext: Registration failed:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to register. Please try again.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    loading
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
