import express from 'express';
import quizController from '../controllers/quizController.js';

const router = express.Router();

router.post('/submit', quizController.submitQuiz);
router.post('/progress/section', quizController.updateSectionProgress);
router.get('/progress/user', quizController.getUserProgress);

export default router;