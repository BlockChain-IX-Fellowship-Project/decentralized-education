import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: { type: String, required: true }, // wallet address
  instructor: String, // Add instructor name
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' }, // Fixed values for course level
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }]
});

export default mongoose.model('Course', courseSchema);