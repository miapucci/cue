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
| `SUPABASE_JWT_SECRET` | JWT Secret | Supabase → Settings → API → JWT Secret |
| `STRIPE_SECRET_KEY` | `sk_test_...` or live | For payments |
| `UPLOAD_DIR` | `/tmp/uploads` | Required on Vercel (only writable dir) |
| `UPLOAD_BASE_URL` | `https://your-project.vercel.app/uploads` | Replace with your real Vercel URL so clip/submission URLs work |

**Important:** On Vercel, `/tmp` is ephemeral. Uploaded files can be lost between invocations. For production, plan to store uploads in **Supabase Storage** or S3 and return those URLs instead.

## 3. Deploy

Click **Deploy**. When it’s done, your API is at `https://your-project.vercel.app`.

Test:

```bash
curl https://your-project.vercel.app/
# → {"ok":true,"message":"Cue API"}
```

## 4. Point the app at Vercel

- **Debug/development:** In Xcode, set **CueAPIBaseURL** (or use the Debug API URL injection) to `https://your-project.vercel.app` so the Simulator/device hits Vercel instead of your Mac.
- **Release:** Set **CueAPIBaseURL** in the Release build configuration to `https://your-project.vercel.app` (or your production domain if you add a custom domain in Vercel).

After that you don’t need to run `npm run dev` on your Mac for the app to talk to the API.
