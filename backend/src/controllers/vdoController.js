import 'dotenv/config';
import fs from 'fs';
import PinataClient from '@pinata/sdk';

const pinata = new PinataClient(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
console.log('PINATA_API_KEY:', process.env.PINATA_API_KEY);
console.log('PINATA_API_SECRET:', process.env.PINATA_API_SECRET);
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Debug: Confirm file location
    console.log("Multer saved file to:", req.file.path);

    // Read file directly from Multer's path
    const readableStream = fs.createReadStream(req.file.path);
    const options = {
      pinataMetadata: {
        name: req.file.originalname,
      },
      pinataOptions: {
        cidVersion: 0
      }
    };

    // Debug: Before pinFileToIPFS
    console.log('About to upload to Pinata:', req.file.originalname);

    const result = await pinata.pinFileToIPFS(readableStream, options);

    // Debug: After pinFileToIPFS
    console.log('Pinata upload result:', result);

    // Clean up: Delete temporary file
    fs.unlinkSync(req.file.path);

    // Debug: Before sending response
    console.log('Sending response to client');

    res.status(201).json({
      ipfsHash: result.IpfsHash,
      originalName: req.file.originalname
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};