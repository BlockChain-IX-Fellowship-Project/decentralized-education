import Course from '../models/Course.js';

const createCourse = async ({ title, description, contributor, sections }) => {
  const course = new Course({ title, description, contributor, sections });
  return await course.save();
};

const getAllCourses = async () => {
  return await Course.find();
};

export default {
  createCourse,
  getAllCourses,
};
