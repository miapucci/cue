// Vercel serverless entry: all requests are forwarded to the Express app.
// Export a function so Vercel always sees a valid serverless handler (avoids "Invalid export" crash).
import { app } from '../dist/index.js';

export default function handler(req, res) {
  return app(req, res);
}
