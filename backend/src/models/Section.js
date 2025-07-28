import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  title: String,
  description: String, // Added description field
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
