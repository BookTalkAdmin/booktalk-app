const router = require('express').Router();
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { username, email, password } = req.body;

    // Create user
    const user = await userService.createUser({ username, email, password });

    // Create token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Registration successful for:', email);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    const { email, password } = req.body;

    // Validate user
    const user = await userService.validateUser(email, password);

    // Create token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful for:', email);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Get current user request received');
    // User is already attached to req by auth middleware
    const user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
    };
    console.log('Returning user data for:', user.email);
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
