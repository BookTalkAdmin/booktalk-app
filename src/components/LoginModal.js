import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, AlertCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login with:', { email, password });
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        console.log('Attempting registration with:', { username, email, password });
        await register(username, email, password);
      }
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#D4C5BE]">
            <h3 className="text-lg font-medium text-[#6B4D3C]">
              {isLogin ? 'Login to BookTalk' : 'Create Account'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-[#8B7B74] hover:text-[#6B4D3C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#6B4D3C] mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7B74]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C]"
                    placeholder="johndoe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#6B4D3C] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7B74]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C]"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B4D3C] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7B74]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#6B4D3C] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7B74]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C]"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#6B4D3C] text-white rounded-lg hover:bg-[#8B7B74] transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={toggleMode}
              className="w-full text-center text-[#6B4D3C] hover:text-[#8B7B74] transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
