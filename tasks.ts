import express, { Response, NextFunction } from 'express';
import { Task } from '../models/Task.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

// Get all tasks for the user
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get task by ID
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create task
router.post('/', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.userId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Update task status only
router.patch('/:id/status', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: req.body.status },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

// Delete task
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
