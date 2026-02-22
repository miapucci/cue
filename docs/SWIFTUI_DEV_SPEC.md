# Cue — SwiftUI Development Spec

Single reference for a coding agent implementing the Cue iOS app in **SwiftUI**. Use with `PRODUCT_SPEC.md`, `DESIGN_SYSTEM.md`, `MVP_FEATURES.md`, and `ONBOARDING_FLOWS.md`.

---

## 1. Stack & environment

| Item | Choice |
|------|--------|
| UI | SwiftUI only |
| Min iOS | 17.0 (or 18.0 if using latest APIs) |
| Architecture | MVVM or similar; keep views dumb, logic in ViewModels / services |
| Auth | Sign in with Apple (required); optional email/magic link |
| Payments | Stripe (iOS SDK): Payment Intents for creator pay-in; Connect for talent payouts; escrow = hold until approval |
| Backend | Agnostic; implement against abstract API service (see API surface below). Mock for first pass. |

**Doc map:**

- Strategy & psychology: `docs/PRODUCT_SPEC.md`
- Colors, typography, UX rules: `docs/DESIGN_SYSTEM.md`
- **Visual polish (premium, fun):** `docs/UI_POLISH_SPEC.md` — depth, motion, cards, buttons, typography scale.
- What to build in Phase 1: `docs/MVP_FEATURES.md`
- Onboarding screens and copy: `docs/ONBOARDING_FLOWS.md`
- This file: implementation blueprint.

---

## 2. Design tokens (SwiftUI)

Use these so the app matches the design system. **Dark mode is the only supported appearance** for MVP (no light mode toggle).

### Colors

```swift
// Background
static let surface = Color(hex: "0D0D0D")

// Primary accent (default: Electric Blue)
static let primaryAccent = Color(hex: "00D4FF")
// Alternatives: "FF6B35" (Warm Orange), "F5F5F5" (Pure White)

// Reserved — use only for reward/CTA moments
static let successMoney = Color(hex: "C8F135")   // Lime green: earnings, approval, payment released
static let ctaUrgency   = Color(hex: "F72585")   // Cyber pink: primary buttons, high-impact actions

// Semantic
static let textPrimary   = Color.white
static let textSecondary = Color.white.opacity(0.7)
```

**Helper:** Add `Color(hex:)` extension if not present. Use `#`-prefixed or plain hex.

**Rules:** Use `primaryAccent` for tabs, selected state, links. Use `successMoney` and `ctaUrgency` only on reward/CTA screens (see DESIGN_SYSTEM).

### Typography

- **Headers:** Bold, large. Font: system bold or “Clash Display” / custom if bundled (e.g. `.custom("ClashDisplay-Bold", size: 28)`).
- **Body:** Inter or system; medium weight. `.body` or `.custom("Inter-Medium", size: 16)`.
- **Micro-copy:** Slightly smaller; same family. Caption-style.

Define in one place (e.g. `Font.Cue.headline`, `Font.Cue.body`) so the agent can reuse.

### Spacing

- Use 8pt grid where possible: 8, 16, 24, 32.
- Screen padding: 16 or 20.

---

## 3. App structure & navigation

### Entry

1. **App entry point:** Check auth state.
2. If not authenticated → show **Role select** (Creator vs Talent) then **Auth**.
3. If authenticated, read **onboarding state** (stored per user):
   - Incomplete → resume at correct step (see ONBOARDING_FLOWS).
   - Complete → open **role-appropriate Home**.

### Single app, two roles

- One app; **role** is a property of the account (creator | talent). No role switch in MVP.
- After login/onboarding, root is either:
  - **Creator:** Tab or single flow: My Briefs → Brief detail → Submissions → Approve/Reject/Revision.
  - **Talent:** Tab or single flow: Brief feed (swipe) → Brief detail → Submit video → Earnings.

### Navigation

- Use `NavigationStack` for all stacks.
- One primary action per screen (8-second rule).
- Modals: paywall, camera/upload, review submission.

### Suggested root structure

```
RootView
├── if !authenticated → OnboardingContainer (role select → auth → role onboarding)
├── if creator → CreatorTab (My Briefs list; tap → Brief detail → Submissions)
└── if talent   → TalentTab (Brief feed; tap → Brief detail → Submit; Earnings view)
```

---

## 4. Screen inventory (Phase 1)

Implement only these for MVP. Names are for reference; agent can rename views to match codebase style.

