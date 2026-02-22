# Prompt: Fix Talent Clips + Ensure Backend Persists to Database (Supabase)

**Send this to your developer agent.**

---

## Message from the product owner

- **Clips still don’t work** – the talent “add 3 clips” onboarding step must work end-to-end: pick videos, upload them, store URLs, and send them to the backend so they’re saved on the user.
- **I’m worried nothing is storing in the database** – we need a **fully functioning backend** that actually persists to Supabase so we can ship. Every create/update (users, briefs, submissions, etc.) must hit the database.
- **If anything needs to run in Supabase, I can do it** – tell me exactly what to run (e.g. schema, migrations, one-off SQL) and where (file path or paste-ready SQL). I will run it in the Supabase SQL Editor or via the backend.

---

## What you need to do

### 1. Fix the talent 3-clips flow end-to-end

**Current state:**  
- TalentAddClipsView shows 3 slots and uses ClipPickerView. On “pick” it only sets a placeholder (`"picked"`), not a real URL.  
- completeClips() only calls updateMe with onboardingStep; it **never sends the clip URLs** to the backend.  
- The API’s updateMe doesn’t accept sampleClipURLs on iOS; the backend PATCH /me does support sampleClipURLs.

**Required behavior:**

1. **Backend – sample clip upload**  
   Add an endpoint so the app can upload one sample clip and get back a URL, e.g.:
   - **POST /me/sample-clips** (or **POST /me/sample-clip**)  
   - Auth: required (Bearer).  
   - Body: multipart with one file (e.g. field name `clip` or `video`).  
   - Backend: save the file (reuse your existing storage helper or the same pattern as submission videos), build the public URL (e.g. UPLOAD_BASE_URL + filename), return JSON e.g. `{ "url": "https://..." }`.  
   - The app will call this once per clip (3 times) and collect 3 URLs.

2. **iOS – API**  
   - Add **sampleClipURLs** to updateMe: e.g. `updateMe(displayName:bio:socialLink:onboardingStep:sampleClipURLs:)` with `sampleClipURLs: [String]?`.  
   - Implement it in HTTPAPIClient (PATCH /me with body that includes sampleClipURLs when present) and in MockAPIClient.  
   - Add **uploadSampleClip(videoURL: URL) async throws -> String** (or similar) that POSTs the file to the new backend endpoint and returns the URL from the response.

3. **iOS – ClipPickerView**  
   - It must return the **selected video’s file URL** (or equivalent) so the app can upload it.  
   - Same pattern as VideoPickerView: use PHPicker, loadFileRepresentation for the chosen item, copy to a temp file if needed, then call a completion with that file URL (or with the URL string after a successful upload).  
   - So either: **onPicked(URL?)** and the caller uploads, or ClipPickerView triggers an upload and calls **onPicked(urlString: String?)**. Prefer giving the caller the file URL and having TalentAddClipsView call the upload API so progress/errors can be shown there.

4. **iOS – TalentAddClipsView**  
   - Each slot: when the user picks a video, get the file URL from the picker, call the backend **upload sample clip** endpoint, get back the URL, and store **that URL string** in clipURLs (e.g. clipURLs[index] = urlString).  
   - Show “Clip N added” (or a thumbnail) when a URL is stored; allow replacing by tapping the slot again.  
   - **Done:** when all 3 slots have URLs, call **updateMe** with **sampleClipURLs: [url1, url2, url3]** (in order) and **onboardingStep: "earnings_teaser"**. Then update app.user from the response so the flow advances to the earnings teaser step.  
   - Handle errors (upload failed, PATCH failed) and show a clear message; don’t leave the user stuck.

**Definition of done for clips:**  
Talent can open each of the 3 slots, pick a video from the library (or camera if you add it), each clip uploads to the backend and a URL is stored, and on Done the 3 URLs are saved to the user via PATCH /me and the user moves to the next onboarding step. Data is persisted in the database (see below).

---

### 2. Ensure the backend actually persists to the database (Supabase)

