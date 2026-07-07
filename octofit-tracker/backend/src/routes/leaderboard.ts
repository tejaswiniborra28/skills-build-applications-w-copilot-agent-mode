import express, { Router } from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Leaderboard } from '../models/Leaderboard';

export const leaderboardRoutes: Router = express.Router();

// Get leaderboard (top users)
leaderboardRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const leaderboard = await Leaderboard.find()
      .sort({ totalCalories: -1, activityCount: -1 })
      .limit(limit);

    // Update ranks
    const rankedLeaderboard = leaderboard.map((entry, index) => {
      entry.rank = index + 1;
      return entry;
    });

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get specific user leaderboard entry
leaderboardRoutes.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userIdParam = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const userId = new mongoose.Types.ObjectId(userIdParam);
    const entry = await Leaderboard.findOne({ userId });
    
    if (!entry) {
      res.status(404).json({ error: 'Leaderboard entry not found' });
      return;
    }

    // Get all entries to calculate rank
    const allEntries = await Leaderboard.find()
      .sort({ totalCalories: -1, activityCount: -1 });
    
    const rank = allEntries.findIndex((e) => e.userId.toString() === userIdParam) + 1;
    entry.rank = rank;

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard entry' });
  }
});

// Update leaderboard entry (internal use)
leaderboardRoutes.put('/:userId', async (req: Request, res: Response) => {
  try {
    const userIdParam = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const userId = new mongoose.Types.ObjectId(userIdParam);
    const { totalCalories, activityCount } = req.body;
    const entry = await Leaderboard.findOneAndUpdate(
      { userId },
      {
        totalCalories,
        activityCount,
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (!entry) {
      res.status(404).json({ error: 'Leaderboard entry not found' });
      return;
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leaderboard entry' });
  }
});

// Create leaderboard entry
leaderboardRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, username } = req.body;

    if (!userId || !username) {
      res.status(400).json({ error: 'userId and username are required' });
      return;
    }

    const existingEntry = await Leaderboard.findOne({ userId });
    if (existingEntry) {
      res.status(400).json({ error: 'Leaderboard entry already exists for this user' });
      return;
    }

    const entry = new Leaderboard({
      userId,
      username,
      totalCalories: 0,
      activityCount: 0,
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create leaderboard entry' });
  }
});
