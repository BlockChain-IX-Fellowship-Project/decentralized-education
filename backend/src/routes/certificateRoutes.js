// backend/src/routes/certificateRoutes.js
import express from 'express';
import { enrollCertificate } from '../controllers/certificateController.js';

const router = express.Router();

router.post('/enroll', enrollCertificate);

export default router;
