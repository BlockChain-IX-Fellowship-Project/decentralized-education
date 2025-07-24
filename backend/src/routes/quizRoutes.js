import express from 'express';
import quizController from '../controllers/quizController.js';

const router = express.Router();

router.post('/submit', quizController.submitQuiz);

export default router;