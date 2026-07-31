import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import resumeRoutes from './routes/resume';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resume-builder';
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error: any) {
    console.warn('Warning: Could not connect to MongoDB:', error.message || error);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', dbConnected: isConnected });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
