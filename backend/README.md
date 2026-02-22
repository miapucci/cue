# Cue API

Backend for the Cue iOS app: auth (Sign in with Apple), briefs, submissions, video upload, Stripe pay-in/escrow/release, earnings, reviews, messages, push device tokens.

## Stack

- **Node 20+**, **Express**, **TypeScript**
- **SQLite** (better-sqlite3) for persistence
- **Stripe** for PaymentIntents (creator pay-in) and Connect (talent payout)
- **apple-signin-auth** for Apple identity token verification
- **multer** for multipart video upload

## Setup

```bash
npm install
cp .env.example .env   # if present; otherwise set env vars
npm run build
```

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes | Min 32 chars; used to sign session JWTs |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `APPLE_CLIENT_ID` | For Apple auth | Your app’s Apple Services ID (optional for dev) |
| `PORT` | No | Default 3000 |
| `SQLITE_PATH` | No | Default `data/cue.db` |
| `UPLOAD_DIR` | No | Default `data/uploads` |
| `UPLOAD_BASE_URL` | No | Base URL for video links, default `http://localhost:3000/uploads` |

## Run

```bash
npm run dev    # tsx watch
# or
npm run build && npm start
```

## API

See **docs/BACKEND_API_SPEC.md** for all endpoints, request/response shapes, and error format.  
See **docs/BACKEND_STRIPE_FLOWS.md** for when PaymentIntents are created, escrow, and release to talent.

## Video upload

Current flow: **multipart upload** to `POST /submissions/:id/upload`. The client (e.g. iOS) uploads the file in the request body; the server stores it and sets `submission.videoURL`. No presigned URL step. For production you can replace the local storage in `src/services/storage.ts` with S3 (and optionally add a presigned-URL flow and document it in the API spec).

## Sample clips (talent)

Talent’s 3 sample clip URLs are stored via **PATCH /me** with `sampleClipURLs: string[]` (max 3). The iOS app can add a corresponding `APIClient` method when ready.
