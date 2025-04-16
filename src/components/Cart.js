import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Cart = ({ isOpen, onClose, items = [], onRemoveItem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const stripe = await stripePromise;
      
      // Create checkout session
      const response = await axios.post('/api/create-checkout-session', {
        items,
      });

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-white w-full max-w-md h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-[#5D4037]" />
                <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-8"
                  >
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </motion.div>
                ) : (
                  <motion.div layout className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-20 h-28 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.author}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="font-semibold text-[#5D4037]">
                              ${item.price}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onRemoveItem?.(item)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="border-t p-4 space-y-4"
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-[#5D4037]">${total.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full py-3 bg-[#5D4037] text-white rounded-xl hover:bg-[#4A332C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;
