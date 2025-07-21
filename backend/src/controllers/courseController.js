import courseService from '../services/courseService.js';

const courseController = {
  createCourse: async (req, res) => {
    try {
      const course = await courseService.createCourse(req.body);
      res.status(201).json(course);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAllCourses: async (req, res) => {
    try {
      const courses = await courseService.getAllCourses();
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createFullCourse: async (req, res) => {
    try {
      const course = await courseService.createFullCourse(req.body);
      res.status(201).json(course);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default courseController;
