import Course from '../models/Course.js';

const createCourse = async (courseData) => {
  // Accept all fields from courseData, including instructor and level
  const course = new Course(courseData);
  await course.save();
  return course;
};

const getAllCourses = async () => {
  return await Course.find();
};

const getCourseById = async (id) => {
  return await Course.findById(id)
    .populate({
      path: 'sections',
      populate: { path: 'videos' }
    });
};

export default {
  createCourse,
  getAllCourses,
  getCourseById,
};
