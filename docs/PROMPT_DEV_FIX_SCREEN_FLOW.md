# Prompt: Fix Flow Between Screens (App Runs, Backend Connected)

**Send this to your developer agent.**

---

## Prompt to send

```
Our Cue app runs and the backend is connected, but the flow between screens doesn’t work. I need you to trace every path, fix broken transitions, and make sure navigation and state updates are correct end-to-end.

**What to do**

1. **Map and fix the full flow**
   - **Unauthenticated:** RoleSelect → Auth → (after sign-in) role-specific onboarding.
   - **Creator onboarding:** Profile (CreatorProfileView) → Post first brief (CreatorPostBriefView). Ensure "Continue" on profile updates `app.user` / `app.updateUser()` and advances `onboardingStep` so the flow shows Post brief; ensure "Post brief" on CreatorPostBriefView calls the API then calls `app.completeOnboarding()` and that `app.user` is actually updated so RootView shows Creator home (CreatorTabView) instead of onboarding.
   - **Talent onboarding:** Profile → 3 clips (TalentAddClipsView) → Earnings teaser (TalentEarningsTeaserView). Same idea: each step must update `app.user` / onboarding step so the next screen shows; final step must call `app.completeOnboarding()` and update `app.user` so RootView shows Talent home (TalentTabView).
   - **Creator home:** CreatorHomeView loads briefs via `app.api.getMyBriefs()`. Tapping a brief should open CreatorBriefDetailView (navigationDestination is already set). "View submissions" on detail must correctly open SubmissionsListView (or show PaywallView when backend says can't view). **Wire "Post another brief"** on the empty state (and optionally from nav/toolbar) so it navigates to a screen where the creator can post a new brief (e.g. sheet or push to a post-brief flow). Ensure SubmissionsListView and PaywallView dismiss/navigate correctly after use.
   - **Talent home:** TalentTabView shows TalentBriefFeedView and TalentEarningsView. Ensure both receive `app` (EnvironmentObject) so API calls and state work. Swipe feed: swipe right = claim and present TalentSubmitVideoView (sheet); swipe left = skip. Tapping a card can open TalentBriefDetailView; "Claim brief" there must set `claimedSubmission` and present the submit sheet. After submitting video, dismiss sheet and optionally refresh or show success. Earnings tab should load and display data from `app.api.getEarnings()`.

2. **State and navigation**
   - When onboarding completes, `app.user?.onboardingComplete` must be true so RootView shows `roleHome` (CreatorTabView or TalentTabView). If `User` is a struct, `completeOnboarding()` must reassign `app.user` with a copy that has `onboardingComplete == true` and `onboardingStep == nil`, not just mutate via optional chaining.
   - Every NavigationStack that pushes or presents must have the correct binding/destination (navigationDestination, sheet, fullScreenCover). Fix any mismatched types (e.g. API returning a different shape than the view expects).
   - Ensure `@EnvironmentObject private var app: AppState` is available wherever views call `app.api` or `app.updateUser()` / `app.completeOnboarding()`. If a tab or nested view doesn’t get it, pass it explicitly (e.g. `.environmentObject(app)`).

3. **Known gaps to fix**
   - CreatorHomeView: empty state CTA "Post another brief" is not wired (comment says "navigate to post when wired"). Wire it to present or push to a flow that posts a new brief (reuse BriefFormView / create brief API).
   - CreatorBriefDetailView: "View submissions" uses `app.api.canViewSubmissions(briefId:)` and expects a result with `canView` and `clientSecret`. Confirm the API protocol and HTTPAPIClient return type match (CanViewSubmissionsResult). Fix navigation so when `canView` is true we show SubmissionsListView; when false we show PaywallView with clientSecret.
   - TalentTabView: ensure TalentBriefFeedView and TalentEarningsView get `app` from the environment (they use `@EnvironmentObject private var app: AppState`). If the tab content doesn’t inherit it, pass `.environmentObject(app)` from the tab view (you’ll need to hold app in CreatorTabView/TalentTabView via @EnvironmentObject and pass it to children).
   - After any API call that updates the user (e.g. profile save, onboarding step), call `app.updateUser(updatedUser)` or the equivalent so the UI and RootView branching stay in sync.

4. **Deliverables**
   - All flows above work: onboarding progresses step-by-step and lands on Creator or Talent home; creator can see briefs, open detail, view submissions or paywall, and post another brief; talent can swipe or tap to claim, submit video, and see earnings.
   - No dead ends: every primary button has a defined outcome (navigation, sheet, or API then state update).
   - Short list of what was broken and what you changed (file and behavior) so we can verify.
```

---

Use this prompt in the same chat/repo as the Cue app so the agent can read RootView, AppState, onboarding views, CreatorHomeView, CreatorBriefDetailView, TalentBriefFeedView, TalentTabView, and the API layer.
