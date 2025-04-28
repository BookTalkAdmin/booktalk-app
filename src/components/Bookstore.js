import React, { useState, useEffect } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { genres, getTopBooksByGenre, getNewReleases, getBestsellers } from '../services/bookService';
import { motion } from 'framer-motion';

const BookStore = () => {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bestsellers');

  useEffect(() => {
    fetchBooks();
  }, [selectedGenre, activeTab]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let fetchedBooks;
      if (activeTab === 'bestsellers') {
        fetchedBooks = await getBestsellers();
      } else if (activeTab === 'new') {
        fetchedBooks = await getNewReleases();
      } else if (selectedGenre !== 'all') {
        fetchedBooks = await getTopBooksByGenre(selectedGenre);
      } else {
        // Fetch a mix of books from different genres
        const promises = Object.keys(genres).slice(0, 4).map(genre => 
          getTopBooksByGenre(genre, 3)
        );
        const results = await Promise.all(promises);
        fetchedBooks = results.flat();
      }
      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'bestsellers', name: 'Bestsellers' },
    { id: 'new', name: 'New Releases' },
    { id: 'browse', name: 'Browse by Genre' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-[#D4C5BE] mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 relative ${
                  activeTab === tab.id
                    ? 'text-[#6B4D3C] font-medium'
                    : 'text-[#8B7B74] hover:text-[#6B4D3C]'
                }`}
              >
                {tab.name}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B4D3C]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Genre Filter (only show when in browse mode) */}
        {activeTab === 'browse' && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-[#6B4D3C]">
              {selectedGenre === 'all' ? 'All Genres' : genres[selectedGenre].name}
            </h2>
            
            <div className="relative">
              <button
                onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D4C5BE] rounded-lg hover:bg-[#FAF7F5] transition-colors"
              >
                <span className="text-sm font-medium text-[#6B4D3C]">
                  {selectedGenre === 'all' ? 'All Genres' : genres[selectedGenre].name}
                </span>
              </button>

              {showGenreDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowGenreDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#D4C5BE] z-20">
                    <button
                      onClick={() => {
                        setSelectedGenre('all');
                        setShowGenreDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[#FAF7F5] ${
                        selectedGenre === 'all' ? 'bg-[#FAF7F5] text-[#6B4D3C] font-medium' : 'text-[#8B7B74]'
                      }`}
                    >
                      All Genres
                    </button>
                    {Object.entries(genres).map(([id, { name }]) => (
                      <button
                        key={id}
                        onClick={() => {
                          setSelectedGenre(id);
                          setShowGenreDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#FAF7F5] ${
                          selectedGenre === id ? 'bg-[#FAF7F5] text-[#6B4D3C] font-medium' : 'text-[#8B7B74]'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 p-4">
            {books.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  <div className="aspect-[2/3] rounded-md overflow-hidden bg-gray-100 shadow group-hover:shadow-md transition-shadow">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-book.png';
                      }}
                    />
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-xs font-medium text-gray-900 line-clamp-1 group-hover:text-[#6B4D3C] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 line-clamp-1">
                      {book.author}
                    </p>
                    {book.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span className="text-[10px] text-gray-500">
                          {book.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    <a
                      href={book.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-[10px] text-[#FF9900] hover:text-[#FF9900]/80 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                    >
                      View on Amazon
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookStore;
