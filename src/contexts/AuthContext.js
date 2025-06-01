import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
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
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage');
        setLoading(false);
        return;
      }

      try {
        console.log('Attempting to restore session with token');
        const userData = await auth.getCurrentUser();
        if (userData) {
          console.log('Session restored successfully');
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const updateUser = async (userData) => {
    try {
      const response = await api.patch(`/users/${user._id}`, userData);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to update user:', err);
      throw err;
    }
  };

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

  const register = async ({ username, email, password, firstName, lastName }) => {
    try {
      console.log('AuthContext: Attempting registration...');
      const response = await api.post('/auth/register', { username, email, password, firstName, lastName });
      const { token } = response.data;
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
