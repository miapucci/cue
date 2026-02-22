# Switching to Supabase for Create Account / Sign In

## Why switch?

- **“Nothing showed in Mac terminal”** when you created an account: the app likely never hit your Mac backend (e.g. Simulator or device was using a URL that didn’t reach the machine running `npm run dev`, or the backend wasn’t running). So no request was logged and no row was written.
- **“Users won’t be able to connect to my Mac”**: in production, real users will talk to a **deployed** backend (e.g. on Vercel/Railway) and a **public** API URL, not your laptop. For **development and testing**, using **Supabase Auth** from the app means Create account and Sign in work **without running the Node backend at all**. Accounts are stored in Supabase and work from any network (Simulator, device, anywhere).

So “switch our backend to Supabase” here means: **use Supabase for auth and profile** (Create account, Sign in, and profile in `public.users`). The Node backend is still used for clip upload, briefs, submissions, etc., and can be deployed later for production.

---

## What was implemented

1. **iOS**
   - **Supabase Swift SDK** added; **SupabaseAuthService** does email sign-up/sign-in and profile read/update in `public.users`.
   - When **SupabaseURL** and **SupabaseAnonKey** are set in the app (Info.plist / Build Settings), the app uses **Supabase Auth** for Create account and Sign in. No request goes to your Mac for auth.
   - Profile (getMe, updateMe) when signed in via Supabase is read/updated via Supabase client. The same Supabase access token is stored and sent to the **Node backend** for clip upload (and any other protected routes).

2. **Backend**
   - **requireAuth** accepts either the existing JWT (from backend auth) or a **Supabase JWT**. For Supabase tokens it uses **SUPABASE_JWT_SECRET** to verify and sets `req.userId` from the token’s `sub`. So clip upload and other protected routes work for Supabase-authenticated users.

3. **Supabase**
   - **RLS** migration: `backend/src/db/migrations/supabase_auth_rls.sql`. Run it in Supabase SQL Editor so the app can insert/select/update its own row in `public.users` (id = auth.uid()).

---

## Setup (Supabase Auth only – no Mac backend for auth)

1. **Supabase Dashboard**
   - **Authentication → Providers**: ensure **Email** is enabled.
   - **Settings → API**: copy **Project URL** and **anon public** key.

2. **Xcode**
   - Set **SupabaseURL** and **SupabaseAnonKey** for the Cue target (e.g. Build Settings → add **INFOPLIST_KEY_SupabaseURL** and **INFOPLIST_KEY_SupabaseAnonKey**, or add keys to Info.plist).
   - Use your Project URL and anon key from step 1.

3. **Supabase SQL Editor**
   - Run the contents of **`backend/src/db/migrations/supabase_auth_rls.sql`** once.

4. **Optional – clip upload / other backend routes**
   - In **backend/.env** set **SUPABASE_JWT_SECRET** (Dashboard → Settings → API → JWT Secret).
   - Start the backend when you need clip upload: `cd backend && npm run dev`.

After this, Create account and Sign in use Supabase only; nothing is required in the Mac terminal for auth. You should see new users in **Supabase → Table Editor → users** and in **Authentication → Users**.

---

## If you keep using the Node backend for auth

- Leave **SupabaseURL** / **SupabaseAnonKey** empty in the app. The app will use the existing flow (POST /auth/email/register, POST /auth/email/login) and your Mac backend.
- Ensure the backend is running and the app’s API base URL points at it (e.g. Mac IP for Simulator). See **docs/DEV_HANDOFF_ENTRY_AUTH_AND_BACKEND.md**.
