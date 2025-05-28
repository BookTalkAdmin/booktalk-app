const bcrypt = require('bcrypt');
const User = require('../models/User');

// Find user by email
const findByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Database error');
  }
};

// Find user by username
const findByUsername = async (username) => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw new Error('Database error');
  }
};

// Find user by ID
const findById = async (id) => {
  try {
    return await User.findById(id).select('-password');
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw new Error('Database error');
  }
};

// Create a new user
const createUser = async ({ username, email, password, firstName, lastName }) => {
  try {
    // Validate input
    if (!username || !email || !password || !firstName || !lastName) {
      throw new Error('All fields are required');
    }

    // Check if user already exists
    const existingEmail = await findByEmail(email);
    if (existingEmail) {
      throw new Error('Email already registered');
    }

    const existingUsername = await findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    // Save user to database
    await user.save();

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 11000) {
      throw new Error('Email or username already exists');
    }
    throw error;
  }
};

// Validate user credentials
const validateUser = async (email, password) => {
  try {
    console.log('Validating user:', { email });
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  } catch (error) {
    console.error('Error validating user:', error);
    throw error;
  }
};

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  createUser,
  validateUser
};
