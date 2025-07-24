import courseService from '../services/courseService.js';
import Section from '../models/Section.js';
import Video from '../models/Video.js';

const courseController = {
  createCourse: async (req, res) => {
    try {
      // Accepts: { title, description, createdBy, sections: [sectionId, ...] }
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

  getCourseById: async (req, res) => {
    try {
      const course = await courseService.getCourseById(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createFullCourse: async (req, res) => {
    try {
      const { title, description, createdBy, sections } = req.body;
      // sections: [{ title, docUrl, ipfsHash }]
      const sectionIds = [];
      for (const section of sections) {
        // 1. Create Video document (if ipfsHash provided)
        let videoId = null;
        if (section.ipfsHash) {
          const videoDoc = new Video({
            fileName: section.ipfsHash, // or section.title
            originalName: section.title,
            ipfsHash: section.ipfsHash,
            uploader: createdBy || 'unknown',
          });
          await videoDoc.save();
          videoId = videoDoc._id;
        }
        // 2. Create Section document
        const sectionDoc = new Section({
          title: section.title,
          videos: videoId ? [videoId] : [],
        });
        await sectionDoc.save();
        sectionIds.push(sectionDoc._id);
      }
      // 3. Create Course document
      const course = await courseService.createCourse({
        title,
        description,
        createdBy,
        sections: sectionIds,
      });
      // 4. Populate sections and videos for response
      await course.populate({
        path: 'sections',
        populate: { path: 'videos' }
      });
      res.status(201).json(course);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default courseController;
