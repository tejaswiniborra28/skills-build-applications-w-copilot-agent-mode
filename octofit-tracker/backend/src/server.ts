import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userRoutes } from './routes/users';
import { teamRoutes } from './routes/teams';
import { activityRoutes } from './routes/activities';
import { leaderboardRoutes } from './routes/leaderboard';
import { workoutRoutes } from './routes/workouts';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✓ Connected to MongoDB at', MONGODB_URI);
})
.catch((err) => {
  console.error('✗ MongoDB connection error:', err.message);
});

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'OctoFit Tracker API is running',
    baseUrl,
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/workouts', workoutRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'OctoFit Tracker API',
    baseUrl,
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      teams: '/api/teams',
      activities: '/api/activities',
      leaderboard: '/api/leaderboard',
      workouts: '/api/workouts',
    },
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✓ Server is running on port ${PORT}`);
  console.log(`✓ Base URL: ${baseUrl}`);
  console.log(`✓ MongoDB URI: ${MONGODB_URI}`);
});
