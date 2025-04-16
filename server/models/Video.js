const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  featuredBooks: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
    timestamp: Number, // Timestamp in the video where the book is mentioned
    note: String, // Optional note about the book mention
  }],
  tags: [String],
  genre: String,
  subgenre: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);
