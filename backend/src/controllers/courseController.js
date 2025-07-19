// import Course from '../models/Course.js';

// const courseController = {
//   createCourse: async (req, res) => {
//     try {
//       const { title, description, contributor, sections } = req.body;
//       const course = new Course({ title, description, contributor, sections });
//       await course.save();
//       res.status(201).json(course);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },
//   getAllCourses: async (req, res) => {
//     try {
//       const courses = await Course.find();
//       res.json(courses);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// };

// export default courseController; 

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
};

export default courseController;
