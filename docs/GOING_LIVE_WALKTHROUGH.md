# Going from Mock to Real — Ship readiness walkthrough

This doc walks you through switching the Cue app from `MockAPIClient` to the real backend so you can run and ship with **your own backend** (local or deployed). You have **Supabase** and **Stripe**; the path below uses the **existing Node backend** in `backend/` (local-first) and **Stripe** for payments. The backend uses **Supabase (Postgres)** for the database (see §Supabase).

---

## Quick start (local, 3 steps)

1. **Backend** — In `backend/`, add a `.env` with `DATABASE_URL` (Supabase), `JWT_SECRET`, and `STRIPE_SECRET_KEY`, then run `npm run dev`. API runs at `http://localhost:3000`.
2. **iOS** — The app uses the real API when **CueAPIBaseURL** is set in Info.plist (Cue target build settings). Debug is pre-set to `http://127.0.0.1:3000`; for a device use your Mac IP or ngrok.
3. **Sign in** — With real API enabled, use **Sign in with Apple**; the app will call your backend and store the returned token. (The dev bypass links “Skip to Creator” / “Skip to Talent” only work when using the **Mock** client; with real API you must sign in with Apple.)

After that, the app uses the real backend for auth, briefs, feed, submissions, paywall check, and uploads. The **paywall** uses the Stripe iOS SDK and `clientSecret` from **canViewSubmissions**; on payment success it calls **onUpgrade()** and shows submissions (see §2.5).

---

## Deploy-ready from day one

The project is set up so **going live = config only**: no code changes when you ship.

| Area | Setup |
|------|--------|
| **iOS base URL** | **Debug:** `http://127.0.0.1:3000` (or Mac IP / ngrok). **Release:** `https://api.yourapp.com`. Set via **Info.plist** key `CueAPIBaseURL` in the Cue target build settings (Debug vs Release). |
| **Stripe** | **Backend:** test secret in dev, **live** in production — env only (`STRIPE_SECRET_KEY`). **iOS:** `StripePublishableKey` in Info.plist: test (Debug), live (Release). No code change to ship. |
| **Database** | **Supabase (Postgres)** everywhere. One code path: backend uses **Postgres** only via **`DATABASE_URL`**. No SQLite, no migrate step. |
| **Apple** | Set **APPLE_CLIENT_ID** in the backend from the start (Services ID from Apple Developer). Same for local and production; avoids auth surprises at go-live. |

**Flip to ship:** Deploy backend → set production env vars (`DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY` live, `APPLE_CLIENT_ID`) → set iOS **Release** base URL in Xcode → ship. No code change.

---

## What you need before starting

| Thing | Where / How |
|-------|--------------|
| **Stripe account** | You have it. Need **Secret key** (Dashboard → Developers → API keys). For payouts to talent later: Stripe Connect. |
| **Sign in with Apple** | Already in the app. Backend needs to verify the token: set **APPLE_CLIENT_ID** (your app’s Services ID) if you want strict verification; optional for local dev. |
| **JWT secret** | Any long random string (≥32 chars) for signing session tokens. Generate once and keep it secret. |
| **Base URL** | Local: `http://localhost:3000`. On device/simulator pointing at Mac: `http://<your-mac-ip>:3000` or use a tunnel (e.g. ngrok). For release: your deployed API URL. |

---

## Part 1 — Run the backend locally

The repo includes a full API in **`backend/`** (Node + Express + TypeScript, **Postgres via Supabase**, Stripe).

### 1.1 Install and configure

```bash
cd backend
npm install
```

Create a **`.env`** (or export in the shell):

```env
# Required
DATABASE_URL=postgresql://...   # Supabase: Project Settings → Database → Connection string (URI)
JWT_SECRET=your-min-32-char-secret-here
STRIPE_SECRET_KEY=sk_test_...   # test for dev; sk_live_... in production (env only)

# Optional
PORT=3000
APPLE_CLIENT_ID=com.yourapp.cue   # Services ID from Apple Developer; set from the start for consistent auth
```

