# Prompt: First Screen = "Cue, Your Cue to Create"; Sign In vs Create Account (Email+Password); Supabase

**Send this to your developer agent.**

---

## Prompt to send

```
The app flow is wrong: the first screen is still "Create account". It must be "Cue, your cue to create". After users choose Talent or Creator, they must get the choice between Sign in (email+password) and Create account (email+password). All of this must persist in Supabase.

**Non‑negotiable flow**

1. **First screen must be "Cue, your cue to create" — not Create account**
   - The very first screen a user sees (when not logged in) must be the **Role Select** screen: Cue logo, headline "Your cue to create.", subline (e.g. "Find talent or get cast. Pick your side."), and the two role cards: "I need video" (Creator) and "I want to get cast" (Talent).
   - **Do not show a "Create account" or sign-in screen first.** Cold start → loading if needed → then this Role Select screen only. Remove or bypass any logic that shows Create account / Auth as the initial screen. The app entry point for unauthenticated users must go directly to Role Select ("Cue, your cue to create").

2. **After they tap Creator or Talent: offer Sign in OR Create account (both email+password)**
   - Only after the user taps one of the two role cards (Creator or Talent), show a screen that gives them **two options**:
     - **Sign in** — for existing users: email + password. Calls the backend to verify and return { user, token }.
     - **Create account** — for new users: email + password (and confirm password). Calls the backend to create the user and return { user, token }.
   - Both flows use **email + password** only. The chosen role (Creator or Talent) is already set from the previous screen and must be sent to the backend so the user is stored with that role.
   - Flow: **Role Select ("Cue, your cue to create") → user taps Creator or Talent → screen with "Sign in" and "Create account" → user picks one → email+password form → backend → user stored in Supabase → app stores token and user → role-specific onboarding.**

3. **All users must be stored in Supabase**
   - **Sign in (email+password):** Backend looks up user by email in the **users** table (in Supabase), verifies password against the stored `password_hash`, then returns { user, token }. No in-memory or session-only users.
   - **Create account (email+password):** Backend creates a new row in the **users** table in Supabase with: id, email, password_hash (hashed only — never store raw password), role (creator or talent), and any defaults. Then returns { user, token }.
   - Use **Supabase** as the database: connection string in `DATABASE_URL`, and ensure the **users** table has columns: id, email, password_hash, role, display_name, bio, social_link, onboarding_complete, onboarding_step, sample_clip_urls, etc. (see `backend/src/db/schema.postgres.sql`). If the table already exists in Supabase but is missing `email` or `password_hash`, run the migration (see docs/SUPABASE_SETUP.md).
   - Verify in **Supabase Dashboard → Table Editor → users** that after sign-in or create account, a row exists with the correct email and role.

4. **Passwords: stored securely, used only for verification**
   - On **Create account**, the app collects email, password, and confirm password; backend hashes the password (e.g. bcrypt) and stores only the hash in `users.password_hash` and the email in `users.email`. Never store or log the raw password.
   - On **Sign in**, the app sends email + password; backend finds the user by email in Supabase, compares the submitted password to the stored hash (e.g. bcrypt.compare); if it matches, return { user, token }; if not, return 401. Passwords must not be returned in any API response.

**What to check and fix**

- **App entry:** Change the root/flow controller so that when there is no valid session, the **first** screen shown is the Role Select screen ("Cue, your cue to create" with the two cards). Remove any path that shows "Create account" or a sign-in screen before the user has seen Role Select. Check: AppFlowController, RootView, and the initial step of OnboardingContainerView (e.g. step = roleSelect, not auth).
- **After role selection:** When the user taps Creator or Talent, show a **choice screen**: "Sign in" (existing user) and "Create account" (new user). Then:
  - Tapping "Sign in" → show email + password form → POST /auth/email/login (or equivalent) with { email, password, role } → backend verifies against Supabase users table → return { user, token }.
  - Tapping "Create account" → show email + password + confirm password form → POST /auth/email/register (or equivalent) with { email, password, role } → backend creates row in Supabase users (hash password, set email, role) → return { user, token }.
- **Supabase:** Ensure `DATABASE_URL` points to your Supabase Postgres connection string. Run the schema (or migration) so that `users` has `email` and `password_hash`. All create-account and sign-in flows must read/write the **users** table in Supabase.
- **Backend:** Implement (or fix) POST /auth/email/register (create account: hash password, insert into users in Supabase) and POST /auth/email/login (sign in: find by email, verify password, return { user, token }). Both must accept `role` (creator | talent) so the user is stored with the correct role.

**Definition of done**

- Cold start → first screen is "Cue, your cue to create" (Role Select) only — never "Create account" first.
- User taps Creator or Talent → then sees "Sign in" and "Create account" → picks one → email+password flow → backend reads/writes Supabase **users** table → app gets { user, token } and proceeds to onboarding.
- In Supabase Table Editor, the **users** table shows the new/updated row with correct email, role, and password_hash (hashed) after create account or sign in.
```

---

**Reference:** App entry: **AppFlowController**, **RootView**, **OnboardingContainerView** (initial step = roleSelect so first screen is Role Select). After role tap: screen with "Sign in" and "Create account" → **SignInView** / **CreateAccountView** or **AuthView** with mode; email+password forms send role to backend. Backend: **auth** routes (POST /auth/email/register, POST /auth/email/login), **db** (insertUser, findUserByEmail), **Supabase** as DB; schema: `backend/src/db/schema.postgres.sql`. Supabase setup: `docs/SUPABASE_SETUP.md`.
