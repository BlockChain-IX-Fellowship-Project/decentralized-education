import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // wallet address or user id
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  sectionStatuses: [
    {
      sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
      status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
      score: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      lastAttemptAt: { type: Date }
    }
  ],
  courseStatus: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('UserProgress', userProgressSchema);
