// backend/src/controllers/certificateController.js
import Course from '../models/Course.js';
import certificateService from '../services/certificateService.js';

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
    // Use the service to handle all logic
    const { ipfsUrl } = await certificateService.createAndStoreCertificate({
      learnerName,
      walletAddress,
      course,
      courseId,
    });
    res.json({ success: true, message: 'Certificate generated.', ipfsUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
