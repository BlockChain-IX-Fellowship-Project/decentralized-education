import Section from '../models/Section.js';

// Service to create a section
const createSection = async ({ title, course, videos }) => {
  const section = new Section({ title, course, videos });
  await section.save();
  return section;
};

// Service to get all sections
const getAllSections = async () => {
  return await Section.find().populate('videos');
};

export default {
  createSection,
  getAllSections,
};
