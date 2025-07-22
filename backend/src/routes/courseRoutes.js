import express from 'express';
import multer from 'multer';
import CourseController from '../controllers/courseController.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10 // Max 10 files per request
  }
});

// Initialize controller
const courseController = new CourseController();

// Course CRUD operations
router.post('/', courseController.createCourse.bind(courseController));
router.get('/', courseController.getAllCourses.bind(courseController));
router.get('/search', courseController.searchCourses.bind(courseController));
router.get('/:courseId', courseController.getCourse.bind(courseController));

// Course content upload
router.post('/:courseId/content', upload.array('files'), courseController.uploadCourseContent.bind(courseController));

export default router;