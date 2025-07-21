import pinataService from '../services/vdoService.js';
import Video from '../models/Video.js';

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const { path: filePath, originalname: originalName, filename } = req.file;
    const uploader = req.body.uploader || 'unknown'; // Adjust as needed

    // Upload to Pinata
    const result = await pinataService.uploadToPinata(filePath, originalName);

    // Create Video document
    const newVideo = new Video({
      fileName: filename,
      originalName,
      ipfsHash: result.ipfsHash,
      uploader
    });
    await newVideo.save();

    res.status(201).json({
      ipfsHash: result.ipfsHash,
      videoId: newVideo._id,
      originalName
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};