| # | Screen ID | Purpose | Key components | Doc reference |
|---|------------|---------|----------------|----------------|
| 1 | RoleSelect | Creator vs Talent choice | 2 cards/buttons | ONBOARDING_FLOWS |
| 2 | Auth | Sign in with Apple, optional email | Apple button, links | ONBOARDING_FLOWS |
| 3 | CreatorProfile | Name, bio, social link | Text fields, Continue | ONBOARDING_FLOWS |
| 4 | CreatorPostBrief | First brief (free) or paid | Form: title, description, pay, deadline, format, ref video | ONBOARDING_FLOWS, MVP_FEATURES |
| 5 | CreatorHome | List of creator’s briefs | Brief cards, submission counts | MVP_FEATURES |
| 6 | BriefDetail | One brief (creator or talent view) | Title, description, pay, deadline, format; Creator: “View submissions” | MVP_FEATURES |
| 7 | SubmissionsList | Creator sees submissions for one brief | List of talent + thumbnail/preview; Approve / Request revision / Reject | MVP_FEATURES |
| 8 | Paywall | Upgrade to view submissions / post more | Loss aversion copy; subscription or pay-per-brief | PRODUCT_SPEC, ONBOARDING_FLOWS |
| 9 | TalentProfile | Name, bio | Text fields, Continue | ONBOARDING_FLOWS |
| 10 | TalentAddClips | 3 mandatory sample videos | 3 slots, camera roll / record, Done | ONBOARDING_FLOWS |
| 11 | TalentEarningsTeaser | Calculator + “Your first briefs” | One CTA: “See my briefs” | ONBOARDING_FLOWS |
| 12 | TalentBriefFeed | Swipeable brief cards | Cards: vibe preview, pay rate, deadline; tap → detail | DESIGN_SYSTEM, MVP_FEATURES |
| 13 | TalentBriefDetail | One brief for claiming | Full brief; “Claim brief” → upload flow | MVP_FEATURES |
| 14 | TalentSubmitVideo | Upload or record submission | Camera roll picker or in-app record; submit | MVP_FEATURES |
| 15 | TalentEarnings | Pending + released earnings | List/balance; Stripe Connect payout | MVP_FEATURES |
| 16 | Messaging | Revision notes only (minimal) | Thread with creator/talent; text only | MVP_FEATURES |
| 17 | MutualReview | Rate after completed transaction | Star + optional text; both sides | MVP_FEATURES |

---

## 5. Data models (Swift)

Define these (or equivalent) so backend and UI align. IDs are strings (UUIDs from backend).

### User

```swift
struct User: Codable {
    let id: String
    var displayName: String
    var bio: String
    var socialLink: String?
    var role: Role
    var onboardingComplete: Bool
    var onboardingStep: String?
}

enum Role: String, Codable { case creator, talent }
```

### Brief

```swift
struct Brief: Codable, Identifiable {
    let id: String
    let creatorId: String
    var title: String
    var description: String
    var payRateCents: Int
    var currency: String
    var deadline: Date
    var format: VideoFormat
    var referenceVideoURL: String?
    var status: BriefStatus
    var submissionCount: Int?
    var isFirstFree: Bool?
}

struct VideoFormat: Codable {
    var orientation: Orientation  // vertical, horizontal
    var durationSeconds: Int
}
enum Orientation: String, Codable { case vertical, horizontal }

enum BriefStatus: String, Codable { case draft, live, closed, completed }
```

### Submission

```swift
struct Submission: Codable, Identifiable {
    let id: String
    let briefId: String
    let talentId: String
    var videoURL: String
    var status: SubmissionStatus
    var revisionNotes: String?
    var createdAt: Date
}

enum SubmissionStatus: String, Codable {
    case pendingReview
    case revisionRequested
    case approved
    case rejected
}
```

### Review (mutual)

```swift
struct Review: Codable {
    let id: String
    let submissionId: String
    let fromUserId: String
    let toUserId: String
    var rating: Int
    var comment: String?
    var createdAt: Date
}
```

### Payment / escrow

- Creator pays upfront when posting (or when first free is used, at “View submissions”). Backend holds funds.
- On “Approve,” backend releases payment to talent (Stripe Connect).
- Model in app: track “payment status” per brief or per submission (e.g. `pending`, `released`, `refunded`). Exact shape can match backend.

---

## 6. Stripe integration

- **Creator pay-in:** Stripe Payment Intents (or Checkout). Creator pays amount = brief pay rate (or subscription); funds go to platform. Backend creates PaymentIntent and returns client secret; iOS confirms with Stripe SDK.
- **Escrow:** Backend holds payment; no payout to talent until creator approves. No Stripe call from app for “release” — backend does it on approve.
- **Talent payout:** Stripe Connect (Express or Standard). Talent onboarding (Connect onboarding) can be Phase 1 or Phase 2; MVP can “accumulate balance” and pay out later if Connect is deferred. Document: “Talent gets paid (Stripe Connect)” — implement Connect onboarding and transfer on approval.
- **First brief free:** Backend applies 0 charge for first brief; still create brief and track `isFirstFree`.

---

## 7. Auth

- **Sign in with Apple:** Required. Use `AuthenticationServices`. Send identity token to backend; backend creates or links user, returns session/tokens.
- **Optional email:** If implemented, backend sends magic link or OTP; app opens link or enters OTP. Store session the same way.
- **Session:** Store securely (Keychain). Include `userId`, `role`, and optionally `onboardingStep` in user object from backend.

---

## 8. File / folder structure (suggestion)

