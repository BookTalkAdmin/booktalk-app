const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  subgenre: {
    type: String,
  },
  amazonUrl: {
    type: String,
  },
  asin: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