**Requirement:**  
Every mutation (auth, users, briefs, submissions, reviews, messages, device tokens, and sample clip URLs) must **write to Postgres (Supabase)**. No in-memory-only state for production.

**Checklist:**

- **DATABASE_URL** in backend `.env` must point at your Supabase Postgres connection string (transaction pooler or direct, as appropriate).  
- **Schema:** On backend startup, initDb() runs **backend/src/db/schema.postgres.sql**. Confirm that when the server starts, it connects to Supabase and runs that script (or that the schema was applied manually – see below).  
- **Auth:** POST /auth/apple creates/updates a user via insertUser/findUserByAppleSub and returns user + token. Confirm the user row exists in the **users** table after sign-in.  
- **PATCH /me:** Updates (display_name, bio, social_link, onboarding_step, sample_clip_urls, etc.) must run UPDATE against the **users** table. Verify in Supabase Table Editor after updating profile or completing clips.  
- **Briefs, submissions, etc.:** Create/update/claim flows must perform the corresponding INSERT/UPDATE in **briefs**, **submissions**, and any other tables.  
- **Errors:** If a write fails (e.g. constraint, connection), return a proper HTTP error and do not claim success. Log errors so we can debug.

**If the schema has never been applied to Supabase:**

- Either start the backend once with DATABASE_URL set so initDb() runs, or  
- The product owner will run the schema manually. Tell them:  
  - “Open **Supabase Dashboard → SQL Editor**, paste the full contents of **backend/src/db/schema.postgres.sql**, and run it once. That creates tables and indexes. Then confirm in Table Editor that **users**, **briefs**, **submissions**, **reviews**, **messages**, **device_tokens** exist.”

---

### 3. Tell the product owner exactly what to run in Supabase (if anything)

- If **nothing** is needed (backend applies schema on startup and DB is already set up): say so clearly.  
- If **something** is needed (e.g. first-time setup, or a migration you add):  
  - Give the **exact file path** (e.g. `backend/src/db/schema.postgres.sql`) or paste-ready SQL.  
  - Say: “Run this in Supabase Dashboard → SQL Editor → Run.”  
  - Example: “If you haven’t already, run the schema: open **backend/src/db/schema.postgres.sql** in the repo, copy all of it, paste into Supabase SQL Editor, click Run. The product owner has said they can run any Supabase commands needed.”

Do not assume the database is already set up; either verify it or document the one-time steps for the product owner.

---

### 4. Deliverables

- Talent 3-clips flow: picker returns a file URL, each clip is uploaded to the new backend endpoint, 3 URLs are sent via PATCH /me sampleClipURLs, and onboarding advances.  
- Backend: new endpoint for uploading one sample clip; all existing and new writes go to Postgres (Supabase).  
- iOS: updateMe includes sampleClipURLs; new upload method for sample clips; TalentAddClipsView wired to real URLs and updateMe.  
- A short note for the product owner: “What to run in Supabase (if anything)” with file path or SQL and where to run it.  
- Optional: a one-line verification step (e.g. “After signing in and completing clips, check Supabase Table Editor → users: you should see your user and sample_clip_urls populated”).

---

## Files to touch (for reference)

- **Backend:** `backend/src/routes/me.ts` (PATCH already has sampleClipURLs; add POST for upload if you use a separate route), `backend/src/services/storage.ts` (or new helper for sample clips), `backend/src/db/index.ts` (updateUser already has sample_clip_urls), `backend/src/db/schema.postgres.sql` (already has users.sample_clip_urls).  
- **iOS:** `Cue/Cue/Services/APIClient.swift` (protocol + mock), `Cue/Cue/Services/HTTPAPIClient.swift` (updateMe + uploadSampleClip), `Cue/Cue/Shared/ClipPickerView.swift` (return file URL), `Cue/Cue/Onboarding/TalentOnboarding/TalentAddClipsView.swift` (store URLs, upload per clip, send sampleClipURLs in completeClips).
