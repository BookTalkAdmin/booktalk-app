const mongoose = require('mongoose');
const User = require('./models/User');
const Video = require('./models/Video');
const Book = require('./models/Book');

const sampleData = {
  users: [
    {
      username: 'bookworm',
      email: 'bookworm@example.com',
      password: '$2b$10$YourHashedPasswordHere', // Will be hashed in production
      profilePicture: '',
    }
  ],
  books: [
    {
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      description: 'A psychological thriller about a woman who shoots her husband and then never speaks again.',
      cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73',
      price: 24.99,
      genre: 'Thriller',
      subgenre: 'Psychological Thriller',
    },
    {
      title: 'The Invisible Life of Addie LaRue',
      author: 'V.E. Schwab',
      description: 'A woman makes a Faustian bargain to live forever but is cursed to be forgotten by everyone she meets.',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
      price: 26.99,
      genre: 'Fantasy',
      subgenre: 'Dark Fantasy',
    }
  ],
  videos: [
    {
      title: 'Why You Should Read The Night Circus',
      description: 'A deep dive into the magical world of The Night Circus and why it\'s a must-read fantasy novel.',
      genre: 'Fantasy',
      subgenre: 'Magical Realism',
      videoUrl: 'https://example.com/video1.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64',
      tags: ['fantasy', 'book review', 'magic'],
      views: 1200,
    }
  ]
};

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/booktalk', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Video.deleteMany({}),
      Book.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Insert sample users
    const users = await User.create(sampleData.users);
    console.log('Created sample users');

    // Insert sample books
    const books = await Book.create(sampleData.books);
    console.log('Created sample books');

    // Insert sample videos with creator reference
    const videosWithCreator = sampleData.videos.map(video => ({
      ...video,
      creator: users[0]._id,
    }));
    const videos = await Video.create(videosWithCreator);
    console.log('Created sample videos');

    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