- **DATABASE_URL** — Required. Postgres connection string. Use a **Supabase** project (local or hosted): Supabase Dashboard → Project Settings → Database → Connection string (URI). The backend runs the schema in `backend/src/db/schema.postgres.sql` on startup (`initDb()`).
- **JWT_SECRET** — Required. Used to sign the session token returned after Sign in with Apple.
- **STRIPE_SECRET_KEY** — Required for paywall (PaymentIntents). Use **test** key for dev; **live** key in production (set in env only, no code change).
- **APPLE_CLIENT_ID** — Recommended from day one. Backend verifies the Apple identity token against this audience; same for local and production.

### 1.2 Run

```bash
npm run dev
```

You should see: `Cue API listening on port 3000`.  
Data is stored in **Supabase (Postgres)**; uploads go to **`backend/data/uploads/`** (or `UPLOAD_DIR` if set).

### 1.3 (Optional) Test from the command line

```bash
# Health: no auth
curl -s http://localhost:3000/me
# → 401 with body {"error":{"code":"unauthorized",...}}

# After you have a token (from the app), try:
# curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/me
```

---

## Part 2 — Point the iOS app at the real API

### 2.1 Base URL (Debug vs Release)

The app reads the API base URL from **Info.plist** key **`CueAPIBaseURL`** (set in the Cue target’s build settings):

- **Debug** — e.g. `http://127.0.0.1:3000` (simulator) or `http://<your-mac-ip>:3000` / ngrok URL for device.
- **Release** — your deployed API URL (e.g. `https://api.yourapp.com`).

No code change to go live: update the Release value in Xcode when you deploy. **HTTPAPIClient** (via `APIConfig`) uses this URL automatically.

### 2.2 Real API client

**HTTPAPIClient** reads **`CueAPIBaseURL`** from Info.plist (see §2.1). When that key is set, **AppState** uses the real API; otherwise it falls back to **MockAPIClient**. No manual URL or flag in code: set Debug/Release base URL in the Cue target’s build settings.

The real client:

- Implements **`APIClientProtocol`** (same as the mock).
- Uses **`URLSession`** and your **base URL**.
- Sends **`Authorization: Bearer <token>`** on every request after login.
- Stores the **token** in Keychain after **POST /auth/apple** (the backend returns `{ "user", "token" }`).

**AppState** (or your dependency injection) should use this client instead of `MockAPIClient` when “real API” is enabled (e.g. a flag, or always in Release).

### 2.3 Auth flow (real)

1. User picks role and taps Sign in with Apple.
2. App gets the **identity token** from Apple (already in `AuthService.signInWithApple`).
3. App calls **POST /auth/apple** with `{ "idToken": "<token>", "role": "creator" | "talent" }`.
4. Backend returns **`{ "user": User, "token": "<JWT>" }`**.
5. App stores **token** in Keychain (new key, e.g. `com.cue.sessionToken`) and **user.id / role / onboardingStep** as today (or derived from `user`).
6. All other requests use **`Authorization: Bearer <stored token>`**.

So: **AuthService** (or the caller) must persist the **token** when using the real API; the real client reads it and attaches it to requests.

### 2.4 Differences from the mock

| Area | Mock | Real |
|------|------|------|
| **Auth response** | Just `User` | `{ "user", "token" }` — store token and send as Bearer. |
| **Brief feed** | `[Brief]` | API returns `{ "briefs", "nextCursor" }` — client uses `briefs` (and can add “load more” with `nextCursor` later). |
| **canViewSubmissions** | `Bool` | API returns `{ "canViewSubmissions", "clientSecret"? }`. Use a result type so the app can pass **clientSecret** to the Paywall and run Stripe when the user pays. |
| **Video upload** | `uploadSubmission(briefId:videoURL:)` with a local URL | Real flow: 1) **Claim** brief → get `Submission`. 2) **POST /submissions/:id/upload** with **multipart** (video file). 3) Use returned `Submission` (with `videoURL` set). So the client uploads the file in the request body to the backend. |
| **Errors** | `APIError.unauthorized` / `.notFound` | Map HTTP status and body `{ "error": { "code", "message" } }` to the same (or extended) `APIError` so UI stays the same. |

Implementing these in **HTTPAPIClient** and the minimal UI changes (paywall + upload) is what makes the app “real”.

