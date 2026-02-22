# Cue — Handoff for Coding Agent

Use this as the **single instruction** when handing off to a coding agent. Everything else is in the repo.

**For UI/screen work specifically:** Point the agent at **`docs/AI_UI_AGENT_BRIEF.md`** first — it consolidates design rules and the exact prompt to use for better screens.

---

## Instruction

**You are building the Cue iOS app (SwiftUI). All specs are in the `docs/` folder.**

1. **Start with** `docs/README.md` and **`docs/SWIFTUI_DEV_SPEC.md`** — they contain the implementation blueprint, screen list, data models, API surface, and checklist.

2. **Design depth (professional feel):** For any UI or screen work, read **`docs/AI_UI_AGENT_BRIEF.md`** then **`docs/PROFESSIONAL_DESIGN_SPEC.md`** everywhere: elevation system (`CueElevation` / `.cueRaised`, `.cueFloating`), full typography scale, 4pt spacing grid, max content width (e.g. 420pt) for composed layouts, screen zones (hero, content, action), empty/loading states. Use **`docs/UI_POLISH_SPEC.md`** for cards, buttons, motion. Use **`docs/ONBOARDING_VISUAL_SPEC.md`** for onboarding (pitch black + moving elements, staggered entrances, trust footer).

3. **Onboarding flows and copy:** Implement per **`docs/ONBOARDING_FLOWS.md`** (one primary action per screen, validation, paywall moment).

4. **Scope:** Build only Phase 1 from **`docs/MVP_FEATURES.md`**. Core transaction: Stripe pay-in → post brief → talent submits video → creator approves → payment released.

5. **Design tokens:** Use `CueColors`, `Font.Cue`, `CueLayout`, and components in `Design/`. Dark mode only; reserve neon (lime/pink) for reward and CTA moments.

Reference **`docs/DESIGN_SYSTEM.md`** and **`docs/PRODUCT_SPEC.md`** for brand voice, copy tone, and psychology (loss aversion, endowment, trust).

---

## What you don’t need to send

- The agent has the repo; all docs are in `docs/`.
- No need to paste individual spec files unless the agent can’t read the folder.

---

## Developer: How to see all screens (past screen 2)

To get past screen 2 and see the rest of the design, run the app in **Debug**. On **screen 1 (Role select)** or **screen 2 (Auth)**, use the dev-only links at the bottom:

- **Screen 1 (Role select):** **"Dev: Skip to Creator"** / **"Dev: Skip to Talent"**
- **Screen 2 (Auth):** **"Dev: Creator home"** / **"Dev: Talent feed"**

Tapping one takes you straight to **Creator home** or **Talent feed** so you can open every screen (briefs, submissions, paywall, earnings, etc.). No real Sign in with Apple or onboarding steps required.

The dev bypass buttons are only compiled in when `DEBUG` is set (normal when running from Xcode); they are **not** included in Release builds.

**If the dev links don’t appear:** Make sure you’re building and running a **Debug** build (not Release). The dev bypass buttons only appear in Debug. If you don’t see them, check that the scheme is set to Debug and that you’re not archiving for release.

---

## What you might need to provide later (not for first pass)

- **Stripe:** Publishable key (and backend URL for Payment Intents / Connect) when you move off mocks.
- **Backend:** Base URL and auth scheme if you connect to a real API.
- **Terms/Privacy URLs:** Replace `https://example.com/terms` and `https://example.com/privacy` in onboarding when you have real links.
