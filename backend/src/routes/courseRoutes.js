import express from 'express';
import courseController from '../controllers/courseController.js';

const router = express.Router();

router.post('/', courseController.createCourse);
router.get('/', courseController.getAllCourses);
// router.post('/full', courseController.createFullCourse);

export default router;