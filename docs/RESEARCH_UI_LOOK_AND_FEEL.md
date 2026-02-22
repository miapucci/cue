# Cue — Research: How Our Product Should Look & UI Approach

**Date:** Feb 2025  
**Purpose:** Research-backed guidance for Cue’s look and feel, aligned with existing specs. Use this to update `AI_UI_AGENT_BRIEF.md`, `PREMIUM_POLISH_ADDENDUM.md`, `UI_POLISH_SPEC.md`, and UI agent prompts.

---

## 1. Research Summary (with citations)

### 1.1 Premium dark-mode mobile UI (2024–2025)

- **Layered darks, not pure black:** Premium dark UIs use distinct dark grays for hierarchy and reduce eye strain; pure black (#000) for large areas reads as harsh. [LogRocket, Digital Silk]
- **Desaturated accents:** Refined apps keep brand/CTA saturation and mute secondary tones (e.g. 60–75% saturation) so the UI feels intentional, not “neon everywhere.” [Digital Silk]
- **Contrast & readability:** Body text should meet or exceed 7:1 contrast (Apple HIG); off-white (#F0F0F0) on dark is often preferred over pure white for large blocks. [LogRocket, Mahan Rasouli]
- **Depth via materials:** Liquid Glass / frosted materials and elevation create hierarchy; shadows and overlays used sparingly and consistently. [Apple HIG, LiquidGlassReference]
- **Typography as structure:** In dark mode, weight, line height, and letter spacing need extra care so type doesn’t feel cramped or same-weight. [Nate Bal, Mahan Rasouli]
- **Spacing and states:** Generous padding and clear interactive states (hover/focus/active) signal craft; tight spacing reads as unfinished. [Digital Silk]
- **Accessibility as premium:** Supporting reduced motion, increased contrast, and reduced transparency without breaking the look signals maturity. [LiquidGlassReference, Amit Garg]

### 1.2 Onboarding for two-sided apps (creators vs talent)

- **Role selection first:** Present “Creator” vs “Talent” (or supply vs demand) on the first screen with large, thumb-friendly targets (min 44pt) and clear labels. [Journeyh, Userpilot, VWO]
- **Side-specific value:** After role pick, tailor copy and proof: creators → earnings, tools, demand proof; talent → quality matches, speed, “get cast.” [Journeyh]
- **Progressive disclosure:** 3–7 steps; avoid long forms; use progress (e.g. “Step 1 of 3”), micro-wins (“Profile 80% complete”), optional gamification. [Userpilot, DesignerUp]
- **Trust early:** “Secure sign-in,” Terms/Privacy, and one line that counters “is this a scam?” improve perceived legitimacy. [Eleken, Cue already does this]
- **First action nudge:** End onboarding with a clear first action (e.g. “Post your first brief” / “Browse briefs”) and a personalized home. [Userpilot, VWO]

### 1.3 Creator / talent / gig apps — hierarchy, CTAs, “money moments”

- **Hierarchy:** Hero or featured content, then categories/list; primary CTA is obvious (e.g. “Post brief,” “Apply”). Left or top nav for creator tools (briefs, submissions, earnings). [Patron/Upwork/Fiverr patterns, Brianyom, SaaS Factor]
- **Money moments:** Payment and earnings need **upfront transparency** (rates, fees, when paid), **real-time or near-real-time** updates, and **celebratory but not childish** feedback (clear numbers, success color, short animation). [Howl case study, Monzo-style insights]
- **Trust & premium:** Transparency (no hidden fees), consistent micro-interactions, professional palette, high-res media, and minimal clutter. [SaaS Factor, Interaction Design Foundation]

### 1.4 SwiftUI & iOS — modern, polished (motion, gradients, depth)

- **Motion:** Spring-based (response ~0.35–0.45, damping ~0.75–0.85); TimelineView for slow, continuous ambient motion (e.g. 15–40s cycles); gesture feedback in &lt;50ms. [Apple HIG, Create with Swift, Awesomic]
- **Gradients & depth:** Layered gradients (e.g. in Canvas) and, where applicable, materials (e.g. Liquid Glass on iOS 26) for depth; accent used in small, intentional pops. [Create with Swift, Pixelmatters]
- **Micro-interactions:** SF Symbols 5 animations; consistent spring on press; success/earnings get a distinct treatment (color + optional pulse/particle). [Apple What’s New, Interaction Design Foundation]

---

## 2. Comparison to Cue’s Current Approach

### Aligned (keep doing)

| Area | Cue spec | Research |
|------|----------|----------|
| **Background** | Near-black `#0D0D0D`, not pure black | Layered darks preferred; Cue is aligned |
| **Accent restraint** | Primary accent + lime/pink only for CTAs and rewards | Desaturated/secondary restraint; neon for moments |
| **Elevation** | `.cueRaised()` / `.cueFloating()`, no one-off shadows | Consistent depth system |
| **Typography** | Full scale (Hero → Caption), 4pt grid, SF Pro Rounded option | Typography as structure; hierarchy |
| **Spacing** | CueLayout, 4pt grid, screen/content zones | Generous spacing = premium |
| **One CTA per screen** | Hero → Content → Action | Single primary action |
| **Onboarding** | Role select first, OnboardingBackgroundView, trust footer, staggered entrance | Role first, trust, progressive disclosure |
| **Cards** | 20pt radius, media + bottom gradient, pay + deadline on card | Media-first, money visible, gradient for text |
| **Motion** | Staggered list/card entrance, press scale 0.97–0.98, spring | Spring, purposeful motion |
| **Success** | successMoney (lime) + pulse/confetti | Money moment = clear + celebratory |

### Gaps to add or strengthen

| Gap | Research says | Suggested addition |
|-----|----------------|-------------------|
| **Accessibility** | Contrast 7:1+, reduced motion, high contrast mode | Add one “Accessibility” subsection: test with Dynamic Type, Reduced Motion, high contrast; keep hierarchy and motion fallbacks. |
| **Body text on dark** | Off-white (#F0F0F0) can be easier on eyes than pure white for long copy | In DESIGN_SYSTEM or CueColors: optional `textBody` as slight off-white for long paragraphs. |
| **Liquid Glass / materials** | Materials add depth and feel “no config” premium | In PREMIUM_POLISH or UI_POLISH: optional `.ultraThinMaterial` (dark tint) for key cards (e.g. role select, top of feed); use sparingly. |
| **Side-specific onboarding copy** | Creators need “earnings, demand”; talent need “get cast, fast” | In ONBOARDING_VISUAL_SPEC or ONBOARDING_FLOWS: one line per role after selection (e.g. Creator: “Post briefs. Get the video.” Talent: “Get cast. Get paid.”). |
| **“Money moment” as named pattern** | Transparency + real-time + celebration | Name it in UI_POLISH_SPEC / AI_UI_AGENT_BRIEF: “Money moment” = visible amount + success color + short animation; never bury payout info. |
| **TimelineView for ambient motion** | Slow cycles (15–40s) read as premium | In PREMIUM_POLISH: explicitly recommend `TimelineView(.animation)` or equivalent for orbs/slow gradients (you already do orbs; make the technique explicit). |

### Contradictions / tensions

- **Pure black:** Your ONBOARDING_VISUAL_SPEC allows “pitch black” with moving elements. Research prefers layered darks. **Recommendation:** Keep pitch black only when paired with moving layer (orbs/gradient); avoid flat static black. No change needed if you already require motion when black.
- **Neon:** You already restrict lime/pink to moments; research agrees. No change.

---

## 3. Actionable Additions for Docs & Prompts

### 3.1 Bullets to add to `AI_UI_AGENT_BRIEF.md` (e.g. new subsection “Accessibility & polish”)

- **Contrast:** Body text and key UI meet contrast expectations (e.g. 7:1 for body). Use design tokens for text; avoid low-contrast gray-on-gray.
- **Motion fallbacks:** Where motion is used (staggered entrance, orbs), ensure the app still reads clearly with Reduce Motion enabled (e.g. no motion or instant show).
- **Money moments:** Any screen that shows earnings, payout, or “payment released” uses the success color (lime), clear typography for the amount, and a short success animation (pulse or check). Never show payout as plain body text only.

### 3.2 Bullets to add to `PREMIUM_POLISH_ADDENDUM.md`

- **Ambient motion:** Use `TimelineView(.animation)` (or equivalent) for drifting orbs and slow gradient shifts so motion is continuous and smooth, not keyframe-only.
- **Materials (optional):** For one or two hero surfaces (e.g. role select card, top feed card), consider `.ultraThinMaterial` with dark tint instead of solid fill, for a glass-like depth. Use sparingly.
- **No large flat black:** Any full-screen or large area that’s a single solid color should have at least one of: gradient wash, subtle radial, or moving layer. No big flat black rectangles.

### 3.3 Bullets to add to `UI_POLISH_SPEC.md`

- **“Money moment” pattern:** When the user sees earnings, payout, or approval: (1) amount or status is the visual hero, (2) success color (lime) is used for the positive state, (3) a short animation (pulse, checkmark draw, or light confetti) plays once. Keep copy short (“Payment released.”).
- **Body text on dark:** For long paragraphs, prefer a slight off-white (e.g. `#F0F0F0` or `white.opacity(0.95)`) over pure white to reduce glare; keep headings at full white or accent where needed.

### 3.4 Specific prompt lines for the UI agent

Copy-paste these into prompts when briefing the UI agent:

**Motion:**
- “Use TimelineView or repeating animation for any slow background motion (orbs, gradient shift). Cycle length 15–40 seconds. No motion under 10s for ambient elements.”
- “Every tappable card and primary button must have press scale (0.97–0.98) with spring. No instant pop; no linear animation for interactions.”
- “Staggered list/card entrance: fade + 8–14pt vertical offset, 0.15–0.3s delay between items, duration ~0.35–0.45s, spring or ease-out.”

**Gradients:**
- “Cards: at least one gradient (soft wash, left-edge stripe, or icon container). Media cards: always bottom gradient (transparent → black 70–80%, 40–80pt height) for text legibility.”
- “No large area of a single solid color with no gradient, shadow, or motion. Hero and empty states get a subtle radial or linear accent (3–6% opacity).”

**Empty states:**
- “Empty state = (1) short headline (Title 2/3), (2) one line explanation (Body/Caption), (3) optional icon/illustration, (4) one CTA. Never raw ‘No X yet.’ alone.”

**Onboarding:**
- “Every onboarding screen uses OnboardingBackgroundView (surface + moving orbs or slow gradient). Role select: role cards with icon, staggered entrance, trust footer. After role pick, first content screen can use one side-specific line (e.g. Creator: ‘Post briefs. Get the video.’ / Talent: ‘Get cast. Get paid.’).”

**Money moments:**
- “Earnings, payout, or approval screens: hero number or status in success color (lime), one short sentence, and a single success animation (pulse or checkmark). No wall of text; no burying the amount.”

### 3.5 “Don’t do this” / anti-patterns to add to guidance

Add to **“What Makes It Look Bad”** (AI_UI_AGENT_BRIEF) or **“Anti-patterns”** (UI_POLISH_SPEC):

- **Large flat black areas** with no gradient, shadow, or motion — feels unfinished.
- **Pure white (#FFFFFF) for long body paragraphs** on dark — use slight off-white or token for readability.
- **No press feedback** on buttons or cards — every tappable must have scale (and optionally opacity) on press.
- **Money or payout hidden** in generic body text with no emphasis or success treatment — money moments need hierarchy + color + animation.
- **Instant pop-in** for lists or cards — use staggered entrance so the screen feels composed.
- **Fast or bouncy motion** for ambient elements (orbs, gradients) — keep cycle length ≥15s; no game-like bounce on serious flows.
- **Multiple competing CTAs** on one screen — one primary action; secondary is clearly de-emphasized.
- **Introducing new colors or shadows** outside CueColors and CueElevation — breaks the system.

---

## 4. Recommended Next Steps

1. **Update `docs/AI_UI_AGENT_BRIEF.md`**  
   - Add the “Accessibility & polish” bullets (§3.1).  
   - Extend “What Makes It Look Bad” with the anti-patterns in §3.5.  
   - In the “Exact Prompt” section, append the prompt lines from §3.4 (or link to this doc).

2. **Update `docs/PREMIUM_POLISH_ADDENDUM.md`**  
   - Add the TimelineView/ambient-motion bullet and the “no large flat black” rule.  
   - Optionally add the materials (glass) note for hero surfaces.

3. **Update `docs/UI_POLISH_SPEC.md`**  
   - Add the named “Money moment” pattern and the body-text-on-dark note.  
   - Add the same anti-patterns to the anti-patterns table if not already covered.

4. **Update onboarding flows**  
   - In `ONBOARDING_VISUAL_SPEC.md` or `ONBOARDING_FLOWS.md`, add one side-specific value line for Creator vs Talent on the first screen after role select (e.g. on the first step or dashboard nudge).

5. **Optional: design tokens**  
   - In `CueColors` (or DESIGN_SYSTEM), add an optional `textBodyLong` or similar at ~#F0F0F0 for paragraph text if you want to standardize off-white.

6. **Hand off to UI agent**  
   - Use the “Exact Prompt” in AI_UI_AGENT_BRIEF plus the new prompt lines from §3.4 when assigning screens (especially onboarding, feed cards, and any earnings/payout screens).

This keeps your current “Spotify × Cash App × CRED” direction while filling gaps from 2024–2025 practice and giving you concrete copy for specs and prompts.
