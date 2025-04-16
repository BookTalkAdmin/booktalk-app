const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

// Ensure the data directory exists
const ensureDataDir = async () => {
  const dir = path.dirname(USERS_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Initialize users file if it doesn't exist
const initUsersFile = async () => {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, '[]');
  }
};

// Read all users
const getUsers = async () => {
  await ensureDataDir();
  await initUsersFile();
  const data = await fs.readFile(USERS_FILE, 'utf8');
  return JSON.parse(data);
};

// Write users to file
const saveUsers = async (users) => {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

// Find user by email
const findByEmail = async (email) => {
  const users = await getUsers();
  return users.find(user => user.email === email);
};

// Find user by username
const findByUsername = async (username) => {
  const users = await getUsers();
  return users.find(user => user.username === username);
};

// Find user by ID
const findById = async (id) => {
  const users = await getUsers();
  return users.find(user => user.id === id);
};

// Create a new user
const createUser = async ({ username, email, password }) => {
  // Validate input
  if (!username || !email || !password) {
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

  // Create user object
  const user = {
    id: Date.now().toString(),
    username,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  // Save user
  const users = await getUsers();
  users.push(user);
  await saveUsers(users);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Validate user credentials
const validateUser = async (email, password) => {
  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Find user
  const user = await findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  createUser,
  validateUser
};
