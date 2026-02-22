#!/usr/bin/env node
/**
 * One-time script: writes .env from environment variables.
 * Run after setting DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY in the terminal.
 *
 * Example (replace with your real values first):
 *   export DATABASE_URL="postgresql://postgres.xxx:password@host:6543/postgres"
 *   export JWT_SECRET="your-32-char-secret"
 *   export STRIPE_SECRET_KEY="sk_test_xxx"
 *   node write-env.js
 */
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const d = process.env.DATABASE_URL;
const j = process.env.JWT_SECRET;
const s = process.env.STRIPE_SECRET_KEY;

if (!d || !j || !s) {
  console.error('Missing env. Set these in this terminal first:');
  if (!d) console.error('  export DATABASE_URL="your-supabase-uri"');
  if (!j) console.error('  export JWT_SECRET="your-secret"');
  if (!s) console.error('  export STRIPE_SECRET_KEY="sk_test_xxx"');
  process.exit(1);
}

const content = `DATABASE_URL=${d}
JWT_SECRET=${j}
STRIPE_SECRET_KEY=${s}
PORT=3000
`;
fs.writeFileSync(envPath, content);
console.log('Wrote .env successfully. Run: npm run dev');
