import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Trash2, ShoppingCart, ChevronRight, Calendar } from 'lucide-react';
import { useTBR } from '../contexts/TBRContext';
import { fetchBookDetails } from '../utils/bookApi';
import BookSynopsis from './BookSynopsis';

const TBRListCompact = ({ isOpen, onClose }) => {
  const { tbrList, removeFromTBR } = useTBR();
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookDetails, setBookDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBookDetails = async () => {
      setLoading(true);
      const details = {};
      
      for (const book of tbrList) {
        try {
          const bookInfo = await fetchBookDetails(book.title, book.author);
          if (bookInfo) {
            details[`${book.title}-${book.author}`] = bookInfo;
          }
        } catch (error) {
          console.error(`Error fetching details for ${book.title}:`, error);
        }
      }
      
      setBookDetails(details);
      setLoading(false);
    };

    if (tbrList.length > 0) {
      fetchAllBookDetails();
    }
  }, [tbrList]);

  const getBookDetails = (book) => {
    return bookDetails[`${book.title}-${book.author}`] || book;
  };

  const handleBuyClick = (e, book) => {
    e.stopPropagation();
    if (book.amazonLink) {
      window.open(book.amazonLink, '_blank');
    } else {
      const searchQuery = `${book.title} ${book.author}`.replace(/ /g, '+');
      window.open(`https://www.amazon.com/s?k=${searchQuery}&i=stripbooks`, '_blank');
    }
  };

  const handleRemove = (e, bookId) => {
    e.stopPropagation();
    removeFromTBR(bookId);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="bg-white w-full max-w-md h-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
            <div className="flex items-center gap-2">
              <BookOpen className="text-[#5D4037]" size={16} />
              <h2 className="text-sm font-medium text-gray-800">To Be Read</h2>
              <span className="px-1.5 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                {tbrList.length}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-600" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto pb-16">
            <AnimatePresence>
              {tbrList.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <BookOpen size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">Your TBR list is empty</p>
                </motion.div>
              ) : (
                <motion.div layout className="grid grid-cols-1 divide-y divide-gray-100">
                  {tbrList.map((book) => {
                    const details = getBookDetails(book);
                    return (
                      <motion.div
                        key={book._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onClick={() => setSelectedBook(details)}
                        className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group relative"
                      >
                        <div className="w-12 h-[4.5rem] flex-shrink-0 overflow-hidden rounded shadow-sm bg-gray-100">
                          {loading ? (
                            <div className="w-full h-full animate-pulse bg-gray-200" />
                          ) : (
                            <img
                              src={details.coverImage || '/placeholder-book.png'}
                              alt={details.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-book.png';
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <h3 className="font-medium text-sm text-gray-800 leading-tight mb-1 truncate group-hover:text-[#5D4037]">
                            {details.title}
                          </h3>
                          <p className="text-xs text-gray-600 mb-1.5 truncate">{details.author}</p>
                          <div className="flex items-center gap-4">
                            {details.genre && (
                              <span className="text-xs text-gray-500 truncate">{details.genre}</span>
                            )}
                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleBuyClick(e, book)}
                                className="text-xs text-gray-400 hover:text-[#FF9900] transition-colors flex items-center gap-1"
                                title="Buy on Amazon"
                              >
                                <ShoppingCart size={14} />
                                <span className="text-xs">Buy</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleRemove(e, book._id)}
                                className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                                title="Remove from TBR"
                              >
                                <Trash2 size={14} />
                                <span className="text-xs">Remove</span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedBook && (
          <BookSynopsis book={selectedBook} onClose={() => setSelectedBook(null)} />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default TBRListCompact;
