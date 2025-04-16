import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle } from 'lucide-react';

const Notification = ({ type = 'success', message, isVisible, onClose }) => {
  const icons = {
    success: <Check className="text-green-500" size={20} />,
    error: <X className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-yellow-500" size={20} />
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-100 p-4 flex items-center gap-3 z-50"
        >
          {icons[type]}
          <p className="text-gray-700">{message}</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full"
          >
            <X size={16} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
