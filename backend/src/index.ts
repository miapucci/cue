import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env'), quiet: true });

import express from 'express';
import cors from 'cors';
import { initDb } from './db/index.js';
import { requireAuth, requireRole } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ensureUploadDir } from './services/storage.js';
import authRouter from './routes/auth.js';
import meRouter from './routes/me.js';
import briefsRouter from './routes/briefs.js';
import submissionsRouter from './routes/submissions.js';
import earningsRouter from './routes/earnings.js';
import reviewsRouter from './routes/reviews.js';
import messagesRouter from './routes/messages.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Log every request so you can see if the app is hitting the backend
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/auth', authRouter);

app.use('/me', requireAuth, meRouter);
app.use('/briefs', requireAuth, briefsRouter);
app.use('/submissions', requireAuth, submissionsRouter);
app.use('/earnings', requireAuth, requireRole('talent'), earningsRouter);
app.use('/reviews', requireAuth, reviewsRouter);
app.use('/messages', requireAuth, messagesRouter);

ensureUploadDir();
const uploadsPath = process.env['UPLOAD_DIR'] ?? join(process.cwd(), 'data', 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use(errorHandler);

// Health check so you can verify the server is running: curl http://127.0.0.1:3000/
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Cue API' });
});

const port = parseInt(process.env['PORT'] ?? '3000', 10);

async function main() {
  try {
    await initDb();
    console.log('Database connected.');
  } catch (err) {
    console.error('Database init failed (server will still start):', err);
    console.error('Set DATABASE_URL in backend/.env and ensure Supabase is reachable.');
  }

  app.listen(port, () => {
    console.log(`\nCue API listening on http://127.0.0.1:${port}`);
    console.log('Check it: curl http://127.0.0.1:3000/');
    console.log('Register: curl -X POST http://127.0.0.1:3000/auth/email/register -H "Content-Type: application/json" -d \'{"email":"a@b.com","password":"password123","role":"creator"}\'\n');
  });
}

// Export app for Vercel serverless; only start listening when not on Vercel
export { app };

if (process.env['VERCEL'] !== '1') {
  main().catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
}