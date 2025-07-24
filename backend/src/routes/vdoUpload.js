// src/routes/videoRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadVideo } from '../controllers/vdoController.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads'); // Points to backend/uploads/

// const upload = multer({ 
//   dest: uploadDir,
//   limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
// });
const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2 GB (adjust based on your use case)
  },
});

router.post('/', upload.single('video'), uploadVideo);
export default router;