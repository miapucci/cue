# Prompt: Fix Continue Button, Sign-In (Apple/Google), and Supabase

**Send this to your developer agent.**

---

## Prompt to send

```
We're still having flow and auth issues:

1. **Continue button doesn't work to get into the right app** – After onboarding (e.g. Creator profile "Continue" or Talent profile "Continue"), the app should advance to the next step and eventually land in Creator home or Talent home. Right now Continue doesn't get me into the right app (stuck on same screen or wrong screen).

2. **Sign in with Apple / Google isn't working** – Tapping Sign in with Apple (or Google if we have it) doesn't successfully sign me in. The backend may not be receiving or accepting the request, or the app may not be handling the response correctly.

3. **Supabase – nothing has been run** – I haven't been told to run any queries in Supabase. I want to confirm: is there anything I need to run in Supabase (e.g. schema, migrations) for the backend to work? If yes, document exactly what to run and where (file path + steps).

**What I need you to do**

**A. Fix the Continue button so it gets the user into the right app**

- **Creator flow:** On Creator profile screen, "Continue" must call the backend **PATCH /me** with displayName, bio, socialLink, and **onboardingStep: "post_brief"**. The response returns the updated user. The app must then **update local state** so the next screen shown is the next onboarding step (post first brief), and after that step completes (e.g. brief posted), **onboardingComplete** must be set and the user must see **Creator home** (CreatorTabView). Ensure: (1) The app sends the Bearer token (from the auth response) on PATCH /me. (2) The app calls **app.updateUser(updatedUser)** with the response so **app.user** and **auth.onboardingStep** are updated and **AppFlowController** re-renders the correct phase/step. (3) No typos in step names (e.g. "post_brief" must match what the backend and CreatorOnboardingFlowView expect).
- **Talent flow:** Same idea. Talent profile "Continue" must PATCH /me with **onboardingStep: "clips"** (or whatever the next step key is), then app.updateUser so the next screen is add-clips; after clips and earnings teaser, onboardingComplete and Talent home.
- If the backend returns the user with **camelCase** (displayName, onboardingStep, onboardingComplete), the iOS **User** model must decode that. If the backend returns snake_case, the app must use CodingKeys or a decoder that maps it. Fix any mismatch so the app has the correct user and step after every Continue and after sign-in.

**B. Fix Sign in with Apple (and Google if present)**

- **Backend:** The backend **POST /auth/apple** receives idToken and role, verifies the Apple token, then finds or creates the user and returns **{ user, token }**. For **simulator / development**, the iOS app may send a **mock token** (e.g. "mock_..." or a test token). The backend currently uses **apple-signin-auth** to verify the token; that will **fail for a mock token** because it's not a real Apple JWT. You must **allow mock tokens in development** so that: when the token looks like a mock (e.g. starts with "mock_" or when APPLE_CLIENT_ID is not set and the token is a known test value), skip Apple verification and create/return a test user and JWT. That way "Sign in with Apple" or "Sign in with test account" on the simulator can succeed and the app receives { user, token } and can store the token and user and move to onboarding.
- **Production:** When APPLE_CLIENT_ID is set and the token is a real Apple identity token, keep verifying it with apple-signin-auth and reject invalid tokens. Ensure .env has APPLE_CLIENT_ID set for production (your app's Services ID).
- **Google:** If the app has a "Sign in with Google" button but the backend has no Google auth route, either: (1) Add **POST /auth/google** (or similar) that accepts a Google ID token, verifies it, finds/creates user, returns { user, token } in the same shape as Apple, and ensure the app sends the token and stores the session the same way; or (2) Remove or hide the Google button until the backend supports it. Document which you did.
- **iOS:** After a successful auth response, the app must: (1) **Store the token** (HTTPAPIClient.setToken or equivalent) so all subsequent requests send **Authorization: Bearer <token>**. (2) Call **auth.saveSession(userId, role, onboardingStep)** and set **app.user = response.user** so AppFlowController shows the correct onboarding phase. (3) Surface any backend error (e.g. 401, 422) so the user sees "Sign in failed" or the real error message instead of a silent fail.

**C. Supabase – what to run**

- The backend uses **Postgres via DATABASE_URL** (Supabase). On startup it runs **initDb()**, which executes **backend/src/db/schema.postgres.sql**. So if the backend has ever been started with DATABASE_URL pointing at Supabase, the tables should already exist.
- **Document for the product owner:** Create or update a short doc (e.g. **docs/SUPABASE_SETUP.md**) that says: (1) **Either** start the backend once with DATABASE_URL set to the Supabase connection string – the backend will create all tables automatically from **backend/src/db/schema.postgres.sql**. (2) **Or** open Supabase Dashboard → SQL Editor, paste the contents of **backend/src/db/schema.postgres.sql**, and run it once to create tables and indexes. (3) List the table names (users, briefs, submissions, reviews, messages, device_tokens) so they can confirm in Table Editor. (4) State that no other one-off queries or migrations are required for basic auth and app flow.
- If there are any **migrations** or **RLS policies** the team plans to use, add a note and where to find them; otherwise say "none required for current API."

**D. Verification**

- After your changes: (1) Cold start → Role Select → pick Creator → Auth → Sign in with Apple or test account → must land on Creator profile, then Continue → post-brief step, then after posting → Creator home. (2) Same for Talent: profile → Continue → clips → earnings teaser → Talent home. (3) Sign-in must succeed on simulator (mock/test token accepted by backend). (4) Doc exists that says exactly what (if anything) to run in Supabase.

**Deliverables**

- Continue button advances the step and eventually lands the user in Creator or Talent home.
- Sign in with Apple (and test account on simulator) works; backend accepts mock token in dev; Google either implemented or removed/hidden.
- **docs/SUPABASE_SETUP.md** (or equivalent) that states clearly what to run in Supabase and where the schema file is.
- Short list of what was broken and what you changed (backend + iOS + doc).
```

---

Use this in the **Tobi** repo (backend + Cue app). Key files: **backend/src/routes/auth.ts**, **backend/src/services/appleAuth.ts**, **backend/src/db/index.ts**, **backend/src/db/schema.postgres.sql**, **Cue/Cue/AppState.swift**, **Cue/Cue/Services/HTTPAPIClient.swift**, **Cue/Cue/Onboarding/CreatorOnboarding/CreatorProfileView.swift**, **Cue/Cue/Onboarding/TalentOnboarding/TalentProfileView.swift**, **Cue/Cue/AppFlowController.swift**.
