const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

module.exports = async (req, res, next) => {
  // Get token from header
  let token = req.header('x-auth-token');

  // Try Authorization header if x-auth-token is not present
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // Check if no token
  if (!token) {
    console.log('No token found in request headers');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully for user:', decoded.id);

    // Get user from database
    const user = await userService.findById(decoded.id);
    if (!user) {
      console.error('User not found for token');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
