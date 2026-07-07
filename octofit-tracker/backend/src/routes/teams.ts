import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { Team } from '../models/Team.js';

export const teamRoutes: Router = express.Router();

// Get all teams
teamRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const teams = await Team.find().populate('leader', 'username email').populate('members', 'username email');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Get team by ID
teamRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'username email')
      .populate('members', 'username email');
    
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Create new team
teamRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, leader } = req.body;

    if (!name || !leader) {
      res.status(400).json({ error: 'Name and leader are required' });
      return;
    }

    const team = new Team({
      name,
      description,
      leader,
      members: [leader],
    });

    await team.save();
    await team.populate('leader', 'username email');
    await team.populate('members', 'username email');

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Add member to team
teamRoutes.post('/:id/members', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate('leader', 'username email').populate('members', 'username email');

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member to team' });
  }
});

// Remove member from team
teamRoutes.delete('/:id/members/:userId', async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: req.params.userId } },
      { new: true }
    ).populate('leader', 'username email').populate('members', 'username email');

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member from team' });
  }
});

// Update team
teamRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    ).populate('leader', 'username email').populate('members', 'username email');

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// Delete team
teamRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});
