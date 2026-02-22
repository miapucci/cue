# Cue Backend API Spec

Canonical reference for the Cue API. Implemented by the Node/Express backend in `backend/`. The iOS app uses this via `APIClient`; request/response shapes match the Swift `Codable` types in `Cue/Cue/Models/`.

**Base URL:** `http://localhost:3000` (or `BASE_URL` env).  
**Auth:** After `POST /auth/apple`, send `Authorization: Bearer <token>` on all other requests.

---

## Error format

All errors use this envelope and HTTP status:

```json
{
  "error": {
    "code": "unauthorized" | "not_found" | "validation" | "forbidden" | "conflict" | "server",
    "message": "Human-readable message"
  }
}
```

| Code        | HTTP  | When |
|------------|-------|------|
| unauthorized | 401 | Missing/invalid Bearer token |
| forbidden    | 403 | Valid auth but not allowed (e.g. not creator of brief) |
| not_found    | 404 | Resource doesn't exist |
| validation   | 422 | Invalid body/params |
| conflict     | 409 | e.g. already claimed brief |
| server       | 500 | Internal error |

---

## Auth

### POST /auth/apple

Sign in with Apple. Body must match `AuthAppleRequest`; creates or links user, returns user + JWT.

**Request:** `{ "idToken": "<Apple identity token>", "role": "creator" | "talent" }`  
**Response:** `200` — `{ "user": User, "token": "<JWT>" }`  
**Errors:** `422` if idToken/role missing or role invalid.

---

## Me (profile + device token)

All require `Authorization: Bearer <token>`.

### GET /me

Current user (profile, role, onboardingStep).

**Response:** `200` — `User` (id, displayName, bio, socialLink, role, onboardingComplete, onboardingStep).

### PATCH /me

Update profile and/or sample clips.

**Request body (all optional):**  
`{ "displayName"?, "bio"?, "socialLink"?, "onboardingStep"?, "sampleClipURLs"?: string[] }`  
- `sampleClipURLs`: array of **up to 3** URLs (talent verified portfolio). Stored as-is; iOS can add an APIClient method later.

**Response:** `200` — updated `User`.

**Errors:** `422` if `sampleClipURLs` length > 3.

### POST /me/device-token

Register device for push notifications.

**Request:** `{ "token": "<APNs device token>", "platform": "ios" | "android" }`  
**Response:** `204`  
**Errors:** `422` if token missing or platform invalid.

---

## Briefs

All require auth.

### POST /briefs

Create a brief (creator). Backend sets `isFirstFree` for creator’s first live brief; no charge for that one.

**Request:** `CreateBriefRequest` — title, description, payRateCents, deadline (ISO 8601), format (orientation, durationSeconds), referenceVideoURL (optional).  
**Response:** `201` — `Brief`.

### GET /briefs/mine

Creator’s briefs.  
**Response:** `200` — `Brief[]`.

### GET /briefs/feed

Talent feed; **paginated**.

**Query:** `limit` (default 20, max 50), `cursor` (optional, from previous response).  
**Response:** `200` — `{ "briefs": Brief[], "nextCursor": string | null }`.  
Use `nextCursor` in the next request as `?cursor=...` for “load more”.

### GET /briefs/:id

Brief detail.  
**Response:** `200` — `Brief` (includes submissionCount).  
**Errors:** `404` if not found.

### GET /briefs/:id/submissions

List submissions for a brief (creator only). Creator must be allowed to view (see paywall / canViewSubmissions).  
**Response:** `200` — `Submission[]`.  
**Errors:** `403` if not the brief creator.

### POST /briefs/:id/claim

Talent claims a brief; creates a submission slot.  
**Response:** `201` — `Submission` (videoURL may be empty until upload).  
**Errors:** `404` brief not found, `422` brief not live or already claimed.

### GET /briefs/:id/can-view-submissions

Paywall: can the creator view submissions for this brief?

