const router = require('express').Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// Get all books
router.get('/', async (req, res) => {
  try {
    const { genre, subgenre } = req.query;
    const query = {};
    
    if (genre) query.genre = genre;
    if (subgenre) query.subgenre = subgenre;

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create book (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const newReview = {
      user: req.user.id,
      rating: req.body.rating,
      text: req.body.text,
    };

    book.reviews.unshift(newReview);

    // Update book rating
    const totalRating = book.reviews.reduce((sum, review) => sum + review.rating, 0);
    book.rating = totalRating / book.reviews.length;

    await book.save();
    res.json(book.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
