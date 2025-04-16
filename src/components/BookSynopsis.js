import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight, Calendar, Star, Book, ExternalLink, AlertCircle } from 'lucide-react';
import { fetchBookDetails } from '../utils/bookApi';

const BookSynopsis = ({ book, onClose }) => {
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    const checkApiStatus = () => {
      if (window._lastBookApiRequest) {
        setApiStatus(window._lastBookApiRequest);
      }
    };

    // Check every 500ms for API status updates
    const interval = setInterval(checkApiStatus, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await fetchBookDetails(book.title, book.author);
        if (details) {
          setBookDetails(details);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getBookDetails();
  }, [book.title, book.author]);

  if (!book) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* API Status Indicator */}
        {apiStatus && (
          <div className={`absolute top-0 left-0 right-0 p-2 text-xs text-center rounded-t-lg
            ${apiStatus.status === 'fetching' ? 'bg-blue-100 text-blue-700' :
              apiStatus.status === 'success' ? 'bg-green-100 text-green-700' :
              apiStatus.status === 'error' ? 'bg-red-100 text-red-700' :
              apiStatus.status === 'no_results' ? 'bg-yellow-100 text-yellow-700' : ''
            }`}
          >
            {apiStatus.status === 'fetching' && 'Fetching book details...'}
            {apiStatus.status === 'success' && `Found: ${apiStatus.data.title}`}
            {apiStatus.status === 'error' && (
              <div className="flex items-center justify-center gap-1">
                <AlertCircle size={14} />
                <span>{apiStatus.error}</span>
              </div>
            )}
            {apiStatus.status === 'no_results' && 'No results found'}
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>

        <div className="flex gap-4 mt-8">
          <div className="w-1/3">
            <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={bookDetails?.coverImage || book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1 leading-tight">
              {bookDetails?.title || book.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              by {bookDetails?.author || book.author}
            </p>
            
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <Calendar size={14} />
              <span>{bookDetails?.releaseDate || book.releaseDate || 'Release date not available'}</span>
            </div>

            {bookDetails?.averageRating && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span>
                  {bookDetails.averageRating.toFixed(1)} ({bookDetails.ratingsCount.toLocaleString()} ratings)
                </span>
              </div>
            )}
            
            <div className="space-y-1 mb-4">
              <div className="text-xs text-gray-500">Genre</div>
              <div className="text-sm text-gray-900">
                {bookDetails?.genre || book.genre || 'Genre not specified'}
              </div>
            </div>

            {bookDetails?.pageCount && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                <Book size={14} />
                <span>{bookDetails.pageCount} pages</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="text-xs text-gray-500">Synopsis</div>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ) : error ? (
                <p className="text-sm text-red-600">
                  Error loading synopsis. Using fallback data.
                </p>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-6">
                  {bookDetails?.synopsis || book.synopsis || 
                    "A captivating story that promises to take readers on an unforgettable journey. " +
                    "This book weaves together compelling characters and intricate plotlines into a " +
                    "narrative that will keep you engaged from start to finish."}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {bookDetails?.previewLink && (
            <motion.a
              href={bookDetails.previewLink}
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
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (book.amazonLink) {
                window.open(book.amazonLink, '_blank');
              } else {
                const searchQuery = `${book.title} ${book.author}`.replace(/ /g, '+');
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
  );
};

export default BookSynopsis;
