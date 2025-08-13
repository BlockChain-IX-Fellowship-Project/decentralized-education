import courseService from '../services/courseService.js';
import Section from '../models/Section.js';
import Video from '../models/Video.js';
import { generateQuizWithGemini } from '../services/geminiGenService.js';
import * as whisperService from '../services/whisperService.js';

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
      const { title, description, createdBy, instructor, level, sections } = req.body;
      const sectionIds = [];
      for (const section of sections) {
        let videoId = null;
        let transcript = '';
        let quizzes = [];
        let localPath = '';
        if (section.ipfsHash) {
          try {
            const videoDoc = new Video({
              fileName: section.ipfsHash,
              originalName: section.title,
              ipfsHash: section.ipfsHash,
              uploader: createdBy || 'unknown',
            });
            await videoDoc.save();
            videoId = videoDoc._id;
          } catch (err) {
            console.error('Error saving video document:', err);
          }

          // Download mp4 from IPFS to uploads folder
          try {
            localPath = await whisperService.downloadMp4FromIPFS(section.ipfsHash);
          } catch (err) {
            console.error('Error downloading mp4 from IPFS:', err);
            localPath = '';
          }

          // 1. Extract transcript from mp4 using Whisper
          if (localPath) {
            try {
              transcript = await whisperService.extractTranscript(localPath, section.ipfsHash);
            } catch (err) {
              console.error('Whisper transcript extraction error:', err);
              transcript = '';
            }
          }
        }
        // 2. Generate quizzes using Gemini API
        if (transcript) {
          try {
            quizzes = await generateQuizWithGemini(transcript);
          } catch (err) {
            console.error('Gemini quiz generation error:', err);
            quizzes = [];
          }
        }
        // 3. Create Section document
        try {
          const sectionDoc = new Section({
            title: section.title,
            videos: videoId ? [videoId] : [],
            quizzes,
          });
          await sectionDoc.save();
          sectionIds.push(sectionDoc._id);
        } catch (err) {
          console.error('Error saving Section document:', err);
        }
      }
      // 4. Create Course document
      try {
        const course = await courseService.createCourse({
          title,
          description,
          createdBy,
          instructor,
          level,
          sections: sectionIds,
        });
        await course.populate({
          path: 'sections',
          populate: { path: 'videos' }
        });
        res.status(201).json(course);
      } catch (err) {
        console.error('Error saving Course document:', err);
        res.status(500).json({ error: err.message });
      }
    } catch (err) {
      console.error('createFullCourse: top-level error:', err);
      res.status(500).json({ error: err.message });
    }
  },
};

export default courseController;
