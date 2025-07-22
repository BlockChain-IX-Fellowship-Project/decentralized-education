import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Basic user info
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Blockchain integration
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // IPFS integration
  ipfsProfileHash: {
    type: String,
    unique: true,
    sparse: true
  },
  ipfsProfileUrl: {
    type: String
  },
  
  // Reputation and achievements
  reputation: {
    type: Number,
    default: 0
  },
  achievements: [{
    id: String,
    type: String,
    title: String,
    description: String,
    points: Number,
    earnedAt: Date,
    ipfsHash: String
  }],
  
  // Course relationships
  enrolledCourses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0
    },
    completedAt: Date
  }],
  
  createdCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  
  // Reviews and ratings
  reviews: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    rating: Number,
    comment: String,
    ipfsHash: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
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

// Indexes
userSchema.index({ username: 1, isActive: 1 });
userSchema.index({ walletAddress: 1, isActive: 1 });
userSchema.index({ reputation: -1 });

const User = mongoose.model('User', userSchema);
export default User; 