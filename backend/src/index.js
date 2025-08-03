import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import sectionRoutes from './routes/sectionRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import vdoUpload from './routes/vdoUpload.js';
import certificateRoutes from './routes/certificateRoutes.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/upload', vdoUpload); 
app.use('/api/sections',sectionRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));