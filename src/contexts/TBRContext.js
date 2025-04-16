import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TBRContext = createContext();

const tbrReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_TBR':
      if (state.some(book => book._id === action.book._id)) {
        return state;
      }
      const newBook = {
        _id: action.book.value || action.book._id,
        title: action.book.title || action.book.label?.split(' by ')[0],
        author: action.book.author || action.book.label?.split(' by ')[1],
        coverImage: action.book.coverImage,
        amazonLink: action.book.amazonLink
      };
      const newState = [...state, newBook];
      localStorage.setItem('tbr-list', JSON.stringify(newState));
      return newState;

    case 'REMOVE_FROM_TBR':
      const updatedState = state.filter(book => book._id !== action.bookId);
      localStorage.setItem('tbr-list', JSON.stringify(updatedState));
      return updatedState;

    case 'LOAD_TBR':
      return action.books;

    default:
      return state;
  }
};

export const TBRProvider = ({ children }) => {
  const [tbrList, dispatch] = useReducer(tbrReducer, []);

  useEffect(() => {
    const savedTBR = localStorage.getItem('tbr-list');
    if (savedTBR) {
      dispatch({ type: 'LOAD_TBR', books: JSON.parse(savedTBR) });
    }
  }, []);

  const addToTBR = (book) => {
    dispatch({ type: 'ADD_TO_TBR', book });
  };

  const removeFromTBR = (bookId) => {
    dispatch({ type: 'REMOVE_FROM_TBR', bookId });
  };

  return (
    <TBRContext.Provider value={{ 
      tbrList, 
      addToTBR, 
      removeFromTBR
    }}>
      {children}
    </TBRContext.Provider>
  );
};

export const useTBR = () => {
  const context = useContext(TBRContext);
  if (!context) {
    throw new Error('useTBR must be used within a TBRProvider');
  }
  return context;
};
