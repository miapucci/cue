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
import { verify, verifySupabaseJWT, getAlgFromToken } from './auth/jwt.js';
import { findUserById } from './db/index.js';
const app = express();
// CORS: default allows all origins (fine for token-based API). Set CORS_ORIGIN to comma-separated list to restrict.
const corsOrigin = process.env['CORS_ORIGIN']?.trim();
app.use(cors(corsOrigin ? { origin: corsOrigin.split(',').map((s) => s.trim()).filter(Boolean) } : {}));
app.use(express.json({ limit: '1mb' }));
// Log every request so you can see if the app is hitting the backend
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.use('/auth', authRouter);
// Debug: GET /debug-auth with Authorization: Bearer <token> returns exact auth error or { ok, userId }.
// Use from curl/Postman to see why token fails without going through the app.
app.get('/debug-auth', async (req, res) => {
    const header = req.headers['authorization'];
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: 'Missing Authorization: Bearer <token>' });
    }
    const alg = getAlgFromToken(token);
    try {
        try {
            const payload = verify(token);
            const user = await findUserById(payload.userId);
            if (!user) {
                return res.status(401).json({ error: 'User not found', userId: payload.userId, alg });
            }
            return res.json({ ok: true, userId: payload.userId, source: 'session', alg });
        }
        catch {
            const supabase = await verifySupabaseJWT(token);
            const userId = supabase.sub.toLowerCase();
            const user = await findUserById(userId);
            if (!user) {
                return res.status(401).json({ error: 'User not found', userId, alg });
            }
            return res.json({ ok: true, userId, source: 'Supabase', alg });
        }
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : String(err);
        console.warn('[debug-auth]', msg, 'alg:', alg);
        return res.status(401).json({ error: msg, alg });
    }
});
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
    }
    catch (err) {
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
