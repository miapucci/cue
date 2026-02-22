# Cue — Onboarding Flows

Screen-by-screen flows for Creator and Talent. Built for endowment, loss aversion, and getting talent to “first booking” fast. **One primary action per screen** (8-second rule).

---

## Flow overview

```
[App open] → [Role choice: Creator | Talent] → [Auth] → [Role-specific onboarding] → [Home]
```

- **Creator:** Auth → Profile (name, bio, social) → Post first brief (free) → Brief live → See submission count → Paywall when opening submissions.
- **Talent:** Auth → Profile (name, bio) → Add 3 sample clips (mandatory) → Earnings calculator + “Your first briefs” → Brief feed.

**Persistence:** If user closes app mid-onboarding, resume at last incomplete step (store `onboardingStep` and `role`).

---

## Entry & role choice

### Screen: Welcome / Role select

**Purpose:** Choose Creator or Talent. No sign-in yet — reduce friction.

**Layout:**
- App logo/wordmark (dark bg).
- Short line: “Your cue to create.”
- Two large tappable cards (or buttons):
  - **“I need video”** → Creator path. Subline: “Find talent. Get the video.”
  - **“I want to get cast”** → Talent path. Subline: “Get paid to be on camera.”
- No “Learn more” as primary — one clear choice.

**Copy:**
- Headline: “Your cue to create.”
- Creator card: “I need video” / “Find talent. Get the video.”
- Talent card: “I want to get cast” / “Get paid to be on camera.”

**Psychology:** Autonomy framing for talent (“get paid to be on camera”), outcome for creators (“get the video”).

**Next:** Tap Creator → Auth; Tap Talent → Auth.

---

## Auth (shared)

### Screen: Sign in / Sign up

**Purpose:** Account creation or sign-in. Minimum: Sign in with Apple. Optional: email (or phone) for MVP.

**Layout:**
- “Get started” or “Welcome back” (if returning).
- Sign in with Apple (primary button).
- Optional: “Continue with email” (secondary).
- Links: Terms, Privacy. No long form above the fold.

**Validation:** Apple returns identity; email flow: validate format, send magic link or OTP per backend.

**After auth:** Fetch or create user; read `role` from role choice; go to role-specific onboarding step 1.

**State:** Store `userId`, `role` (creator | talent), `onboardingStep` (e.g. profile, brief, clips, etc.).

---

## Creator onboarding

**Sequence:** Auth → Profile → Post first brief (free) → [Brief goes live] → Home (see brief + submission count). Paywall only when they tap “View submissions.”

---

### Screen: Creator — Profile

**Purpose:** Name, bio, one social link. Build credibility for talent.

**Fields:**
- **Display name** (required). Placeholder: “How creators see you.”
- **Bio** (required, max e.g. 160 chars). Placeholder: “Channel, niche, or what you make.”
- **Social link** (optional). Placeholder: “Instagram, TikTok, or YouTube URL.”

**Copy:**
- Title: “Introduce yourself.”
- Subtitle: “Talent will see this when you post a brief.”

**Validation:**
- Name: non-empty, trimmed.
- Bio: non-empty, max length.
- Social: if present, valid URL.

**Primary CTA:** “Continue” (enabled when name + bio valid).

**Next:** → Post first brief (same session; no “skip”).

**Psychology:** Fast path to first brief so they invest (endowment) before any paywall.

---

### Screen: Creator — Post your first brief (free)

**Purpose:** First brief is free. Full brief form; no paywall here.

**Fields (per MVP_FEATURES):**
- **Title** (required). Placeholder: “e.g. 30-sec unboxing for my channel.”
- **Description** (required). Placeholder: “What you need, tone, key points.”
- **Pay rate** (required). Currency + amount. Clear label: “You’ll pay this when you approve the video.”
- **Deadline** (required). Date/time picker. “When do you need the video by?”
- **Format:** Vertical / Horizontal (required). Length in seconds (required).
- **Reference video** (optional). Upload or pick from library.

**Copy:**
- Title: “Post your first brief.”
- Subtitle: “This one’s on us. No charge to post.”
- CTA: “Post brief” (primary).

**Validation:** All required fields; pay rate > 0; deadline in future; length > 0.

**On submit:** Create brief in backend (status: live); deduct 0 (first brief free). Show success → navigate to Creator home with this brief visible and “0 submissions” (or “Waiting for submissions”).

**Psychology:** Endowment — they’ve written the brief and “own” it. Paywall only when they have something to lose (submissions waiting).

**Next:** Creator Home (brief card + “View submissions” when count > 0; tapping that can hit paywall with loss framing).

---

### Creator — First-time home (after onboarding)

**Purpose:** Show the live brief and set expectation.

**Copy:** “Your brief is live. Talent will submit videos. We’ll notify you when someone does.”
**Primary action:** One brief card; tap → brief detail. When submissions > 0: “You have X submissions waiting. Tap to view.” → That tap is where paywall can show (loss aversion: “You have X talent submissions waiting. Upgrade to view them.”).

---

## Talent onboarding

