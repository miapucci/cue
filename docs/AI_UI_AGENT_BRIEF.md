# Cue — AI UI Agent Brief: What to Tell Your Agent

**Use this as the single instruction set when asking an AI to build or update Cue screens.** All research and specs live in the Cue repo; this doc tells the agent where to look and what is non-negotiable.

---

## 0. Source of truth & how to brief the UI agent

**Source of truth:** Use the updated **`docs/AI_UI_AGENT_BRIEF.md`** (this file), **`docs/UI_POLISH_SPEC.md`**, and **`docs/PREMIUM_POLISH_ADDENDUM.md`**. For onboarding, use **`docs/ONBOARDING_VISUAL_SPEC.md`** and **`docs/ONBOARDING_FLOWS.md`**.

**When assigning screens:** Use the **Exact Prompt** in §6 below **plus** the prompt lines in **`docs/RESEARCH_UI_LOOK_AND_FEEL.md` §3.4** (motion, gradients, empty states, onboarding, money moments).

**Emphasize with the agent:**

- **Accessibility:** Respect contrast (7:1 for body). Support **Reduce Motion** — provide motion fallbacks (e.g. instant show or no animation when Reduce Motion is on) so the app stays readable.
- **Money moments:** Earnings, payout, or approval = **hero amount** + **lime** (success color) + **one short success animation** (pulse or check). Never bury payout in plain body text.
- **No large flat black:** Every large solid area must have gradient, shadow, or motion.
- **Ambient motion:** Use `TimelineView` or equivalent for orbs/slow gradients; cycle length **15–40s**.
- **Side-specific onboarding:** After role pick, the first content screen uses: **Creator:** “Post briefs. Get the video.” **Talent:** “Get cast. Get paid.”

**Short briefing block (copy when handing off):**

```
Source of truth: docs/AI_UI_AGENT_BRIEF.md, docs/UI_POLISH_SPEC.md, docs/PREMIUM_POLISH_ADDENDUM.md. Onboarding: docs/ONBOARDING_VISUAL_SPEC.md, docs/ONBOARDING_FLOWS.md.
Use the Exact Prompt in AI_UI_AGENT_BRIEF §6 plus the prompt lines in docs/RESEARCH_UI_LOOK_AND_FEEL.md §3.4.
Emphasize: accessibility (7:1 contrast, Reduce Motion fallbacks), money moments (hero amount + lime + success animation), no large flat black, ambient motion (15–40s), side-specific onboarding first line (Creator: “Post briefs. Get the video.” / Talent: “Get cast. Get paid.”).
Task: [describe the screen(s) or flow]
```

---

## 1. Where Everything Lives

| Need | Location |
|------|----------|
| **This brief** | `docs/AI_UI_AGENT_BRIEF.md` (you are here) |
| **Handoff for any coding agent** | `docs/AGENT_HANDOFF.md` |
| **Professional depth & rigor** | `docs/PROFESSIONAL_DESIGN_SPEC.md` |
| **Visual polish (cards, buttons, motion)** | `docs/UI_POLISH_SPEC.md` |
| **Onboarding (background, role cards, trust)** | `docs/ONBOARDING_VISUAL_SPEC.md` |
| **Brand, colors, voice** | `docs/DESIGN_SYSTEM.md` |
| **Design tokens in code** | `Cue/Cue/Design/` — `CueColors.swift`, `CueFonts.swift`, `CueElevation.swift`, `CueComponents.swift` |
| **Premium polish (gradients, motion, “moving parts”)** | `docs/PREMIUM_POLISH_ADDENDUM.md` |
| **Research-backed prompt lines (motion, gradients, money, onboarding)** | `docs/RESEARCH_UI_LOOK_AND_FEEL.md` §3.4 |

**Rule:** Before changing any UI, read the relevant spec and use the existing Design tokens. Do not invent new colors, font sizes, or shadow values. For screens that should feel like a **tremendous amount of effort** (dynamic, gradients, motion), also read `docs/PREMIUM_POLISH_ADDENDUM.md`. When briefing the agent for a task, use the Exact Prompt in §6 **plus** the prompt lines in `docs/RESEARCH_UI_LOOK_AND_FEEL.md` §3.4.

---

## 2. Design in One Sentence

**Editorial dark, product-grade:** Confident typography and strict spacing on a dark canvas, with a clear elevation system and one accent used with restraint. Feels like a serious tool (Spotify × Cash App × CRED), not a generic form app.

---

## 3. Non-Negotiables (Every Screen)

- **Elevation:** Cards and inputs use **`.cueRaised()`** or **`.cueFloating()`** from `CueElevation`. No one-off shadows or `Color(white: 0.14)` in views. Same level = same treatment.
- **Typography:** Use **only** `Font.Cue.*` tokens (e.g. `.hero`, `.title1`, `.title2`, `.body`, `.caption1`). No `.font(.system(size: 17))` or ad-hoc sizes.
- **Spacing:** Use **only** `CueLayout.*` (xxs, xs, sm, md, lg, xl, xxl, screenPadding, cardPadding). 4pt grid; no random 14 or 18.
- **Screen structure:** Every screen has **zones:** (1) Hero/headline, (2) Content, (3) Action (primary CTA). One clear headline per screen; one primary action.
- **Max content width:** Onboarding and composed flows: content area **max 420pt** (or 400pt for role select), centered. Use `CueLayout.maxContentWidth`.
- **Buttons:** Primary = **min height 56pt**, `CuePrimaryButton` or equivalent with **press scale 0.97** and spring. Use `CueColors.primaryAccent` or `ctaUrgency` (paywall only).
- **Cards:** 20pt corner radius, 20pt internal padding, elevated background + optional top-edge highlight. **Press:** scale 0.98, spring (`CueCardPressStyle`).
- **Empty states:** Never raw "No X yet." Use: (1) Short headline (Title 2/3), (2) One line explanation (Body/Caption), (3) Optional icon/illustration, (4) One CTA.
- **Loading:** Skeleton that matches content shape, or centered indicator + short label (Caption 1). No spinner alone in empty space.

