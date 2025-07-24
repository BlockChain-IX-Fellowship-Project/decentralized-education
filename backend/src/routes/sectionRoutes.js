import express from 'express';
import { createSection, getAllSections } from '../controllers/sectionController.js';

const router = express.Router();

// POST /api/sections - create a new section
router.post('/', createSection);

// GET /api/sections - get all sections
router.get('/', getAllSections);

export default router;
