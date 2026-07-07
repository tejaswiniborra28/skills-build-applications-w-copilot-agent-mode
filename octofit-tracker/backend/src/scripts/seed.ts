/**
 * OctoFit Tracker Database Seeding Script
 * 
 * Seed the octofit_db database with test data
 * 
 * This file documents the test data seed for the octofit_db database.
 * Run with: npm run seed
 * 
 * Test Data Description:
 * - 5 Users: Alice (runner), Bob (cyclist), Carol (swimmer), Dave (lifter), Eva (yogi)
 * - 3 Teams: Morning Runners, Cycling Club, Fitness Warriors
 * - 8 Activities: Logged workouts across different fitness types
 * - 5 Leaderboard Entries: Ranked by total calories burned
 * - 7 Workouts: Personalized training plans at various difficulty levels
 * 
 * Database Collections:
 * - users: User accounts with email and password
 * - teams: Team groups with members and leaders
 * - activities: Activity logs with calories and duration
 * - leaderboards: Competitive rankings with stats
 * - workouts: Training plans with exercises and targets
 * 
 * Seed Script: seed-runner.cjs
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { Activity } from '../models/Activity';
import { Leaderboard } from '../models/Leaderboard';
import { Workout } from '../models/Workout';

dotenv.config();

/**
 * Test Data Seed Description
 * 
 * Creates a complete dataset for testing the OctoFit Tracker application:
 * - 5 fitness enthusiasts with different workout preferences
 * - Teams organized by activity type and commitment level
 * - Activity logs showing realistic workout patterns
 * - Leaderboard data based on calorie burn totals
 * - Personalized workout plans for each user
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    console.log('🔄 Clearing existing data...');
    await User.deleteMany({});
    await Team.deleteMany({});
    await Activity.deleteMany({});
    await Leaderboard.deleteMany({});
    await Workout.deleteMany({});

    console.log('👤 Creating test users...');
    const users = await User.create([
      { username: 'alice_runner', email: 'alice@example.com', password: 'hashedPassword123' },
      { username: 'bob_cyclist', email: 'bob@example.com', password: 'hashedPassword456' },
      { username: 'carol_swimmer', email: 'carol@example.com', password: 'hashedPassword789' },
      { username: 'dave_lifter', email: 'dave@example.com', password: 'hashedPasswordABC' },
      { username: 'eva_yogi', email: 'eva@example.com', password: 'hashedPasswordDEF' },
    ]);
    console.log(`  ✓ Created ${users.length} test users`);

    console.log('✅ Test data seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
