// backend/src/controllers/certificateController.js
import Course from '../models/Course.js';
import { generateCertificate } from '../services/certificateService.js';
import path from 'path';

export const enrollCertificate = async (req, res) => {
  try {
    const { learnerName, walletAddress, courseId } = req.body;
    if (!learnerName || !walletAddress || !courseId) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }
    const issueDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const outputPath = path.join(process.cwd(), 'uploads', `${learnerName}_${courseId}_certificate.pdf`);
    // PDFKit is async, so wait for file to finish writing
    await new Promise((resolve, reject) => {
      try {
        const doc = generateCertificate({
          learnerName,
          courseName: course.title,
          walletAddress,
          issueDate,
          outputPath,
        });
        // Listen for finish event
        doc.on('end', resolve);
        doc.on('error', reject);
      } catch (err) {
        reject(err);
      }
    });
    res.json({ success: true, message: 'Certificate generated.', downloadUrl: `/uploads/${learnerName}_${courseId}_certificate.pdf` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
