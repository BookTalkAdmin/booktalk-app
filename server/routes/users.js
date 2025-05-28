const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Update user profile
router.patch('/:id', auth, async (req, res) => {
  try {
    const { name, username, bio, profilePicture } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is updating their own profile
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    // Update user fields
    if (name) user.name = name;
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    // Save updated user
    await user.save();

    // Return updated user without password
    const userObject = user.toObject();
    delete userObject.password;
    
    res.json(userObject);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
