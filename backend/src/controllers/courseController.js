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
          const videoDoc = new Video({
            fileName: section.ipfsHash,
            originalName: section.title,
            ipfsHash: section.ipfsHash,
            uploader: createdBy || 'unknown',
          });
          await videoDoc.save();
          videoId = videoDoc._id;

          // Download mp4 from IPFS to uploads folder
          try {
            console.log('Downloading mp4 from IPFS:', section.ipfsHash);
            localPath = await whisperService.downloadMp4FromIPFS(section.ipfsHash);
            console.log('Downloaded mp4 to:', localPath);
          } catch (err) {
            console.error('Error downloading mp4 from IPFS:', err);
            localPath = '';
          }

          // 1. Extract transcript from mp4 using Whisper
          if (localPath) {
            try {
              console.log('Whisper transcript extraction: Trying to extract from', localPath);
              transcript = await whisperService.extractTranscript(localPath, section.ipfsHash);
              // console.log('Whisper transcript output:', transcript);
            } catch (err) {
              console.error('Whisper transcript extraction error:', err);
              transcript = '';
            }
          }
        }
        // 2. Generate quizzes using Gemini API
        if (transcript) {
          try {
            console.log('Gemini quiz generation: Using transcript:', transcript.slice(0, 200));
            quizzes = await generateQuizWithGemini(transcript);
            // console.log('Gemini quiz output:', quizzes);
          } catch (err) {
            console.error('Gemini quiz generation error:', err);
            quizzes = [];
          }
        }
        // 3. Create Section document
        const sectionDoc = new Section({
          title: section.title,
          videos: videoId ? [videoId] : [],
          quizzes,
        });
        await sectionDoc.save();
        sectionIds.push(sectionDoc._id);
      }
      // 4. Create Course document
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
      res.status(500).json({ error: err.message });
    }
  },
};

export default courseController;
