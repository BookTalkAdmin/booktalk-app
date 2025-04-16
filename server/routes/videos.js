const router = require('express').Router();
const Video = require('../models/Video');
const auth = require('../middleware/auth');

// Get all videos
router.get('/', async (req, res) => {
  try {
    const { genre, subgenre } = req.query;
    const query = {};
    
    if (genre) query.genre = genre;
    if (subgenre) query.subgenre = subgenre;

    const videos = await Video.find(query)
      .populate('creator', 'username profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's videos
router.get('/user/:userId', async (req, res) => {
  try {
    const videos = await Video.find({ creator: req.params.userId })
      .populate('creator', 'username profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create video
router.post('/', auth, async (req, res) => {
  try {
    const newVideo = new Video({
      ...req.body,
      creator: req.user.id,
    });

    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update video
router.put('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete video
router.delete('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await video.remove();
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.comments.unshift({
      user: req.user.id,
      text: req.body.text,
    });

    await video.save();
    res.json(video.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
