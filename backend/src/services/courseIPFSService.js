import IPFSService from './ipfsService.js';

class CourseIPFSService {
  constructor() {
    this.ipfsService = new IPFSService();
  }

  async createCourseMetadata(courseData) {
    try {
      const courseMetadata = {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        educator: courseData.contributor,
        category: courseData.category || 'General',
        difficulty: courseData.difficulty || 'Beginner',
        duration: courseData.duration || '4 weeks',
        price: courseData.price || 0,
        tags: courseData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0'
      };

      const result = await this.ipfsService.uploadJSON(
        courseMetadata,
        `course-${courseData.id}-metadata.json`
      );

      return {
        success: true,
        courseId: courseData.id,
        ipfsHash: result.ipfsHash,
        gatewayUrl: result.gatewayUrl,
        metadata: courseMetadata
      };
    } catch (error) {
      console.error('Error creating course metadata:', error);
      throw new Error(`Course metadata creation failed: ${error.message}`);
    }
  }

  async uploadCourseContent(courseId, contentFiles) {
    try {
      const contentResults = [];
      
      for (const file of contentFiles) {
        const result = await this.ipfsService.uploadFile(
          file.buffer,
          file.originalname,
          {
            name: `course-${courseId}-content`,
            keyvalues: {
              courseId: courseId,
              type: 'course-content',
              timestamp: new Date().toISOString()
            }
          }
        );
        
        contentResults.push({
          fileName: file.originalname,
          ipfsHash: result.ipfsHash,
          gatewayUrl: result.gatewayUrl,
          size: result.size,
          contentType: file.mimetype
        });
      }

      const contentIndex = {
        courseId: courseId,
        content: contentResults,
        totalSize: contentResults.reduce((sum, item) => sum + item.size, 0),
        uploadedAt: new Date().toISOString()
      };

      const indexResult = await this.ipfsService.uploadJSON(
        contentIndex,
        `course-${courseId}-content-index.json`
      );

      return {
        success: true,
        courseId: courseId,
        contentFiles: contentResults,
        contentIndexHash: indexResult.ipfsHash,
        contentIndexUrl: indexResult.gatewayUrl
      };
    } catch (error) {
      console.error('Error uploading course content:', error);
      throw new Error(`Content upload failed: ${error.message}`);
    }
  }

  async getCourseMetadata(ipfsHash) {
    try {
      const result = await this.ipfsService.getContent(ipfsHash);
      return {
        success: true,
        metadata: result.data
      };
    } catch (error) {
      console.error('Error getting course metadata:', error);
      throw new Error(`Metadata retrieval failed: ${error.message}`);
    }
  }

  async getCourseContent(contentIndexHash) {
    try {
      const result = await this.ipfsService.getContent(contentIndexHash);
      return {
        success: true,
        content: result.data
      };
    } catch (error) {
      console.error('Error getting course content:', error);
      throw new Error(`Content retrieval failed: ${error.message}`);
    }
  }
}

export default CourseIPFSService;
