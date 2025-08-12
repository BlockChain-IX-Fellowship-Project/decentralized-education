// backend/src/routes/certificateRoutes.js
import express from 'express';
import { enrollCertificate, verifyCertificate } from '../controllers/certificateController.js';
import Certificate from '../models/Certificate.js';

const router = express.Router();

router.post('/enroll', enrollCertificate);

// GET /api/certificates/user?walletAddress=...&courseId=...
router.get('/user', async (req, res) => {
  const { walletAddress, courseId } = req.query;
  if (!walletAddress || !courseId) return res.status(400).json({ error: 'Missing walletAddress or courseId' });
  const cert = await Certificate.findOne({ walletAddress, courseId });
  res.json(cert || null);
});

router.get('/verify', verifyCertificate);

export default router;
