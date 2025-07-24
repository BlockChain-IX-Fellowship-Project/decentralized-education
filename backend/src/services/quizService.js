import Course from '../models/Course.js';
import User from '../models/User.js';

const checkQuizAndReward = async (courseId, userAnswers, walletAddress) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');

  // Check answers correctness
  let correct = true;
  for (let i = 0; i < course.sections.length; i++) {
    const quizzes = course.sections[i].quizzes;
    for (let j = 0; j < quizzes.length; j++) {
      if (!userAnswers[i] || userAnswers[i][j] !== quizzes[j].correctAnswer) {
        correct = false;
        break;
      }
    }
    if (!correct) break;
  }

  if (correct) {
    await User.updateOne(
      { walletAddress },
      { $inc: { tokensEarned: 10 }, $addToSet: { completedCourses: courseId } },
      { upsert: true }
    );
  }

  return correct;
};

export default {
  checkQuizAndReward,
};
