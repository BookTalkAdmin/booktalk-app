const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: '',
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarkedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  toBeRead: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
