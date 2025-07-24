// // In quizController.js
// import Course from '../models/Course.js';
// import User from '../models/User.js';

// const quizController = {
//   submitQuiz: async (req, res) => {
//     try {
//       const { courseId, userAnswers, walletAddress } = req.body;

//       const course = await Course.findById(courseId);
//       if (!course) return res.status(404).json({ error: 'Course not found' });

//       // Check answers correctness
//       let correct = true;
//       for (let i = 0; i < course.sections.length; i++) {
//         const quizzes = course.sections[i].quizzes;
//         for (let j = 0; j < quizzes.length; j++) {
//           if (userAnswers[i][j] !== quizzes[j].correctAnswer) {
//             correct = false;
//             break;
//           }
//         }
//         if (!correct) break;
//       }

//       if (correct) {
//         // Update user record: tokens and completedCourses
//         await User.updateOne(
//           { walletAddress },
//           { $inc: { tokensEarned: 10 }, $addToSet: { completedCourses: courseId } },
//           { upsert: true }
//         );
//         return res.json({ success: true, message: 'Quiz passed! Tokens rewarded.' });
//       } else {
//         return res.json({ success: false, message: 'Quiz failed. Try again.' });
//       }
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// };

// export default quizController;

import quizService from '../services/quizService.js';

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
  }
};

export default quizController;

