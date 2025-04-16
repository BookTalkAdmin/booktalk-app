import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus } from 'lucide-react';
import { useTBR } from '../contexts/TBRContext';

const BookTag = ({ book, timestamp, note }) => {
  const { addToTBR, tbrList } = useTBR();
  const isInTBR = tbrList.some(tbrBook => tbrBook._id === book._id);

  const handleAddToTBR = () => {
    if (!isInTBR) {
      addToTBR({
        _id: book._id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        amazonLink: book.amazonLink
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-[#D4C5BE] text-sm"
    >
      <BookOpen size={14} className="text-[#6B4D3C]" />
      <span className="font-medium text-[#6B4D3C]">{book.title}</span>
      {timestamp && (
        <span className="text-xs text-[#8B7B74]">
          {new Date(timestamp * 1000).toISOString().substr(11, 8)}
        </span>
      )}
      {note && (
        <span className="text-xs text-[#8B7B74] max-w-[150px] truncate">
          {note}
        </span>
      )}
      {!isInTBR && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToTBR}
          className="p-1 hover:bg-[#FAF7F5] rounded-full transition-colors"
          title="Add to TBR"
        >
          <Plus size={14} className="text-[#6B4D3C]" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default BookTag;
