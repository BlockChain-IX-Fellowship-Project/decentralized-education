import Section from '../models/Section.js';

// Create a new section with video IDs
export const createSection = async (req, res) => {
  try {
    const { title, course, videos } = req.body;
    if (!title || !Array.isArray(videos)) {
      return res.status(400).json({ error: 'Title and videos array are required.' });
    }
    const section = new Section({ title, course, videos });
    await section.save();
    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all sections
export const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().populate('videos');
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