```
App/
  CueApp.swift
  RootView.swift
  ContentView.swift (or role-based root)

Onboarding/
  RoleSelectView.swift
  AuthView.swift
  CreatorOnboarding/
    CreatorProfileView.swift
    CreatorPostBriefView.swift
  TalentOnboarding/
    TalentProfileView.swift
    TalentAddClipsView.swift
    TalentEarningsTeaserView.swift

Creator/
  CreatorHomeView.swift
  BriefDetailView.swift (creator perspective)
  SubmissionsListView.swift
  PaywallView.swift

Talent/
  TalentBriefFeedView.swift
  TalentBriefDetailView.swift
  TalentSubmitVideoView.swift
  TalentEarningsView.swift

Shared/
  BriefCardView.swift
  BriefFormView.swift (fields for posting/editing)
  SubmissionCardView.swift
  MessagingView.swift
  MutualReviewView.swift

Services/
  APIClient.swift
  AuthService.swift
  StripeService.swift (or PaymentService)

Models/
  User.swift, Brief.swift, Submission.swift, Review.swift, etc.

Design/
  CueColors.swift
  CueFonts.swift
  CueComponents.swift (buttons, cards)
```

Agent can flatten or rename; keep separation between onboarding, creator, talent, shared, services, models, design.

---

## 9. Components to implement

| Component | Use | Design notes |
|-----------|-----|--------------|
| Primary button | CTAs | `ctaUrgency` (pink) on paywall/primary actions; else `primaryAccent`. Full width, rounded. |
| Secondary button | “Continue with email”, back | Outline or text; not neon. |
| BriefCard | Feed and lists | Vibe preview (image/video thumb), pay rate, deadline. Tap → detail. Dark card on `surface`. |
| TalentCard | Submission list | Thumbnail, name, “Responds in &lt; 2h” if available. |
| Text fields | Profile, brief form | Dark background, light text, clear placeholders. |
| Progress | Talent 3 clips | “1 of 3” or checkmarks. |
| Success state | Payment released, video approved | `successMoney` pulse or checkmark; optional confetti. |

---

## 10. Backend API surface (required for MVP)

Implement these as an abstract `APIClient` so the app can run with mocks. All responses can be JSON; auth via Bearer token or session cookie.

| Method | Endpoint (example) | Purpose |
|--------|--------------------|---------|
| POST | /auth/apple | Sign in with Apple; body: idToken, role; returns user + session. |
| GET | /me | Current user (profile, role, onboardingStep). |
| PATCH | /me | Update profile (name, bio, social, onboardingStep). |
| POST | /briefs | Create brief (creator); body: title, description, payRateCents, deadline, format, referenceVideoURL; backend sets isFirstFree for first brief. |
| GET | /briefs/mine | Creator’s briefs. |
| GET | /briefs/:id | Brief detail (creator or talent). |
| GET | /briefs/feed | Talent brief feed (paginated; optional “for you” for onboarding). |
| GET | /briefs/:id/submissions | Creator: list submissions (require paid/upgrade). |
| POST | /briefs/:id/claim | Talent: claim brief (creates submission slot). |
| POST | /submissions | Talent: upload video (multipart or upload URL). |
| PATCH | /submissions/:id | Creator: approve / request revision / reject. |
| GET | /earnings | Talent: pending + released balances. |
| POST | /reviews | Mutual review after completion. |
| GET | /messages/thread/:submissionId | Thread for revision notes. |
| POST | /messages | Send message (revision note). |

**Paywall:** Backend returns e.g. `canViewSubmissions: false` or `subscriptionStatus` so app can show PaywallView when creator taps “View submissions.”

---

## 11. State flows (for logic)

**Brief (creator):** draft (optional) → live → (submissions) → one approved → closed/completed. Payment: created when brief goes live (or when first submission viewed); released when creator approves.

**Submission (talent):** claimed → upload → pendingReview → (approved | revisionRequested | rejected). If revisionRequested, talent re-uploads; back to pendingReview.

**Onboarding:** Stored per user. Steps: profile → (creator: post first brief | talent: 3 clips → earnings teaser) → complete. Resume from last step on next open.

---

## 12. Notifications (Phase 1)

- Talent: “New brief in your category.”
- Creator: “X submissions on your brief.”
- Both: “Payment released.”

Register for push after auth; send device token to backend. Use UNUserNotificationCenter; no in-app notification center required for MVP.

---

## 13. Checklist for coding agent

- [ ] Read PRODUCT_SPEC, DESIGN_SYSTEM, MVP_FEATURES, ONBOARDING_FLOWS.
- [ ] Implement design tokens (colors, fonts) and dark-only appearance.
- [ ] Implement RoleSelect → Auth → role-specific onboarding (Creator: profile → post first brief; Talent: profile → 3 clips → earnings teaser).
- [ ] Implement Creator: My Briefs → Brief detail → Submissions list → Approve/Revision/Reject; Paywall when viewing submissions (loss aversion copy).
- [ ] Implement Talent: Brief feed (swipeable cards) → Brief detail → Claim → Upload submission → Earnings view.
- [ ] Implement Stripe: creator pay-in (Payment Intents), escrow (backend), talent payout (Connect).
- [ ] Implement mutual review and minimal messaging (revision notes).
- [ ] Wire APIClient to backend or mock; implement all endpoints in §10.
- [ ] One primary action per screen; reserve neon (green/pink) for reward/CTA only.
- [ ] Persist onboarding state and resume correctly.
