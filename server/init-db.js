const mongoose = require('mongoose');
const User = require('./models/User');
const Video = require('./models/Video');
const Book = require('./models/Book');

require('dotenv').config();

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booktalk';
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Optional: Adjust as needed
      socketTimeoutMS: 45000,      // Optional: Adjust as needed
      family: 4                    // Optional: Forces IPv4 if needed
    });
    
    console.log('Connected to MongoDB successfully');

    // Clear existing data from specified collections
    console.log('Clearing data from User, Book, and Video collections...');
    await Promise.all([
      User.deleteMany({}),
      Book.deleteMany({}),
      Video.deleteMany({})
    ]);
    console.log('Successfully cleared data from User, Book, and Video collections.');

    // Database is now empty and ready for new user data.

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    console.log('Database initialization complete: All specified collections are now empty.');
    process.exit(0);
  } catch (error) {
    console.error('Error during database initialization:', error);
    // Ensure disconnection even if an error occurs
    if (mongoose.connection.readyState === 1) { // 1 means connected
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB due to an error.');
    }
    process.exit(1);
  }
}

initializeDatabase();
