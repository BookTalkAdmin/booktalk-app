import React, { useState, useRef } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadModal = ({ isOpen, onClose, genres }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSubgenre, setSelectedSubgenre] = useState('');
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('genre', selectedGenre);
    formData.append('subgenre', selectedSubgenre);
    formData.append('featuredBooks', JSON.stringify(featuredBooks));

    try {
      // Add your API endpoint here
      const response = await fetch('/api/videos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onClose();
        // Reset form
        setVideoFile(null);
        setTitle('');
        setDescription('');
        setTags('');
        setSelectedGenre('');
        setSelectedSubgenre('');
        setFeaturedBooks([]);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    }
  };

  const handleAddBook = () => {
    setFeaturedBooks([
      ...featuredBooks,
      {
        title: '',
        author: '',
        timestamp: '',
        note: ''
      }
    ]);
  };

  const handleBookChange = (index, field, value) => {
    const updatedBooks = [...featuredBooks];
    updatedBooks[index] = {
      ...updatedBooks[index],
      [field]: value
    };
    setFeaturedBooks(updatedBooks);
  };

  const handleRemoveBook = (index) => {
    setFeaturedBooks(featuredBooks.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const selectedGenreData = genres.find(g => g.name === selectedGenre);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-semibold mb-6">Upload Video</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                {videoFile ? (
                  <div className="text-sm text-gray-600">
                    {videoFile.name}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-xs text-gray-500">
                      MP4, WebM or Ogg (max. 800MB)
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037] min-h-[100px]"
                required
              />
            </div>

            {/* Genre and Subgenre */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value);
                    setSelectedSubgenre('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                  required
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre.name} value={genre.name}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subgenre
                </label>
                <select
                  value={selectedSubgenre}
                  onChange={(e) => setSelectedSubgenre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                  disabled={!selectedGenreData}
                  required
                >
                  <option value="">Select a subgenre</option>
                  {selectedGenreData?.subgenres.map((subgenre) => (
                    <option key={subgenre} value={subgenre}>
                      {subgenre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="fantasy, books, review"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
              />
            </div>

            {/* Featured Books */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Featured Books
                </label>
                <button
                  type="button"
                  onClick={handleAddBook}
                  className="flex items-center gap-1 text-sm text-[#5D4037] hover:text-[#4A332C]"
                >
                  <Plus size={16} />
                  Add Book
                </button>
              </div>

              <div className="space-y-4">
                {featuredBooks.map((book, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-sm font-medium text-gray-700">
                        Book {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveBook(index)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={book.title}
                        onChange={(e) => handleBookChange(index, 'title', e.target.value)}
                        placeholder="Book title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                      />
                      <input
                        type="text"
                        value={book.author}
                        onChange={(e) => handleBookChange(index, 'author', e.target.value)}
                        placeholder="Author"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={book.timestamp}
                        onChange={(e) => handleBookChange(index, 'timestamp', e.target.value)}
                        placeholder="Timestamp (e.g., 2:30)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                      />
                      <input
                        type="text"
                        value={book.note}
                        onChange={(e) => handleBookChange(index, 'note', e.target.value)}
                        placeholder="Note about the book"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#5D4037] text-white rounded-lg hover:bg-[#4A332C] transition-colors"
              >
                Upload Video
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;
