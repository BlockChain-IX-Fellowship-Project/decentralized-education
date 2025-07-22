import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  title: String,
  videoLinks: [String],
  docLinks: [String],
  quizzes: [quizSchema]
}, { _id: false });

const courseSchema = new mongoose.Schema({
  // Basic course information
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  contributor: {
    type: String,
    required: true,
    index: true
  },
  sections: [sectionSchema],
  
  // Additional fields for enhanced functionality
  category: {
    type: String,
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
    index: true
  },
  duration: {
    type: String,
    default: '4 weeks'
  },
  price: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    index: true
  }],
  
  // IPFS integration fields
  ipfsMetadataHash: {
    type: String,
    unique: true,
    sparse: true
  },
  ipfsContentIndexHash: {
    type: String
  },
  ipfsGatewayUrl: {
    type: String
  },
  
  // Blockchain integration fields
  contractAddress: {
    type: String
  },
  tokenId: {
    type: String
  },
  
  // Status and verification
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Analytics and engagement
  enrollmentCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better search performance
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ contributor: 1, status: 1 });
courseSchema.index({ category: 1, difficulty: 1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
