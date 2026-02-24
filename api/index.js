// Vercel serverless entry when project root is repo root (Tobi).
// All requests rewrite to /api; this handler forwards to the Express app.
import { app } from '../backend/dist/index.js';

export default function handler(req, res) {
  return app(req, res);
}
