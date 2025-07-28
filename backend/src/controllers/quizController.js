import quizService from '../services/quizService.js';
import UserProgress from '../models/UserProgress.js';
import Course from '../models/Course.js';

const quizController = {
  submitQuiz: async (req, res) => {
    try {
      const { courseId, userAnswers, walletAddress } = req.body;
      const passed = await quizService.checkQuizAndReward(courseId, userAnswers, walletAddress);
      if (passed) {
        res.json({ success: true, message: 'Quiz passed! Tokens rewarded.' });
      } else {
        res.json({ success: false, message: 'Quiz failed. Try again.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  updateSectionProgress: async (req, res) => {
    try {
      const { userId, courseId, sectionId, score, total } = req.body;
      // Find or create user progress for this course
      let progress = await UserProgress.findOne({ userId, courseId });
      if (!progress) {
        progress = new UserProgress({ userId, courseId, sectionStatuses: [] });
      }
      // Find section status by string comparison
      let sectionStatus = progress.sectionStatuses.find(s => s.sectionId.toString() === sectionId.toString());
      if (!sectionStatus) {
        sectionStatus = { sectionId, status: 'not_started', score: 0, total: 0 };
        progress.sectionStatuses.push(sectionStatus);
      }
      // Update section status if passed
      const course = await Course.findById(courseId);
      let tokensPerSection = 50;
      if (course && course.level === 'Intermediate') tokensPerSection = 70;
      if (course && course.level === 'Advanced') tokensPerSection = 100;
      let tokensEarned = 0;
      if (score / total >= 0.8) {
        sectionStatus.status = 'completed';
        tokensEarned = tokensPerSection;
      } else {
        sectionStatus.status = 'in_progress';
        tokensEarned = 0;
      }
      sectionStatus.score = score;
      sectionStatus.total = total;
      sectionStatus.lastAttemptAt = new Date();
      // Check if all sections are completed
      const allCompleted = progress.sectionStatuses.every(s => s.status === 'completed');
      progress.courseStatus = allCompleted ? 'completed' : 'in_progress';
      progress.updatedAt = new Date();
      // Calculate total tokens for this course for this user
      let totalTokens = 0;
      for (const s of progress.sectionStatuses) {
        if (s.status === 'completed') {
          if (course && course.level === 'Intermediate') totalTokens += 70;
          else if (course && course.level === 'Advanced') totalTokens += 100;
          else totalTokens += 50;
        }
      }
      await progress.save();
      res.json({ ...progress.toObject(), tokensEarned, totalTokens });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  getUserProgress: async (req, res) => {
    try {
      const { userId, courseId } = req.query;
      const progress = await UserProgress.findOne({ userId, courseId });
      // Calculate totalScore (was totalTokens)
      let totalScore = 0;
      let courseLevel = 'Beginner';
      if (courseId) {
        const course = await Course.findById(courseId);
        if (course) courseLevel = course.level;
      }
      if (progress && progress.sectionStatuses) {
        for (const s of progress.sectionStatuses) {
          if (s.status === 'completed') {
            if (courseLevel === 'Intermediate') totalScore += 70;
            else if (courseLevel === 'Advanced') totalScore += 100;
            else totalScore += 50;
          }
        }
      }
      res.json(progress ? { ...progress.toObject(), totalScore } : null);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default quizController;

