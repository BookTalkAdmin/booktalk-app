import React from 'react';
import { ShoppingBag, ExternalLink } from 'lucide-react';

const BookCard = ({ book, showPrice = false, onAddToCart, amazonUrl }) => {
  return (
    <div className="book-card">
      <img
        src={book.cover}
        alt={book.title}
        className="book-card-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/800x640/EEE/333?text=Cover+Not+Found`;
        }}
      />
      <div className="book-card-content">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        
        <div className="flex items-center justify-between">
          <span
            className="genre-tag"
            style={{
              backgroundColor: book.genre === 'Fantasy' ? '#2C5F2D' :
                            book.genre === 'Horror' ? '#A30000' :
                            book.genre === 'Thriller' ? '#545454' :
                            book.genre === 'Romance' ? '#B76D68' :
                            book.genre === 'Mystery' ? '#6A5ACD' :
                            book.genre === 'Science Fiction' ? '#8B8000' : '#777'
            }}
          >
            {book.genre}
          </span>
          
          {showPrice && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">${book.price}</span>
              <button
                onClick={onAddToCart}
                className="p-2 text-[#5D4037] hover:bg-[#5D4037]/5 rounded-full transition-colors"
                aria-label="Add to cart"
              >
                <ShoppingBag size={20} />
              </button>
            </div>
          )}

          {amazonUrl && (
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#5D4037] hover:bg-[#5D4037]/5 rounded-full transition-colors"
              aria-label="View on Amazon"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
