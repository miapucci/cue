# Dev handoff: entry flow, auth, and local backend

**For the developer taking over.** Entry flow, email+password auth, and how to run the backend so the app doesn’t show “Couldn’t connect to the server.”

---

## 1. Entry flow (already implemented)

- **First screen** must be **Role Select**: “Cue, your cue to create” with the two cards (Creator / Talent). No sign-in or create-account screen before this.
- **Only after** the user taps Creator or Talent do they see **Create account** and **Sign in**. Both use email+password (and optionally Sign in with Apple).
- **Flow:** Role Select → Create account or Sign in → Auth (email+password or Apple) → onboarding.

**Relevant code:**  
`Cue/Onboarding/OnboardingContainerView.swift` (steps: `.roleSelect` → `.createOrSignIn` → `.auth`), `RoleSelectView.swift`, `CreateOrSignInView.swift`, `AuthView.swift`, `EmailPasswordView.swift`.

---

## 2. Email+password auth (already implemented)

- **Create account:** `POST /auth/email/register` with `{ email, password, role }`. Backend hashes password (scrypt), writes to Supabase `users` (email, password_hash, role, apple_sub = `email:${email}`), returns `{ user, token }`.
- **Sign in:** `POST /auth/email/login` with `{ email, password, role }`. Backend finds user by email, verifies password, returns `{ user, token }`.
- **iOS:** `EmailPasswordView` (opened when user taps “Continue with email”), `AppState.registerWithEmail` / `signInWithEmail`, `HTTPAPIClient` methods. Backend: `backend/src/routes/auth.ts`, `backend/src/db/index.ts`. Users live in **Supabase Table Editor → public.users**, not Supabase Authentication.
- **Schema:** `users` must have `email` and `password_hash`. See **`docs/SUPABASE_SETUP.md`** for migration if the table already existed without these columns.

---

## 3. “Couldn’t connect to the server” in Simulator

- **Error 61 (connection refused)** means nothing is listening on port 3000 when the app runs.
- **Fix:** Start the backend **before** using the app.

### Step-by-step (do this every time you test the app)

1. **Open Terminal** (not Xcode’s console). Go to the backend folder (project root = where `backend` lives):
   ```bash
   cd /Users/miapucci/Tobi/backend
   ```
2. Start the backend:
   ```bash
   npm run dev
   ```
3. **You must see:** `Cue API listening on http://127.0.0.1:3000`  
   If you see **`Failed to start:`** or **`Database init failed`** instead, fix that first (e.g. `DATABASE_URL` in `backend/.env`). The server can still start and log requests even if DB fails; you’ll get 500 when registering until DB is fixed.
4. **Leave that Terminal window open.** Don’t close it.
5. In **another** Terminal, check the server is reachable:
   ```bash
   curl http://127.0.0.1:3000/
   ```
   You should see `{"ok":true,"message":"Cue API"}`. If you get “Connection refused”, the server isn’t running.
6. Run the app in the **Simulator** and try Create account. The **first** Terminal (where `npm run dev` is running) should show `POST /auth/email/register`. If the app still says “Couldn’t connect” and nothing appears there, the Simulator isn’t reaching the Mac — use the **Simulator + Mac IP** fix below.

### Simulator gets “Couldn’t connect” but curl works

On some Macs the **Simulator’s** `127.0.0.1` is the Simulator’s own loopback, not the host Mac. So the backend (on the Mac) is never reached. **Fix:** point the app at your **Mac’s IP** instead of 127.0.0.1.

1. In **Terminal**, get your Mac’s IP:
   ```bash
   ipconfig getifaddr en0
   ```
   Example output: `192.168.1.5`.

2. In **Xcode**: select the **Cue** target → **Build Settings** → search for **CueAPIBaseURL** (or open the **Info** tab and find the same key). For the **Debug** configuration, set:
   ```text
   http://192.168.1.5:3000
   ```
   (use the IP you got from step 1).

3. **Clean build** (Product → Clean Build Folder) and run the app in the Simulator again. The app will use your Mac’s IP and the backend (listening on all interfaces) will accept the connection.

**HTTP to localhost:** Allowed via **Info.plist** at **project root**: `Cue/Info.plist` (NSAppTransportSecurity exception for localhost / 127.0.0.1). **Do not** put Info.plist inside `Cue/Cue/` or you get a “Multiple commands produce” build error.

---

## 4. Device testing

On a **physical device**, `127.0.0.1` is the device itself, not the Mac. So the Simulator URL won’t work.

- Set **CueAPIBaseURL** (Debug) in Xcode to `http://<Mac IP>:3000` (e.g. `http://192.168.1.10:3000`).
- Get Mac IP: `ipconfig getifaddr en0` in Terminal.
- Mac and phone must be on the same Wi‑Fi.

---

## 5. Verify

1. **Backend:** `npm run dev` → “Cue API listening on http://127.0.0.1:3000”.
2. **Second terminal:**  
   `curl -X POST http://127.0.0.1:3000/auth/email/register -H "Content-Type: application/json" -d '{"email":"a@b.com","password":"password123","role":"creator"}'`  
   → JSON response with user + token; first terminal shows `POST /auth/email/register`.
3. **Supabase Table Editor → users:** New row appears (e.g. a@b.com).
4. **App in Simulator** (with backend running): First screen = Role Select; Create account via email+password succeeds; backend logs the request.

---

## 6. Paths and files

| Area | Paths |
|------|--------|
| **Entry / flow** | `Cue/Onboarding/OnboardingContainerView.swift`, `RoleSelectView.swift`, `CreateOrSignInView.swift`, `AuthView.swift`, `EmailPasswordView.swift` |
| **API / config** | `Cue/Services/HTTPAPIClient.swift` (APIConfig.baseURL), `Cue/AppState.swift` (registerWithEmail, signInWithEmail) |
| **Info.plist** | `Cue/Info.plist` (project root; NSAppTransportSecurity for localhost / 127.0.0.1) |
| **Backend auth** | `backend/src/routes/auth.ts` |
| **Backend DB** | `backend/src/db/index.ts` (insertUser, findUserByEmail), `backend/src/db/schema.postgres.sql` |
| **Docs** | `docs/SUPABASE_SETUP.md` (schema + migration for email/password_hash, sample_clip_urls) |

---

## 7. Supabase

- Users are in **Table Editor → public.users** (Postgres), not Supabase Auth.
- `backend/.env` must have **DATABASE_URL** set to the Supabase Postgres connection string.
- If `users` already existed without `email` / `password_hash`, run the migration in `docs/SUPABASE_SETUP.md`.
