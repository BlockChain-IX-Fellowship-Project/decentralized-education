import UserProgress from '../models/UserProgress.js';
import Course from '../models/Course.js';

const dashboardController = {
  // GET /api/dashboard/summary?userId=<walletAddress>
  getSummary: async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });

      const courses = await Course.find({}).populate('sections');
      const progresses = await UserProgress.find({ userId });
      const courseIdToProgress = new Map();
      for (const p of progresses) {
        courseIdToProgress.set(p.courseId.toString(), p);
      }

      const ongoingCourses = [];
      const completedCourses = [];
      let totalTokens = 0;

      for (const course of courses) {
        const courseIdStr = course._id.toString();
        const progress = courseIdToProgress.get(courseIdStr);
        const totalSections = Array.isArray(course.sections) ? course.sections.length : 0;
        const completedSections = progress
          ? progress.sectionStatuses.filter((s) => s.status === 'completed').length
          : 0;

        let tokensPerSection = 50;
        if (course.level === 'Intermediate') tokensPerSection = 70;
        if (course.level === 'Advanced') tokensPerSection = 100;

        const tokensEarned = completedSections * tokensPerSection;
        totalTokens += tokensEarned;

        const progressPercent = totalSections > 0
          ? Math.round((completedSections / totalSections) * 100)
          : 0;

        const latestAttempt = progress && progress.sectionStatuses && progress.sectionStatuses.length > 0
          ? progress.sectionStatuses.reduce((latest, s) => {
              const ts = s.lastAttemptAt ? new Date(s.lastAttemptAt).getTime() : 0;
              return ts > latest ? ts : latest;
            }, 0)
          : 0;

        const isCompleted = totalSections > 0 && completedSections === totalSections;

        if (isCompleted) {
          completedCourses.push({
            id: course._id,
            title: course.title,
            description: course.description,
            instructor: course.instructor,
            tokensEarned,
            completedDate: latestAttempt ? new Date(latestAttempt).toISOString().slice(0, 10) : null,
          });
        } else {
          const tokensPotential = (totalSections - completedSections) * tokensPerSection;
          ongoingCourses.push({
            id: course._id,
            title: course.title,
            description: course.description,
            instructor: course.instructor,
            progress: progressPercent,
            totalSections,
            completedSections,
            tokens: tokensPotential,
          });
        }
      }

      res.json({ totalTokens, ongoingCourses, completedCourses });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default dashboardController;


