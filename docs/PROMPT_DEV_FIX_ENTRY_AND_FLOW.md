# Prompt: Fix Entry Screen, Sign-In, Upload Clips, and Navigation

**Send this to your developer agent.**

---

## Prompt to send

```
The app has critical flow bugs. I tested and:

1. **Wrong entry screen** – The app auto-loads to a random screen instead of starting on the first screen: **"Cue, your cue to create"** (the Role Select screen with the two cards: "I need video" / "I want to get cast"). It must always start there for a user who is not logged in. Right now it sometimes lands on auth, onboarding, or home.

2. **Sign-in doesn't work** – Going through screens and tapping Sign in with Apple (or continue with email) doesn't actually sign the user in or move them to the next step.

3. **Upload clip functions don't work** – In talent onboarding, the "Add 3 clips" screen: the upload/add-clip actions don't work, so I can't fill the 3 slots and can't proceed.

4. **Navigation is messed up** – I can't see half the screens; navigation between screens is broken (wrong screen shown, half screens, or can't get to the next step). Flows feel stuck or jump to the wrong place.

**What I need you to do**

**A. Entry must always start at "Cue, your cue to create" (Role Select)**

- The **only** screen a non-logged-in user should see first is: **RoleSelectView** inside **OnboardingContainerView** – the screen with logo "Cue", headline "Your cue to create.", and the two role cards. No auth screen, no onboarding step, no home, until they've seen that and picked a role.
- Fix **AppFlowController** and **AppState.load()** so that:
  - If there is **no** valid session (no userId in Keychain, or backend says invalid/expired), the app shows **phase = unauthenticated** → **OnboardingContainerView** with **step = .roleSelect** (RoleSelectView). Never show auth or onboarding or home in that case.
  - If Keychain has a userId but **getMe() fails** (network error, 401, etc.), clear the session (sign out / clear Keychain), set user = nil, and show **unauthenticated** so the user starts at Role Select again. Do not show loading forever or a random onboarding step.
  - Only after the user has **explicitly** chosen a role on Role Select and then completed Sign in should they ever see Auth or role-specific onboarding. Only after onboarding is complete should they see Creator home or Talent home.
- Ensure **OnboardingContainerView** always starts with **step = .roleSelect** when it is first shown (no stale state from a previous run).

**B. Fix sign-in**

- **AuthView**: When the user taps "Sign in with Apple", the app must call the sign-in flow, get a token, call the backend (e.g. auth Apple endpoint), save the session (Keychain + AppState), and then **move the user to the correct next screen** (Creator or Talent onboarding step 1). If sign-in fails, show a clear error and leave them on Auth so they can retry.
- Ensure **AuthService.signInWithApple(role:)** and the backend auth call (e.g. **AppState.signInWithApple()** or equivalent) are wired correctly. On simulator, use the mock token path and still call the backend so the flow completes.
- Ensure after successful sign-in, **app.user** is set from the API response and **auth.saveSession** is called so **AppFlowController**’s phase becomes creatorOnboarding or talentOnboarding (first step), not stuck on auth or unauthenticated.

**C. Fix upload clips (talent onboarding)**

- **TalentAddClipsView**: The 3 clip slots must be fillable. Each slot should open a working **photo/video picker** or **camera** (or both) so the user can select or record a short clip. After selection, the clip should be uploaded or stored and the slot should show as filled. When all 3 are filled, "Done" should advance to the next onboarding step (e.g. earnings teaser) and update **app.user** / onboarding step.
- Fix any broken **PHPickerViewController** / **UIImagePickerController** / **PhotosUI** or file upload API usage. Ensure permissions (photo library, camera) are requested and that the chosen media is actually assigned to the slot and persisted or sent to the backend as required.

**D. Fix navigation so all screens are reachable and visible**

- Audit every **NavigationStack**, **navigationDestination**, **sheet**, and **fullScreenCover**. Ensure:
  - Pushing a screen doesn’t leave a broken stack or show a blank/half screen.
  - Sheets present and dismiss correctly; no sheet that can’t be closed or that covers the wrong content.
  - The **root** of each flow is correct (e.g. onboarding flows have a clear root; tab views have the right tabs and each tab’s root view is correct).
- Ensure **CreatorOnboardingFlowView** and **TalentOnboardingFlowView** show exactly one step at a time (profile, then post-brief / clips / earnings teaser) and that "Continue" / "Done" advances the step and updates **app.user** / **auth.onboardingStep** so the next step appears.
- Ensure **AppFlowView** only shows one phase at a time and that phase transitions (loading → unauthenticated → onboarding → home) are correct and never skip or show the wrong phase.

**E. Definition of "correct" for you to verify**

- **Cold start (no session):** Loading spinner briefly → **Role Select** ("Cue, your cue to create" with two cards). Nothing else.
- **After picking Creator:** Auth screen → Sign in with Apple works → Creator onboarding step 1 (profile) → step 2 (post first brief) → Creator home.
- **After picking Talent:** Auth screen → Sign in with Apple works → Talent onboarding step 1 (profile) → step 2 (add 3 clips; all 3 slots can be filled) → step 3 (earnings teaser) → Talent home.
- **No random screen on launch; sign-in works; upload clips works; navigation is predictable and every screen is reachable and fully visible.**

**Deliverables**

- App always starts at Role Select for a user with no valid session.
- Sign-in (Sign in with Apple and any fallback) works and advances to the right onboarding step.
- Talent "add 3 clips" flow: picker/camera works, slots fill, Done advances.
- Navigation fixed so no broken stacks, no half screens, and all screens in the spec are reachable.
- Short list of what was broken and what you changed (file + behavior) so we can re-test.
```

---

Use this in the Cue iOS app repo. Key files: **AppFlowController.swift**, **RootView.swift**, **AppState.swift** (especially **load()**), **AuthService.swift**, **OnboardingContainerView.swift**, **RoleSelectView**, **AuthView**, **TalentAddClipsView**, and any view that uses NavigationStack/sheet/fullScreenCover.
