# Deploy Cue backend to Vercel

Deploy the backend so you don’t run it on your Mac. The app can use the Vercel URL as the API base.

## 1. Deploy from the backend folder

1. Go to [vercel.com](https://vercel.com) and sign in.
2. **Add New** → **Project**.
3. **Import** your repo (or upload the `backend` folder).  
   - If the repo root is the whole project (e.g. Tobi), set **Root Directory** to `backend` so Vercel builds and runs from that folder.
4. **Build and Output**: leave defaults. `vercel.json` already sets `buildCommand: "npm run build"` and rewrites all routes to `/api`.

## 2. Environment variables

In the project → **Settings** → **Environment Variables**, add the same vars you have in `backend/.env` (for **Production**, and optionally Preview):

| Name | Value | Notes |
|------|--------|--------|
| `DATABASE_URL` | `postgresql://...` | Supabase connection string (Project Settings → Database) |
| `JWT_SECRET` | your secret | Same as local, ≥32 chars |
| `SUPABASE_JWT_SECRET` | Legacy JWT Secret | Supabase → Settings → API → JWT Keys → Legacy JWT secret (for HS256 tokens) |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Required if Supabase uses **JWT Signing Keys** (RS256/ES256). Backend fetches JWKS from `SUPABASE_URL/auth/v1/.well-known/jwks.json` to verify tokens. |
| `STRIPE_SECRET_KEY` | `sk_test_...` or live | For payments |
| `UPLOAD_DIR` | `/tmp/uploads` | Required on Vercel (only writable dir) |
| `UPLOAD_BASE_URL` | `https://your-project.vercel.app/uploads` | Replace with your real Vercel URL so clip/submission URLs work |

**Important:** On Vercel, `/tmp` is ephemeral. Uploaded files can be lost between invocations. For production, plan to store uploads in **Supabase Storage** or S3 and return those URLs instead.

## 3. Disable Deployment Protection (so the app can reach the API)

If your project has **Deployment Protection** enabled, Vercel returns 401 "Authentication Required" (HTML) *before* the request reaches the backend. The iOS app sends a Supabase Bearer token; the backend validates it — but Vercel never lets the request through.

**Fix:** In Vercel → **Project** → **Settings** → **Deployment Protection**, set protection to **None** (or use **Deployment Protection Exceptions** to allow your preview/production domain). Then redeploy if needed. After that, `POST /briefs` and other API routes are reached and your backend auth (Supabase JWT) applies.

## 4. Deploy

Click **Deploy**. When it’s done, your API is at `https://your-project.vercel.app`.

Test:

```bash
curl https://your-project.vercel.app/
# → {"ok":true,"message":"Cue API"}
```

## 5. Point the app at Vercel

- **Debug/development:** In Xcode, set **CueAPIBaseURL** (or use the Debug API URL injection) to `https://your-project.vercel.app` so the Simulator/device hits Vercel instead of your Mac.
- **Release:** Set **CueAPIBaseURL** in the Release build configuration to `https://your-project.vercel.app` (or your production domain if you add a custom domain in Vercel).

After that you don’t need to run `npm run dev` on your Mac for the app to talk to the API.

---

## If you see build “hazards” (warnings)

Vercel may show several orange warnings. They’re usually safe to ignore if the build still succeeds, but you can clean them up:

1. **“Failed to fetch one or more git submodules”**  
   The repo has a nested `Cue/.git` (the iOS app is its own git repo). Vercel still clones the rest of the repo; the backend build doesn’t need Cue.  
   - **Option A:** In Vercel → **Project** → **Settings** → **Git**, turn **off** “Include Git Submodules” (or equivalent) if you see it.  
   - **Option B:** If you’re fine with Cue being just a folder in this repo (no separate git history for Cue), remove the nested repo:  
     `rm -rf /Users/miapucci/Tobi/Cue/.git`  
     then commit and push. After that, this warning should go away.

2. **“Detected engines: { \"node\": \">=20\" }”**  
   Vercel is just noting your Node requirement. To make it use Node 20 and clear the warning:  
   - **Project** → **Settings** → **General** → **Node.js Version** → choose **20.x** and save.

3. **Other warnings**  
   If the deployment finishes and the API responds (e.g. `curl https://your-project.vercel.app/` returns `{"ok":true,...}`), you can ignore the rest. Fix them later if you want a clean build log.
