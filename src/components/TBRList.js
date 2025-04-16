import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Trash2, ShoppingCart, ChevronRight, Calendar, Star, Book, ExternalLink } from 'lucide-react';
import { useTBR } from '../contexts/TBRContext';
import { fetchBookDetails } from '../utils/bookApi';

const TBRList = () => {
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
    const searchQuery = `${book.title} ${book.author}`.replace(/ /g, '+');
    window.open(`https://www.amazon.com/s?k=${searchQuery}&i=stripbooks`, '_blank');
  };

  const handleRemove = (e, bookId) => {
    e.stopPropagation();
    removeFromTBR(bookId);
  };

  if (!tbrList || tbrList.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Your TBR list is empty. Add some books to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 p-4">
      {tbrList.map((book, index) => {
        const details = getBookDetails(book);
        return (
          <motion.div
            key={`${book.title}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => setSelectedBook(details)}
            >
              <div className="aspect-[2/3] rounded-md overflow-hidden bg-gray-100 shadow group-hover:shadow-md transition-shadow">
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
              <div className="mt-1.5">
                <h3 className="text-xs font-medium text-gray-900 line-clamp-1 group-hover:text-[#6B4D3C] transition-colors">
                  {details.title}
                </h3>
                <p className="text-[10px] text-gray-500 line-clamp-1">
                  {details.author}
                </p>
              </div>
            </motion.div>

            {/* Quick action buttons */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleBuyClick(e, book)}
                className="p-1 bg-white/90 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-[#FF9900] transition-colors"
                title="Buy on Amazon"
              >
                <ShoppingCart size={12} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleRemove(e, book._id)}
                className="p-1 bg-white/90 hover:bg-white rounded-full shadow-sm text-gray-600 hover:text-red-500 transition-colors"
                title="Remove from TBR"
              >
                <Trash2 size={12} />
              </motion.button>
            </div>
          </motion.div>
        );
      })}

      {/* Book Synopsis Modal */}
      {selectedBook && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedBook(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>

            <div className="flex gap-4">
              <div className="w-1/3">
                <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedBook.coverImage || '/placeholder-book-cover.jpg'}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-book-cover.jpg';
                    }}
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1 leading-tight">
                  {selectedBook.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  by {selectedBook.author}
                </p>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <Calendar size={14} />
                  <span>{selectedBook.releaseDate || 'Release date not available'}</span>
                </div>

                {selectedBook.averageRating && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span>
                      {selectedBook.averageRating.toFixed(1)} ({selectedBook.ratingsCount.toLocaleString()} ratings)
                    </span>
                  </div>
                )}
                
                <div className="space-y-1 mb-4">
                  <div className="text-xs text-gray-500">Genre</div>
                  <div className="text-sm text-gray-900">
                    {selectedBook.genre || 'Genre not specified'}
                  </div>
                </div>

                {selectedBook.pageCount && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <Book size={14} />
                    <span>{selectedBook.pageCount} pages</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Synopsis</div>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-6">
                    {selectedBook.synopsis || 
                      "A captivating story that promises to take readers on an unforgettable journey. " +
                      "This book weaves together compelling characters and intricate plotlines into a " +
                      "narrative that will keep you engaged from start to finish."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              {selectedBook.previewLink && (
                <motion.a
                  href={selectedBook.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  Preview
                  <ExternalLink size={14} />
                </motion.a>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedBook(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (selectedBook.amazonLink) {
                    window.open(selectedBook.amazonLink, '_blank');
                  } else {
                    const searchQuery = `${selectedBook.title} ${selectedBook.author}`.replace(/ /g, '+');
                    window.open(`https://www.amazon.com/s?k=${searchQuery}&i=stripbooks`, '_blank');
                  }
                }}
                className="px-4 py-2 text-sm text-white bg-[#FF9900] hover:bg-[#FF9900]/90 rounded-lg transition-colors flex items-center gap-1.5"
              >
                Buy on Amazon
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TBRList;
