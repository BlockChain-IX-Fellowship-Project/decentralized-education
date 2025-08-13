import express from 'express';
import courseController from '../controllers/courseController.js';

const router = express.Router();

router.post('/', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.post('/full', courseController.createFullCourse);
router.get('/:id', courseController.getCourseById);
router.post('/process', courseController.startProcessing);
router.get('/process/:processId/status', courseController.getProcessingStatus);

export default router;