**Response:** `200` — `{ "canViewSubmissions": boolean, "clientSecret"?: string }`.  
- If first brief free or already paid: `canViewSubmissions: true`.  
- If payment needed: `canViewSubmissions: false` and `clientSecret` for Stripe SDK; after successful payment, call again to get `true`.

See **BACKEND_STRIPE_FLOWS.md** for when PaymentIntent is created and when charges happen.

---

## Submissions (upload + status)

All require auth.

### POST /submissions/:id/upload

Upload video for a claimed submission (talent). **Multipart:** one file under field name `video`. Max 100MB.

**Response:** `200` — `Submission` with `videoURL` set to the stored file URL (e.g. `BASE_URL/uploads/...`).  
**Errors:** `404` submission not found, `403` not the submission’s talent, `422` no file.

**Video upload flow (current):** Client uploads the file in the request body to this endpoint; server stores (e.g. local `data/uploads/` or S3) and sets `submission.videoURL`. No presigned URL step. iOS can implement `uploadSubmission(briefId:videoURL:)` by: 1) having already claimed (so submission id exists), 2) POST multipart to `/submissions/:id/upload` with the local file, 3) using the returned submission.

### PATCH /submissions/:id

Creator: approve / request revision / reject.

**Request:** `{ "status": "approved" | "revisionRequested" | "rejected", "revisionNotes"?: string }`  
**Response:** `200` — updated `Submission`.  
On `approved`, backend releases payment to talent (see BACKEND_STRIPE_FLOWS.md).  
**Errors:** `404`, `403` not the brief creator.

---

## Earnings (talent)

Requires auth and role **talent**.

### GET /earnings

**Response:** `200` — `{ "pendingCents": number, "releasedCents": number, "currency": "USD" }`.  
- Pending: sum of pay for submissions in `pendingReview` or `revisionRequested`.  
- Released: sum for `approved` submissions.

---

## Reviews

### POST /reviews

Mutual review after a completed (approved) submission.

**Request:** `{ "submissionId": string, "rating": number (1–5), "comment"?: string }`  
**Response:** `201` — `Review` (id, submissionId, fromUserId, toUserId, rating, comment, createdAt).  
**Errors:** `404` submission not found, `422` not approved or rating out of range.

---

## Messages (revision notes)

### GET /messages/thread/:submissionId

Thread for one submission (creator + talent).  
**Response:** `200` — `Message[]`.  
**Errors:** `403` if not part of the thread.

### POST /messages

Send a message (revision note).

**Request:** `{ "submissionId": string, "body": string }`  
**Response:** `201` — `Message`.  
**Errors:** `403`, `422` if body empty.

---

## Summary table

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | /auth/apple | — | Sign in with Apple; returns user + token |
| GET | /me | Bearer | Current user |
| PATCH | /me | Bearer | Update profile / sampleClipURLs |
| POST | /me/device-token | Bearer | Register push device token |
| POST | /briefs | Bearer | Create brief |
| GET | /briefs/mine | Bearer | Creator’s briefs |
| GET | /briefs/feed | Bearer | Talent feed (paginated) |
| GET | /briefs/:id | Bearer | Brief detail |
| GET | /briefs/:id/submissions | Bearer | List submissions (creator) |
| POST | /briefs/:id/claim | Bearer | Talent claim brief |
| GET | /briefs/:id/can-view-submissions | Bearer | Paywall check + optional clientSecret |
| POST | /submissions/:id/upload | Bearer | Upload video (multipart) |
| PATCH | /submissions/:id | Bearer | Approve / revision / reject |
| GET | /earnings | Bearer (talent) | Pending + released cents |
| POST | /reviews | Bearer | Post review |
| GET | /messages/thread/:submissionId | Bearer | Get thread |
| POST | /messages | Bearer | Send message |

Static: `GET /uploads/*` serves stored submission videos (e.g. after upload).
