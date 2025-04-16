import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

const ContactEditModal = ({ isOpen, onClose, type, currentValue, onSave }) => {
  const [value, setValue] = useState(currentValue || '');
  const [error, setError] = useState('');

  const validateInput = () => {
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError('Please enter a valid email address');
        return false;
      }
    } else if (type === 'phone') {
      const phoneRegex = /^\+?[\d\s-()]{10,}$/;
      if (!phoneRegex.test(value)) {
        setError('Please enter a valid phone number');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInput()) {
      onSave(value);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#D4C5BE]">
            <h3 className="text-lg font-medium text-[#6B4D3C]">
              {type === 'email' ? 'Edit Email' : 'Edit Phone Number'}
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
            <div>
              <label className="block text-sm font-medium text-[#6B4D3C] mb-1">
                {type === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <input
                type={type === 'email' ? 'email' : 'tel'}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError('');
                }}
                placeholder={type === 'email' ? 'your@email.com' : '+1 (555) 123-4567'}
                className="w-full px-4 py-2 rounded-lg border border-[#D4C5BE] focus:outline-none focus:border-[#6B4D3C] bg-white"
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#8B7B74] hover:text-[#6B4D3C] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6B4D3C] text-white rounded-lg hover:bg-[#5D4037] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactEditModal;
