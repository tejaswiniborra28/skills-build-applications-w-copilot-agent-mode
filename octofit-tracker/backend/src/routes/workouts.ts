import express, { Router } from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Workout } from '../models/Workout';

export const workoutRoutes: Router = express.Router();

// Get all workouts
workoutRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const workouts = await Workout.find().populate('userId', 'username email');
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// Get workouts by user ID
workoutRoutes.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userIdParam = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const userId = new mongoose.Types.ObjectId(userIdParam);
    const workouts = await Workout.find({ userId })
      .populate('userId', 'username email');
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user workouts' });
  }
});

// Get workout by ID
workoutRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('userId', 'username email');
    
    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
});

// Create new workout
workoutRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, name, description, type, difficulty, duration, targetCalories, exercises } = req.body;

    if (!userId || !name || !description || !type || !difficulty || !duration || targetCalories === undefined) {
      res.status(400).json({ error: 'All required fields must be provided' });
      return;
    }

    const workout = new Workout({
      userId,
      name,
      description,
      type,
      difficulty,
      duration,
      targetCalories,
      exercises: exercises || [],
    });

    await workout.save();
    await workout.populate('userId', 'username email');

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

// Update workout
workoutRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description, type, difficulty, duration, targetCalories, exercises } = req.body;
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { name, description, type, difficulty, duration, targetCalories, exercises },
      { new: true }
    ).populate('userId', 'username email');

    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// Delete workout
workoutRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});
