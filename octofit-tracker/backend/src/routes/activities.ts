import express, { Router } from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Activity } from '../models/Activity';

export const activityRoutes: Router = express.Router();

// Get all activities
activityRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate('userId', 'username email').sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get activities by user ID
activityRoutes.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userIdParam = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const userId = new mongoose.Types.ObjectId(userIdParam);
    const activities = await Activity.find({ userId })
      .populate('userId', 'username email')
      .sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
});

// Get activity by ID
activityRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('userId', 'username email');
    
    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Create new activity
activityRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, type, duration, caloriesBurned, date, description } = req.body;

    if (!userId || !type || duration === undefined || caloriesBurned === undefined) {
      res.status(400).json({ error: 'userId, type, duration, and caloriesBurned are required' });
      return;
    }

    const activity = new Activity({
      userId,
      type,
      duration,
      caloriesBurned,
      date: date || new Date(),
      description,
    });

    await activity.save();
    await activity.populate('userId', 'username email');

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// Update activity
activityRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const { type, duration, caloriesBurned, date, description } = req.body;
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { type, duration, caloriesBurned, date, description },
      { new: true }
    ).populate('userId', 'username email');

    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// Delete activity
activityRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});
