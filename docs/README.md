# Cue — Docs for Development

Documentation for the **Cue** iOS app (SwiftUI). Use this as the single entry point for any coding agent or developer.

---

## Quick reference

| Doc | Purpose |
|-----|--------|
| **SWIFTUI_DEV_SPEC.md** | **Start here for implementation.** Stack, design tokens, screens, data models, API surface, file structure, checklist. |
| **AI_UI_AGENT_BRIEF.md** | **Handoff for UI tasks.** Read first when building/updating screens. Tokens, Design/ components, quality bar (RoleSelectView, BriefCardView). Section 6 = exact prompt to give your AI UI agent. |
| **UI_POLISH_SPEC.md** | **Use for visual quality.** Premium/fun look: depth, motion, typography scale, card styling, buttons, anti-patterns, SwiftUI checklist. |
| **PROFESSIONAL_DESIGN_SPEC.md** | **Design depth.** Elevation system, typography scale, spacing grid, screen composition, component specs. Use so the app feels deliberately designed, not simple. |
| **ONBOARDING_VISUAL_SPEC.md** | **Onboarding only.** Pitch black + moving elements, logo, role cards with icons, trust footer, step indicators. |
| ONBOARDING_FLOWS.md | Screen-by-screen onboarding (Creator + Talent), copy, validation, paywall moment. |
| MVP_FEATURES.md | Phase 1 vs 2 vs 3; build order; what not to build. |
| DESIGN_SYSTEM.md | Colors, typography, UX rules, brand voice. |
| PRODUCT_SPEC.md | Psychology, business model, trust, gamification, talent retention. |

---

## Recommended order for a coding agent

1. **SWIFTUI_DEV_SPEC.md** — Read first. Contains the implementation blueprint and references the other docs.
2. **PROFESSIONAL_DESIGN_SPEC.md** — Apply everywhere: elevation (Raised/Floating), full typography scale, 4pt spacing grid, max content width, screen zones, empty/loading states. Makes the app look like a lot of thought went in.
3. **UI_POLISH_SPEC.md** — Premium/fun UI: depth, cards, buttons, motion, anti-patterns.
4. **ONBOARDING_VISUAL_SPEC.md** — Onboarding: pitch black + motion, staggered entrances.
5. **ONBOARDING_FLOWS.md** — Implement onboarding exactly as specified (one primary action per screen, copy, resume logic).
6. **DESIGN_SYSTEM.md** — Apply tokens (colors, fonts) and rules (dark only, reserved accents, 8-second rule).
7. **MVP_FEATURES.md** — Confirm scope; build only Phase 1 for launch.
8. **PRODUCT_SPEC.md** — Use for copy and behavior (loss aversion at paywall, endowment, trust, no heavy gamification).

---

## Stack

- **UI:** SwiftUI, iOS 17+
- **Auth:** Sign in with Apple (required)
- **Payments:** Stripe (Payment Intents + Connect; escrow on backend)
- **Backend:** API-agnostic; implement against the API surface in SWIFTUI_DEV_SPEC.md (mock or real).

---

## Core transaction (build this first)

```
Stripe pay-in → Post brief → Talent submits video → Creator approves → Payment released to talent
```

Everything in Phase 1 supports this loop. Onboarding gets creators and talent into the product; design and copy follow the psychology in PRODUCT_SPEC and DESIGN_SYSTEM.
