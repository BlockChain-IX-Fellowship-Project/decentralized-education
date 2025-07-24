import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  fileName: String,
  originalName: String,
  ipfsHash: String,
  uploader: { type: String, required: true }, // wallet address
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Video', videoSchema);
