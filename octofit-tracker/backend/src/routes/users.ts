import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { User } from '../models/User.js';

export const userRoutes: Router = express.Router();

// Get all users
userRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
userRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create new user
userRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { username, email, password: pwd } = req.body;

    if (!username || !email || !pwd) {
      res.status(400).json({ error: 'Username, email, and password are required' });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const user = new User({ username, email, password: pwd });
    await user.save();

    const userResponse = user.toObject();
    const { password: _removedPwd, ...userWithoutPassword } = userResponse;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
userRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
userRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});
