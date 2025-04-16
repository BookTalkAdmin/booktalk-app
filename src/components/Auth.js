import React, { useState, useContext, createContext } from 'react';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock auth functions for now
  const signup = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentUser({ email });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentUser({ email });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#5D4037]" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export default AuthContext;
