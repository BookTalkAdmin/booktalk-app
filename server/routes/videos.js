const router = require('express').Router();
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/videos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed'));
    }
    cb(null, true);
  }
});

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
router.post('/', auth, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const videoPath = req.file.path;
    const thumbnailDir = 'uploads/thumbnails';
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    const thumbnailPath = path.join(thumbnailDir, `${path.parse(req.file.filename).name}.jpg`);

    // Generate thumbnail using ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['00:00:01'],
          filename: path.basename(thumbnailPath),
          folder: thumbnailDir,
          size: '320x240'
        })
        .on('end', resolve)
        .on('error', reject);
    });

    const newVideo = new Video({
      title: req.body.title,
      description: req.body.description,
      creator: req.user.id,
      videoUrl: `/${videoPath.replace(/\\/g, '/')}`,
      thumbnail: `/${thumbnailPath.replace(/\\/g, '/')}`,
      tags: JSON.parse(req.body.tags || '[]'),
      featuredBooks: JSON.parse(req.body.books || '[]').map(book => ({
        book: book.value,
        note: book.label
      }))
    });

    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    console.error('Error uploading video:', error);
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
