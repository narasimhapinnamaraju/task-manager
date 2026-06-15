import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to DB (will warn if MONGO_URI is missing)
  await connectDB();

  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
