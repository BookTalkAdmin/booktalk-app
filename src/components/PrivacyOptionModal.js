import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

const PrivacyOptionModal = ({ isOpen, onClose, title, options, selectedValue, onSelect }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="relative w-full max-w-lg bg-white rounded-t-xl sm:rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#D4C5BE]">
            <h3 className="text-lg font-medium text-[#6B4D3C]">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-[#8B7B74] hover:text-[#6B4D3C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Options */}
          <div className="p-2">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  onClose();
                }}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-[#FAF7F5] rounded-lg group transition-colors"
              >
                <div>
                  <p className="font-medium text-[#6B4D3C] group-hover:text-[#5D4037]">
                    {option.label}
                  </p>
                  {option.description && (
                    <p className="text-sm text-[#8B7B74] mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
                {selectedValue === option.value && (
                  <Check className="w-5 h-5 text-[#6B4D3C]" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrivacyOptionModal;
