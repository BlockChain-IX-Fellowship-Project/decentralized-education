import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: { type: String, required: true }, // wallet address
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }]
});

export default mongoose.model('Course', courseSchema);