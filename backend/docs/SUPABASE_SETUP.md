# Supabase setup for Cue backend

The backend uses Postgres (Supabase). You need the schema applied before auth and app flow work.

## Option 1: Run backend once (recommended)

1. In Supabase: **Project Settings → Database** → copy the **Connection string** (URI). Use the **Session mode** (direct) connection string, or the **Transaction** pooler if you prefer.
2. In the backend repo, create or edit `backend/.env` and set:
   ```env
   DATABASE_URL=postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
   ```
   (Replace with your actual Supabase connection string; use your real password, no brackets.)
3. From the project root:
   ```bash
   cd backend && npm run dev
   ```
4. On startup, the backend runs `backend/src/db/schema.postgres.sql` automatically (via `initDb()` in `index.ts`). It uses `CREATE TABLE IF NOT EXISTS`, so it is safe to run multiple times.

No other queries are required for basic auth and flow.

## Option 2: Run the schema manually in Supabase

If you prefer to apply the schema yourself (e.g. before ever starting the backend):

1. In Supabase Dashboard go to **SQL Editor**.
2. Open `backend/src/db/schema.postgres.sql` and copy its full contents.
3. Paste into the SQL Editor and run it.

This creates (if not already present):

- **users** – Sign in with Apple (and mock dev) users; profile and onboarding state.
- **briefs** – Creator briefs.
- **submissions** – Talent submissions per brief.
- **reviews** – Reviews on submissions.
- **messages** – Thread messages per submission.
- **device_tokens** – Push notification tokens.

Indexes are created for common lookups. No other migrations or queries are required for basic auth and app flow unless you add new features or RLS (Row Level Security) later.

## Tables summary

| Table           | Purpose                                      |
|----------------|----------------------------------------------|
| users          | Accounts (apple_sub, role, onboarding_step)  |
| briefs         | Creator briefs                               |
| submissions    | Talent submissions to briefs                 |
| reviews        | Reviews on submissions                       |
| messages       | Messages per submission thread               |
| device_tokens  | Push tokens for notifications                |

## Environment

- **DATABASE_URL** – Required. Postgres connection string from Supabase.
- **JWT_SECRET** – Required for auth. At least 32 characters.
- **APPLE_CLIENT_ID** – Optional. If unset, backend accepts mock/dev tokens (simulator and “Sign in with test account”).
- **PORT** – Optional; default 3000.
