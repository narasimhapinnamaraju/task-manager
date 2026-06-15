import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    
    // Generate token
    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-do-not-use';
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '7d' });

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-do-not-use';
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '7d' });

    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/profile', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, createdAt: req.user.createdAt } });
});

export default router;
