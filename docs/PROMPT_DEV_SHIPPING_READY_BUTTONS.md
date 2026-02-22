# Prompt: Shipping Ready — Every Button Works, Sign-In & Upload Fixed

**Send this to your developer agent.**

---

## Prompt to send

```
This app needs to be shipping ready. Right now it is not: too many buttons do nothing, sign-in is broken, and talent cannot upload videos. I need every button to lead where it's supposed to and core flows to work end-to-end.

**Critical issues (must fix)**

1. **Sign in with Apple still doesn't work**  
   When the user taps "Sign in with Apple" on the Auth screen, they must actually sign in: the app gets a token (or uses the test-account path on simulator), the backend accepts it and returns { user, token }, the app stores the token and user and moves to the correct next screen (Creator or Talent onboarding step 1). No silent failure, no stuck-on-auth. If something fails, show a clear error. Fix both the iOS flow and the backend (e.g. accept mock/test token in dev so simulator can complete sign-in).

2. **Continue with email does nothing**  
   The Auth screen has "Continue with email" but the action is empty (Phase 2 comment). That is not acceptable for shipping. Either:  
   - **Option A:** Implement a real "Continue with email" flow (e.g. enter email → backend sends magic link or OTP → user completes sign-in, backend returns { user, token }, app stores session and advances), or  
   - **Option B:** If email is not in scope for v1, replace the button with something that does a defined thing (e.g. "Email coming soon" alert, or open a mailto: link, or a disabled button with a tooltip). Do not leave a tappable button that has no effect.

3. **Talent cannot upload videos**  
   On the talent submission screen (after claiming a brief), the user must be able to choose a video from their library (or record one) and submit it. Right now "Choose from library" is a mock that sets a fake URL; there is no real photo/video picker. You must:  
   - Add a **real** way to pick a video (e.g. PHPickerViewController / PhotosUI for "Choose from library", and optionally camera for "Record"). The chosen media must be written to a temporary file or provide a URL the app can read.  
   - When the user taps "Submit video", the app must upload that **real** file to the backend (POST /submissions/:id/upload with multipart/form-data). Ensure the backend route exists, accepts the file, and returns the updated submission.  
   - No mocks in the shipped flow: the user selects a real video and it uploads. Handle errors (e.g. "Upload failed") and show success then dismiss or advance.

**Every button must do something**

- Audit **every** primary action in the app: every `CuePrimaryButton`, `CueSecondaryButton`, and any other Button that looks like a main action. For each one, confirm: (1) It has a non-empty action. (2) The action does what the label says (or what the design spec says). (3) The user is taken to the correct next screen or sees clear feedback (success/error).  
- Fix any button that currently does nothing (empty closure, "Phase 2", "TODO", or placeholder). Either implement the correct behavior or replace with a clear "Coming soon" / disabled state so the user is not left tapping with no result.  
- Screens to check explicitly: **AuthView** (Sign in with Apple, Continue with email), **RoleSelectView** (role cards), **CreatorProfileView** / **TalentProfileView** (Continue), **CreatorPostBriefView** (Post brief), **TalentAddClipsView** (clip slots, Done), **TalentEarningsTeaserView** (See my briefs / CTA), **CreatorHomeView** (Post another brief, brief cards), **CreatorBriefDetailView** (View submissions), **TalentBriefFeedView** (swipe, card tap), **TalentBriefDetailView** (Claim brief), **TalentSubmitVideoView** (Choose from library / Record, Submit video), **SubmissionsListView** (Approve / Reject / Request revision), **PaywallView** (Upgrade / Dismiss), **MutualReviewView** (Submit review), **MessagingView** (Send), and any empty-state CTAs.  
- Deliver a short **button audit**: list each screen and each primary button, and one line saying what it does (e.g. "Sign in with Apple → calls backend, stores token, advances to Creator profile").

**Definition of done**

- Sign in with Apple works (and test account on simulator works).  
- Continue with email either works or is replaced with a defined, non-misleading behavior.  
- Talent can pick a real video (library and/or camera) and submit it; upload hits the backend and succeeds or shows a clear error.  
- Every other button in the app has a defined action and leads where it’s supposed to; no dead buttons.  
- After your changes, the app is in a state where a real user can: sign in, complete onboarding, (creator) post a brief and view submissions, (talent) browse briefs, claim one, upload a video, and see it in the flow.  

**Deliverables**

- All of the above implemented and working.  
- Button audit (list of screens + buttons + what each does).  
- Short list of what was broken and what you changed (files + behavior).
```

---

Use this in the **Tobi** repo (backend + Cue iOS app). Key files: **AuthView.swift**, **TalentSubmitVideoView.swift**, **AppState.swift**, **HTTPAPIClient.swift**, **backend auth route and submissions upload route**, and every view that contains a primary button (see list in prompt).
