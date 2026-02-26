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
import { ensureUploadDir, UPLOAD_DIR } from './services/storage.js';
import authRouter from './routes/auth.js';
import meRouter from './routes/me.js';
import briefsRouter from './routes/briefs.js';
import submissionsRouter from './routes/submissions.js';
import earningsRouter from './routes/earnings.js';
import reviewsRouter from './routes/reviews.js';
import messagesRouter from './routes/messages.js';

const app = express();
// CORS: default allows all origins (fine for token-based API). Set CORS_ORIGIN to comma-separated list to restrict.
const corsOrigin = process.env['CORS_ORIGIN']?.trim();
app.use(cors(corsOrigin ? { origin: corsOrigin.split(',').map((s) => s.trim()).filter(Boolean) } : {}));
app.use(express.json({ limit: '1mb' }));

app.use((req, _res, next) => {
  console.log(req.method, req.path);
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
app.use('/uploads', express.static(UPLOAD_DIR));

app.use(errorHandler);

// Health check: curl http://127.0.0.1:3000/
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Cue API' });
});

// Debug: DB role and brief count (for RLS troubleshooting). Remove or protect in production.
app.get('/debug/db-role', async (_req, res) => {
  try {
    const { getPool } = await import('./db/index.js');
    const r = await getPool().query(
      "SELECT current_user AS role, (SELECT COUNT(*)::int FROM briefs) AS brief_count, (SELECT COUNT(*)::int FROM briefs WHERE status = 'live') AS live_count"
    );
    res.json(r.rows[0] ?? { role: null, brief_count: 0, live_count: 0 });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Debug: feed payload without auth (same shape as GET /briefs/feed). Use to confirm DB/RLS on Vercel.
app.get('/debug/briefs-feed', async (_req, res) => {
  try {
    const { findLiveBriefs, briefRowToBrief, countSubmissionsForBrief } = await import('./db/index.js');
    const limit = 20;
    const { rows, nextCursor } = await findLiveBriefs(limit, null);
    const briefs = await Promise.all(rows.map(async (r) => briefRowToBrief(r, await countSubmissionsForBrief(r.id))));
    res.json({ briefs, nextCursor, _debug: { count: briefs.length } });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
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