### 2.5 Paywall + Stripe (real)

The app implements the full paywall flow:

1. **CreatorBriefDetailView** calls **canViewSubmissions**; if the backend returns **canViewSubmissions: false** and a **clientSecret**, it shows **PaywallView** with that **clientSecret**.
2. When the user taps “View submissions” in the paywall, the app presents **Stripe PaymentSheet** (Stripe iOS SDK) with the **clientSecret**.
3. On payment success, the app calls **onUpgrade()**, which dismisses the paywall and navigates to submissions (backend will then return **canViewSubmissions: true**).

**Setup:** Stripe iOS SDK is added via SPM (`https://github.com/stripe/stripe-ios`). Set the **Stripe publishable key** in the Cue target’s Info.plist build settings: **`StripePublishableKey`** — use test key for Debug, live key for Release (no code change to ship).

---

## Part 3 — Deploying the backend (when you’re ready to ship)

You can keep running the backend on your own machine for dev and only deploy for production.

- **Option A — VPS / single server**  
  Run Node on a Linux server (e.g. Ubuntu), use **PM2** or **systemd**, put **Nginx** (or Caddy) in front for HTTPS, point your domain at it. Set **JWT_SECRET**, **STRIPE_SECRET_KEY**, and **APPLE_CLIENT_ID** in the environment. Use **STRIPE_SECRET_KEY=sk_live_...** for live payments.

- **Option B — Railway / Render / Fly.io**  
  Deploy the **`backend/`** folder as a Node app. Set **DATABASE_URL** (Supabase connection string), **JWT_SECRET**, **STRIPE_SECRET_KEY** (live), and **APPLE_CLIENT_ID** in the dashboard.

Then in the iOS app, set the **base URL** to your deployed API (e.g. `https://api.yourapp.com`) for Release builds.

---

## Part 4 — Checklist before you ship

- [ ] Backend runs (locally or deployed) with **DATABASE_URL**, **JWT_SECRET**, and **STRIPE_SECRET_KEY** (and **APPLE_CLIENT_ID** recommended).
- [ ] iOS: **CueAPIBaseURL** set per build (Debug = dev API, Release = production API); **StripePublishableKey** set (test for Debug, live for Release).
- [ ] After Sign in with Apple, app stores the **token** and sends **Bearer** on all requests.
- [ ] **Brief feed** uses the first page of **briefs** from the API (and optionally “load more” with **nextCursor**).
- [ ] **Paywall**: app gets **clientSecret** from **canViewSubmissions** and confirms payment with Stripe SDK, then shows submissions.
- [ ] **Video upload**: after claim, app uploads the video file to **POST /submissions/:id/upload** (multipart) and uses the returned submission.
- [ ] **Errors**: map API error envelope to **APIError** (or your type) so the UI can show a message.
- [ ] **Release**: Stripe live key, production base URL, and (recommended) **APPLE_CLIENT_ID** set on the backend.

---

## Supabase (Postgres)

The backend uses **Supabase (Postgres)** only: one code path, no SQLite. Set **DATABASE_URL** to your Supabase project’s connection string (Project Settings → Database → URI). The schema in **`backend/src/db/schema.postgres.sql`** is applied on startup. For local dev you can use a hosted Supabase project or run Supabase locally; for production use your production Supabase project. Auth remains **Sign in with Apple** and the backend’s JWT (no Supabase Auth required).

---

## Summary

1. **Run the backend** in `backend/` with **DATABASE_URL** (Supabase), **JWT_SECRET**, **STRIPE_SECRET_KEY**, and **APPLE_CLIENT_ID**.
2. **iOS**: Base URL and Stripe key come from Info.plist (Debug/Release); real **HTTPAPIClient** is used when **CueAPIBaseURL** is set. Paywall uses **Stripe iOS SDK** and **clientSecret** from **canViewSubmissions**, then **onUpgrade()** and submissions.
3. **Ship**: Deploy backend, set production env vars, set Release **CueAPIBaseURL** and **StripePublishableKey** in Xcode — no code change.

If you want, the next step can be: **concrete code** for the real APIClient (and optional PaywallView + Stripe hook) in the Cue app, plus where to set the base URL and switch from Mock to Real.
