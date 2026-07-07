import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * OctoFit Tracker Database Configuration
 * Database: octofit_db (MongoDB)
 * 
 * Collections:
 * - users: User profiles and authentication
 * - teams: Team management and grouping
 * - activities: Workout logging and tracking
 * - leaderboards: Competitive rankings
 * - workouts: Personalized workout plans
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✓ Connected to MongoDB database: octofit_db');
    console.log(`✓ MongoDB URI: ${MONGODB_URI}`);
  } catch (error) {
    console.error('✗ MongoDB connection error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

export default mongoose;
