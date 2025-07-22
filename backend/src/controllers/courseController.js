import Course from '../models/Course.js';
import CourseIPFSService from '../services/courseIPFSService.js';
import mongoose from 'mongoose';

class CourseController {
  constructor() {
    this.courseIPFSService = new CourseIPFSService();
  }

  /**
   * Check if MongoDB is connected
   */
  checkMongoConnection() {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Create a new course with IPFS integration
   */
  async createCourse(req, res) {
    try {
      const courseData = req.body;
      
      // Validate required fields
      if (!courseData.title || !courseData.description || !courseData.contributor) {
        return res.status(400).json({
          error: 'Missing required fields: title, description, contributor'
        });
      }

      // Generate unique course ID
      courseData.id = `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Upload course metadata to IPFS
      const ipfsResult = await this.courseIPFSService.createCourseMetadata(courseData);

      // Create MongoDB document if connected
      if (this.checkMongoConnection()) {
        const course = new Course({
          title: courseData.title,
          description: courseData.description,
          contributor: courseData.contributor,
          category: courseData.category || 'General',
          difficulty: courseData.difficulty || 'Beginner',
          duration: courseData.duration || '4 weeks',
          price: courseData.price || 0,
          tags: courseData.tags || [],
          sections: courseData.sections || [],
          ipfsMetadataHash: ipfsResult.ipfsHash,
          ipfsGatewayUrl: ipfsResult.gatewayUrl,
          status: 'draft'
        });

        await course.save();
      }

      res.status(201).json({
        success: true,
        course: {
          id: courseData.id,
          title: courseData.title,
          ipfsHash: ipfsResult.ipfsHash,
          gatewayUrl: ipfsResult.gatewayUrl,
          status: 'draft'
        },
        ipfs: ipfsResult,
        mongodb: this.checkMongoConnection() ? 'saved' : 'not_available'
      });

    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Upload course content to IPFS
   */
  async uploadCourseContent(req, res) {
    try {
      const { courseId } = req.params;
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files provided' });
      }

      // Find course in MongoDB if connected
      let course = null;
      if (this.checkMongoConnection()) {
        course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ error: 'Course not found' });
        }
      }

      // Upload content to IPFS
      const ipfsResult = await this.courseIPFSService.uploadCourseContent(courseId, files);

      // Update course with content index hash if MongoDB is connected
      if (course && this.checkMongoConnection()) {
        course.ipfsContentIndexHash = ipfsResult.contentIndexHash;
        await course.save();
      }

      res.json({
        success: true,
        courseId: courseId,
        contentFiles: ipfsResult.contentFiles,
        contentIndexHash: ipfsResult.contentIndexHash,
        mongodb: this.checkMongoConnection() ? 'updated' : 'not_available'
      });

    } catch (error) {
      console.error('Error uploading course content:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get course with IPFS content
   */
  async getCourse(req, res) {
    try {
      const { courseId } = req.params;

      let course = null;
      if (this.checkMongoConnection()) {
        course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ error: 'Course not found' });
        }
      }

      // Get metadata from IPFS
      let ipfsMetadata = null;
      let ipfsContent = null;

      try {
        if (course && course.ipfsMetadataHash) {
          const metadataResult = await this.courseIPFSService.getCourseMetadata(course.ipfsMetadataHash);
          ipfsMetadata = metadataResult.metadata;
        }

        if (course && course.ipfsContentIndexHash) {
          const contentResult = await this.courseIPFSService.getCourseContent(course.ipfsContentIndexHash);
          ipfsContent = contentResult.content;
        }
      } catch (ipfsError) {
        console.warn('IPFS retrieval failed:', ipfsError.message);
      }

      res.json({
        success: true,
        course: course ? {
          ...course.toObject(),
          ipfsMetadata,
          ipfsContent
        } : null,
        mongodb: this.checkMongoConnection() ? 'connected' : 'not_available'
      });

    } catch (error) {
      console.error('Error getting course:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Search courses
   */
  async searchCourses(req, res) {
    try {
      if (!this.checkMongoConnection()) {
        return res.status(503).json({ 
          error: 'MongoDB not available for search',
          message: 'Search functionality requires MongoDB connection'
        });
      }

      const { q, category, difficulty, contributor } = req.query;
      
      let query = { status: 'published' };

      if (q) {
        query.$text = { $search: q };
      }

      if (category) {
        query.category = category;
      }

      if (difficulty) {
        query.difficulty = difficulty;
      }

      if (contributor) {
        query.contributor = contributor;
      }

      const courses = await Course.find(query)
        .sort({ createdAt: -1 })
        .limit(20);

      res.json({
        success: true,
        courses: courses.map(course => ({
          id: course._id,
          title: course.title,
          description: course.description,
          contributor: course.contributor,
          category: course.category,
          difficulty: course.difficulty,
          price: course.price,
          enrollmentCount: course.enrollmentCount,
          averageRating: course.averageRating,
          ipfsGatewayUrl: course.ipfsGatewayUrl
        }))
      });

    } catch (error) {
      console.error('Error searching courses:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all courses
   */
  async getAllCourses(req, res) {
    try {
      if (!this.checkMongoConnection()) {
        return res.status(503).json({ 
          error: 'MongoDB not available',
          message: 'Course listing requires MongoDB connection'
        });
      }

      const courses = await Course.find({ status: 'published' })
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        courses: courses.map(course => ({
          id: course._id,
          title: course.title,
          description: course.description,
          contributor: course.contributor,
          category: course.category,
          difficulty: course.difficulty,
          price: course.price,
          enrollmentCount: course.enrollmentCount,
          averageRating: course.averageRating,
          ipfsGatewayUrl: course.ipfsGatewayUrl
        }))
      });

    } catch (error) {
      console.error('Error getting courses:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default CourseController;