**Sequence:** Auth → Profile → Add 3 sample clips (mandatory) → Earnings calculator + “Your first briefs” → Brief feed (home).

---

### Screen: Talent — Profile

**Purpose:** Name and bio. Same as creator but with talent-focused copy.

**Fields:**
- **Display name** (required).
- **Bio** (required, max 160). Placeholder: “What you create, vibe, or experience.”

**Copy:**
- Title: “Introduce yourself.”
- Subtitle: “Creators see this when you claim a brief.”

**Primary CTA:** “Continue.”

**Next:** Add sample clips (mandatory; cannot skip).

---

### Screen: Talent — Add 3 sample clips

**Purpose:** Mandatory video portfolio (trust). Three uploads before they can see/claim briefs.

**Layout:**
- Title: “Show your best.”
- Subtitle: “Upload 3 short clips. Creators watch these before they pick you.”
- Three slots: “Clip 1”, “Clip 2”, “Clip 3”. Each: thumbnail + “Add video” (camera roll or in-app record). Optional: max duration per clip (e.g. 30s).
- Progress: “1 of 3”, “2 of 3”, “3 of 3” or checkmarks.

**Validation:** All 3 slots have a video file (uploaded or recorded). File type/size per backend.

**Primary CTA:** “Done” (enabled when 3 clips set).

**Psychology:** Trust (video reel > stars). Zeigarnik — completion bar can show “Profile 100%” on profile later.

**Next:** → Earnings calculator + “Your first briefs” (motivation + guaranteed-feel).

---

### Screen: Talent — Earnings calculator + first briefs teaser

**Purpose:** Set expectation (“Talent who do X earn ~$Y”) and show that first briefs are matched to them (guaranteed-feel). Beat stage-2 churn.

**Layout:**
- Short line: “Talent who complete 4 briefs a month earn ~$240 on average.” (Use placeholder or configurable number.)
- “We’ve picked a few briefs that match your profile. Swipe to see them.”
- Single primary CTA: “See my briefs” → Brief feed.

**Optional:** Show 1–3 brief cards (blurred or summary) that “match” them so it feels personalized. Backend can return “for you” briefs by category/vibe if available; else show first N briefs.

**Psychology:** Earnings calculator (product spec); first briefs that match (reduce “how do I get booked?”).

**Next:** → Brief feed (Talent home). New users can be shown 2 “reduced rate” slots first (cold start) per product spec — backend drives which briefs are reduced-rate.

---

## Post-onboarding: when to show what

| User type  | After onboarding, home is… |
|------------|-----------------------------|
| Creator    | List of their briefs (draft + live). First brief free; next briefs hit paywall at “Post brief” or after free brief. |
| Talent     | Brief feed (swipeable cards). “Your first briefs” or “For you” at top if we have matches. |

**Resume logic:** If `onboardingStep` is set and not “complete,” open app to that step (e.g. “Add clip 2 of 3”), not home.

---

## Copy summary (for implementation)

| Screen              | Title / Headline           | Primary CTA     | Subtitle / note |
|---------------------|----------------------------|-----------------|------------------|
| Role select         | Your cue to create.        | I need video / I want to get cast | Find talent. Get the video. / Get paid to be on camera. |
| Auth                | Get started                | Sign in with Apple | — |
| Creator profile     | Introduce yourself.        | Continue        | Talent will see this when you post a brief. |
| Creator first brief | Post your first brief.     | Post brief      | This one’s on us. No charge to post. |
| Talent profile      | Introduce yourself.        | Continue        | Creators see this when you claim a brief. |
| Talent 3 clips      | Show your best.            | Done            | Upload 3 short clips. Creators watch these before they pick you. |
| Talent calculator   | (Earnings line + teaser)   | See my briefs   | We’ve picked briefs that match your profile. |

---

## Paywall (Creator) — when and how

**When:** Creator taps “View submissions” (or equivalent) and has at least one submission and has not yet upgraded.

**Copy (loss aversion):**
- “You have [N] talent submissions waiting.”
- “Upgrade to view them and pick your video.”
- Primary CTA: “View submissions” (opens paywall / subscription) or “Upgrade to view.”

**Do not:** “Upgrade to contact talent.” Do: “You have X submissions waiting. Upgrade to view them.”

---

## Edge cases

- **Creator skips social link:** Allowed. Optional field.
- **Talent tries to skip clips:** No skip. “Add 3 clips to unlock briefs.”
- **Creator already has account, logs in:** If profile complete and they have at least one brief, go to Creator home. Else resume at profile or post brief.
- **Talent already has account:** If 3 clips uploaded, go to Brief feed. Else resume at profile or “Add clips.”
- **Role switch:** MVP: one role per account. No in-app switch; if needed later, treat as Phase 2.

---

## Reference

- **Product psychology:** `docs/PRODUCT_SPEC.md` (endowment, loss aversion, trust, talent retention).
- **Design rules:** `docs/DESIGN_SYSTEM.md` (one primary action, dark default, reserved accents).
- **MVP scope:** `docs/MVP_FEATURES.md` (Phase 1 only for launch).
