import express from 'express';
import multer from 'multer';
import IPFSService from '../services/ipfsService.js';
import CourseIPFSService from '../services/courseIPFSService.js';
import UserIPFSService from '../services/userIPFSService.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10 // Max 10 files per request
  }
});

// Initialize services
const ipfsService = new IPFSService();
const courseIPFSService = new CourseIPFSService();
const userIPFSService = new UserIPFSService();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = await ipfsService.healthCheck();
    res.json({
      service: 'IPFS Service',
      status: health.status,
      message: health.message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Basic IPFS operations
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};
    const result = await ipfsService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      metadata
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const results = [];
    for (const file of req.files) {
      const result = await ipfsService.uploadFile(
        file.buffer,
        file.originalname
      );
      results.push({
        fileName: file.originalname,
        ...result
      });
    }

    res.json({ success: true, files: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/upload-json', async (req, res) => {
  try {
    const { data, name } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    const result = await ipfsService.uploadJSON(data, name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/content/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!ipfsService.validateIPFSHash(hash)) {
      return res.status(400).json({ error: 'Invalid IPFS hash' });
    }

    const result = await ipfsService.getContent(hash);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/pin/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!ipfsService.validateIPFSHash(hash)) {
      return res.status(400).json({ error: 'Invalid IPFS hash' });
    }

    const result = await ipfsService.pinContent(hash);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Course-specific IPFS operations
router.post('/courses/create', async (req, res) => {
  try {
    const courseData = req.body;
    
    if (!courseData.id || !courseData.title || !courseData.educator) {
      return res.status(400).json({ 
        error: 'Missing required fields: id, title, educator' 
      });
    }

    const result = await courseIPFSService.createCourseMetadata(courseData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/courses/:courseId/content', upload.array('files'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const result = await courseIPFSService.uploadCourseContent(courseId, files);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/courses/metadata/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const result = await courseIPFSService.getCourseMetadata(hash);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/courses/content/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const result = await courseIPFSService.getCourseContent(hash);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/courses/:courseId/metadata', async (req, res) => {
  try {
    const { courseId } = req.params;
    const updates = req.body;

    const result = await courseIPFSService.updateCourseMetadata(courseId, updates);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User-specific IPFS operations
router.post('/users/profile', async (req, res) => {
  try {
    const userData = req.body;
    
    if (!userData.id || !userData.address) {
      return res.status(400).json({ 
        error: 'Missing required fields: id, address' 
      });
    }

    const result = await userIPFSService.createUserProfile(userData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentIpfsHash, updates } = req.body;

    if (!currentIpfsHash) {
      return res.status(400).json({ error: 'Current IPFS hash required' });
    }

    const result = await userIPFSService.updateUserProfile(userId, currentIpfsHash, updates);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users/profile/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const profile = await userIPFSService.getUserProfile(hash);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users/achievement', async (req, res) => {
  try {
    const { userId, achievement } = req.body;
    
    if (!userId || !achievement) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, achievement' 
      });
    }

    const result = await userIPFSService.addAchievement(userId, achievement);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users/review', async (req, res) => {
  try {
    const reviewData = req.body;
    
    if (!reviewData.id || !reviewData.courseId || !reviewData.userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: id, courseId, userId' 
      });
    }

    const result = await userIPFSService.addReview(reviewData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users/achievements', async (req, res) => {
  try {
    const { achievementHashes } = req.body;
    
    if (!achievementHashes || !Array.isArray(achievementHashes)) {
      return res.status(400).json({ 
        error: 'achievementHashes array is required' 
      });
    }

    const result = await userIPFSService.getUserAchievements(achievementHashes);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 