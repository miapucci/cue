# What to run in Supabase (if anything)

## Two ways to create account / sign in

1. **Supabase Auth (recommended)**  
   The app can use **Supabase Auth** for Create account and Sign in (email + password). Users are stored in Supabase and **no Mac backend is required** for auth.  
   - In Xcode set **SupabaseURL** and **SupabaseAnonKey** (Build Settings or Info.plist) from Supabase Dashboard → Settings → API.  
   - Run the **RLS migration** below so the app can read/write its own row in `public.users`.  
   - See **docs/SUPABASE_AUTH_SWITCH.md** for full setup and why "nothing showed in terminal".

2. **Custom backend (Node)**  
   The Node backend can still handle auth; run it and point the app at it. Users are stored in the same `public.users` table.

---

## One-time schema setup

**If you haven’t already**, create the tables in your Supabase project:

1. Open **Supabase Dashboard → SQL Editor**.
2. Open **`backend/src/db/schema.postgres.sql`** in this repo and copy its **entire** contents.
3. Paste into the SQL Editor and click **Run**.

That creates (or safely skips if they exist): `users`, `briefs`, `submissions`, `reviews`, `messages`, `device_tokens`, and indexes.

### If `users` already existed but is missing columns

**Email + password (Sign in / Create account):**  
Run this in **Supabase Dashboard → SQL Editor** so Sign in and Create account can store users (safe to run multiple times):

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
```

**Sample clips (talent):**  
If `sample_clip_urls` is missing:

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS sample_clip_urls TEXT;
```

Or use **`backend/src/db/migrations/add_sample_clip_urls.sql`** if it exists.

### RLS when using Supabase Auth from the app

When the app uses Supabase Auth (SupabaseURL + SupabaseAnonKey set), run **`backend/src/db/migrations/supabase_auth_rls.sql`** in Supabase SQL Editor once. It enables RLS so authenticated users can SELECT/INSERT/UPDATE their own row in `public.users`.

## Backend behavior

- Set **`DATABASE_URL`** in backend `.env` to your Supabase Postgres connection string (Project Settings → Database → Connection string, e.g. “Transaction” pooler).
- On startup the backend runs **`initDb()`**, which executes the same schema script from **`dist/db/schema.postgres.sql`** (the build step copies `src/db/schema.postgres.sql` into `dist/db/`). So if the schema was already applied in Supabase, `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` are no-ops.
- **All mutations** (auth, PATCH /me, briefs, submissions, sample clips, device tokens, etc.) **write to Postgres** via the same `DATABASE_URL`. There is no in-memory-only path for production data.
- If the app uses **Supabase Auth** and still calls the backend (e.g. clip upload), set **`SUPABASE_JWT_SECRET`** in backend `.env` to your Supabase JWT Secret (Dashboard → Settings → API). The backend then accepts Supabase access tokens as Bearer.

## Quick verification

After signing in and completing the talent 3-clips step:

- **Supabase → Table Editor → `users`**: you should see your user row and **`sample_clip_urls`** populated with a JSON array of up to 3 URLs.
