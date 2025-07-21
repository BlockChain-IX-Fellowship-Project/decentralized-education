import Course from '../models/Course.js';

const createCourse = async ({ title, description, createdBy, sections }) => {
  const course = new Course({ title, description, createdBy, sections });
  await course.save();
  return course;
};

const getAllCourses = async () => {
  return await Course.find();
};

export default {
  createCourse,
  getAllCourses,
};