**Accessibility & polish:**
- **Contrast:** Body text and key UI meet contrast expectations (e.g. 7:1 for body). Use design tokens for text; avoid low-contrast gray-on-gray.
- **Motion fallbacks:** Where motion is used (staggered entrance, orbs), ensure the app still reads clearly with Reduce Motion enabled (e.g. no motion or instant show).
- **Money moments:** Any screen that shows earnings, payout, or "payment released" uses the success color (lime), clear typography for the amount, and a short success animation (pulse or check). Never show payout as plain body text only.

---

## 4. What Makes It Look Bad (Avoid These)

- Flat rectangles with 1pt gray border and no depth
- All text same weight/size (no hierarchy)
- Buttons that don't react to press (no scale/spring)
- Cramped layout; no breathing room
- System default 12pt radius everywhere
- No motion on tap or transition
- Placeholder media as flat gray box with text in the middle
- Raw `Color(white:)` or custom shadows in views instead of `CueElevation` / `CueLayout`
- **Large flat black areas** with no gradient, shadow, or motion — feels unfinished
- **Pure white (#FFFFFF) for long body paragraphs** on dark — use slight off-white or token for readability
- **No press feedback** on buttons or cards — every tappable must have scale (and optionally opacity) on press
- **Money or payout hidden** in generic body text with no emphasis or success treatment — money moments need hierarchy + color + animation
- **Instant pop-in** for lists or cards — use staggered entrance so the screen feels composed
- **Fast or bouncy motion** for ambient elements (orbs, gradients) — keep cycle length ≥15s; no game-like bounce on serious flows
- **Multiple competing CTAs** on one screen — one primary action; secondary is clearly de-emphasized
- **Introducing new colors or shadows** outside CueColors and CueElevation — breaks the system

---

## 5. Reference Implementations in This Repo

When in doubt, copy patterns from:

- **RoleSelectView** — Hero zone, staggered entrance, role cards with icons, footer, max width, `OnboardingBackgroundView`
- **BriefCardView** — Media-first, 9:16 aspect, bottom gradient for text, `.cueRaised()`, `CueCardPressStyle`
- **CueComponents.swift** — `CuePrimaryButton`, `CueSecondaryButton`, `CueCard`, `CueTextField`; use these instead of building from scratch

---

## 6. Exact Prompt You Can Give Your AI UI Agent

Copy-paste this when handing off a UI task:

```
You are updating the Cue iOS app (SwiftUI). All design authority is in the repo.

1. Read docs/AI_UI_AGENT_BRIEF.md and docs/PROFESSIONAL_DESIGN_SPEC.md. For the screen(s) I'm asking you to change, also read docs/UI_POLISH_SPEC.md and, if it's onboarding, docs/ONBOARDING_VISUAL_SPEC.md.

2. Use only design tokens from Cue/Cue/Design/: CueColors, Font.Cue, CueLayout, CueElevation. Use CuePrimaryButton, CueCard, CueTextField, .cueRaised(), .cueFloating(), CueCardPressStyle. Do not introduce new colors, font sizes, shadows, or spacing values.

3. Every screen must have: a clear hero/headline zone, a content zone (cards/lists with elevation), and an action zone (one primary CTA). Use CueLayout for all spacing and max content width (420pt) where the spec says composed layout.

4. Match the quality of RoleSelectView and BriefCardView: elevation, typography scale, press feedback, and (for onboarding) OnboardingBackgroundView and trust footer.

5. Empty and loading states: headline + one line + CTA or skeleton; never raw "No X yet" or a lone spinner.

6. Money moments (earnings, payout, approval): hero number or status in success color (lime), one short sentence, single success animation (pulse or checkmark). No wall of text; no burying the amount.

7. Motion: Use TimelineView or repeating animation for slow background motion (orbs, gradient); cycle 15–40s. Staggered list/card entrance: fade + 8–14pt offset, 0.15–0.3s delay between items, spring or ease-out. Every tappable: press scale 0.97–0.98 with spring.

8. No large flat black: every full-screen or large area has at least one of gradient wash, subtle radial, or moving layer.
```

**More prompt lines** (motion, gradients, empty states, onboarding, money moments): see `docs/RESEARCH_UI_LOOK_AND_FEEL.md` §3.4.

---

## 7. Checklist for the Agent (Before Submitting UI Changes)

- [ ] Used only `CueColors`, `Font.Cue`, `CueLayout`, `CueElevation` and components in `Design/`
- [ ] Cards use `.cueRaised()` or `.cueFloating()` (or `CueCard`); no custom shadows
- [ ] Buttons use `CuePrimaryButton` / `CueSecondaryButton` or same min height (56pt) and press scale (0.97)
- [ ] Screen has hero zone, content zone, action zone; max content width 420pt where specified
- [ ] Empty/loading states have headline + line + CTA or skeleton
- [ ] Onboarding screens use `OnboardingBackgroundView` and trust footer where applicable
- [ ] Money moment screens use success color (lime), hero amount/status, and short success animation
- [ ] No large flat black areas; Reduce Motion still leaves screens readable

Apply this system **everywhere** — onboarding, creator home, talent feed, modals, empty states. Consistency is what makes it look deliberately designed.
