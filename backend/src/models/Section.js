import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  title: String,
  description: String, // Added description field
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  quizzes: [
    {
      question: String,
      options: [String],
      correctAnswer: String
    }
  ]
});

export default mongoose.model('Section', sectionSchema);
