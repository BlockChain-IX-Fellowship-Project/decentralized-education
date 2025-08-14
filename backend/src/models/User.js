import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  bio: { type: String },
  // Add more fields as needed
});

export default mongoose.model('User', userSchema);
