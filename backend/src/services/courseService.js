import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Video from '../models/Video.js';

const createCourse = async ({ title, description, contributor, sections }) => {
  const course = new Course({ title, description, contributor, sections });
  return await course.save();
};

const getAllCourses = async () => {
  return await Course.find();
};

// Create a full course with nested sections and videos
// VideoInput and SectionInput type annotations removed for JavaScript compatibility.

const createFullCourse = async ({ title, description, createdBy, sections }) => {
  // 1. Create the course
  const course = new Course({ title, description, createdBy, sections: [] });
  await course.save();

  // 2. For each section, create and link to course
  for (const sectionData of sections) {
    const section = new Section({ title: sectionData.title, course: course._id, videos: [] });
    await section.save();

    // 3. For each video, create and link to section and course
    for (const videoData of sectionData.videos) {
      const video = new Video({
        fileName: videoData.fileName,
        originalName: videoData.originalName,
        ipfsHash: videoData.ipfsHash,
        uploader: videoData.uploader,
        section: section._id,
        course: course._id
      });
      await video.save();
      section.videos.push(video._id);
    }
    await section.save();
    course.sections.push(section._id);
  }
  await course.save();
  return course;
};

export default {
  createCourse,
  getAllCourses,
  createFullCourse,
};
