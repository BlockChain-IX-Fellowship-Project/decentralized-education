import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import courseRoutes from './routes/courseRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import ipfsRoutes from './routes/ipfsRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection with graceful handling
const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/decentralized-education';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    console.log('✅ MongoDB Connected');
    return true;
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed:', err.message);
    console.log('💡 You can still use IPFS features without MongoDB');
    return false;
  }
};

// Initialize MongoDB connection
let mongoConnected = false;
connectMongoDB().then(connected => {
  mongoConnected = connected;
});

app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ipfs', ipfsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Decentralized Education Backend',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoConnected ? 'connected' : 'disconnected',
      ipfs: 'available'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 IPFS health: http://localhost:${PORT}/api/ipfs/health`);
});