# Cue — MVP Feature List & Build Order

**Rule:** Only build what enables the core transaction: **brief posted → video submitted → approved → paid.** Everything else is Phase 2+.

---

## Phase 1 — Core Transaction (Launch)

### Creator side

- Account creation + profile (name, bio, social link for credibility).
- **Post a brief:** title, description, pay rate, deadline, format (vertical/horizontal, length), optional reference video.
- Browse talent submissions for that brief.
- **Approve / request one revision / reject.**
- Download approved video.
- **Pay upfront** — funds held in escrow (Stripe), released on approval.

### Talent side

- Account creation + profile (name, bio, **3 sample clips mandatory**).
- **Browse brief feed** — swipeable cards (not search-first).
- Claim a brief.
- **Upload submission** — camera roll or in-app record.
- View pending + released earnings.
- Get paid (Stripe Connect).

### Both sides

- **In-app messaging** — revision notes only; keep minimal.
- **Mutual review** after each completed transaction.
- **Push notifications:**
  - Talent: “New brief in your category.”
  - Creator: “X submissions on your brief.”
  - Both: “Payment released.”

---

## Phase 2 — Retention (Post-launch)

- In-app camera with script/brief overlay (teleprompter).
- Talent **Boost** visibility ($9/mo).
- Creator subscription tier ($19/mo unlimited briefs vs pay-per-brief).
- **“Rising Talent”** badge (auto: &lt;30 days + 1 booking).
- **Earnings dashboard as home** for talent.
- **Profile completion progress bar.**
- **“Brief expires in X hours”** loss-aversion notification.

---

## Phase 3 — Scale

- Brand/agency tier (volume, dedicated support).
- AI brief-to-talent matching.
- Creator analytics (which video style performs).
- Public talent portfolio (shareable link).
- Referral (talent invites talent; cut of first 3 bookings).

---

## Build order

```
Stripe payments → Brief posting → Video upload → Approval flow
```

These four flows **are** the product. Ship nothing else first.

- Resist building teleprompter, gamification, or analytics before the core transaction works.
- **First 10 briefs:** run manually (you play both sides), stress-test, remove friction before real users hit it.

---

## What you’re NOT building in MVP

| Feature           | Why not |
|-------------------|--------|
| In-app video editor | Camera roll upload is enough. |
| AI matching       | Validate demand with manual browsing first. |
| Leaderboards      | Too few users to be meaningful. |
| Subscription tier | Start pay-per-brief to validate willingness to pay. |
| Boost visibility  | No supply/demand imbalance to solve yet. |
| Brand/agency tier | One audience at a time. |

---

## Next (recommended)

1. **Lock primary accent** — Electric Blue vs Warm Orange vs Pure White (see `DESIGN_SYSTEM.md`).
2. **Onboarding flows** — creator path (post first free brief) and talent path (profile + 3 clips → first matched briefs).
3. **Technical stack** — e.g. React Native / Expo or native iOS; Stripe Connect + escrow; auth and storage.
