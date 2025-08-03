import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  learnerName: { type: String, required: true },
  issueDate: { type: Date, required: true },
  ipfsHash: { type: String }, // Pinata/IPFS hash
  downloadUrl: { type: String }, // IPFS or local URL
});

export default mongoose.model('Certificate', certificateSchema);
