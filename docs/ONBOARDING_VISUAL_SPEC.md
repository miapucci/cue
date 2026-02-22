# Cue — Onboarding Visual Spec: Premium, Professional, Dynamic

**Goal:** Onboarding should feel **premium, legitimate, and professional** — like a real product people trust. Icons and structure stay; the background can be pitch black **if** there are **moving elements and dynamic motion** so it doesn’t feel static or basic.

**Fix:** Pitch black + subtle moving elements (drifting orbs, slow gradient); clear brand; role cards with icons; trust footer; staggered entrance animations; one primary action per screen.

---

## 1. Background — Pitch Black + Moving Elements

**Rule:** Either (a) warm gradient (see below) **or** (b) **pitch black with dynamic elements**. Pure flat black with no motion feels basic; add subtle motion for a professional, alive feel.

### Option A: Pitch black + moving elements (recommended for “professional”)

- **Base:** Solid `#0D0D0D` (surface). No gradient required.
- **Moving layer:** Subtle, continuous motion so the screen feels alive but not distracting.
  - **Drifting orbs:** 3–5 soft, blurred circles (primaryAccent at 3–6% opacity), large (150–300pt), moving slowly (20–40s per cycle or gentle drift). Positions driven by time; use `TimelineView(.animation)` or repeating animation. Reference: Linear, Stripe, premium SaaS landings.
  - **Slow gradient shift:** One or two radial gradients whose center or opacity changes very slowly (15–30s). Low opacity (4–8% accent).
- **Professional = slow and minimal:** No fast movement, no flash. Motion should be barely noticeable at a glance but obvious when you look. Keeps the app feeling high-end, not playful or game-like.

### Option B: Static warm gradient (no motion)

- **Radial:** Center = `primaryAccent.opacity(0.06–0.10)`, outer = surface. Radius ~1.2–1.5× screen height.
- **Linear:** Top slightly lighter than bottom (e.g. 0.10 → surface).

**Implementation:** Reusable `OnboardingBackgroundView`: base surface → optional moving orbs / gradient layer. Content on top. Use the same view on every onboarding screen.

---

## 2. Brand presence — Logo / wordmark

**Every onboarding screen should show “Cue” clearly.** So users know which app they’re in and it feels like a real product.

- **Role select:** Logo or wordmark at top (above headline). Not tiny — medium size, confident.
- **Auth:** Same. “Cue” then “Get started.”
- **Profile / steps:** Optional smaller logo in nav or at top; at least a clear “Cue” or step title.

**Logo options if no asset:**

- Styled text: **“Cue”** in a bold, slightly rounded font (e.g. 28–32pt), white or primaryAccent. Optional: small icon (e.g. play or clapper) next to it.
- If you have an app icon asset, use a 44–56pt version at top of role select and auth.

---

## 3. Role select — Not “just two buttons”

**Current risk:** Two identical-looking cards with only text. Feels like a form, not a choice.

**Do instead:**

- **Layout:** [Logo] → [Headline] → [Subline] → [Role card 1] → [Role card 2] → [Footer].
- **Headline:** “Your cue to create.” (existing).
- **Subline:** One short line under it, e.g. “Find talent or get cast. Pick your side.” Gives context without clutter.
- **Role cards:**
  - **Icon or visual:** Each card has a clear left-aligned icon (SF Symbol or simple custom). e.g. Creator = `video.badge.plus` or `play.rectangle.fill`; Talent = `person.crop.rectangle` or `person.wave.2.fill`. Icon in primaryAccent or white, 24–28pt, in a soft circular or rounded-square background (accent 15–20% opacity).
  - **Title + subtitle:** Same as now; ensure hierarchy (title bold, subtitle caption).
  - **Card treatment:** Elevated surface, soft shadow, 16–20pt corner. Optional: very subtle gradient stripe along left edge (primaryAccent 20% opacity) or a soft glow on the icon container so each card has a clear visual anchor.
  - **Tap:** Same press scale (0.98) and spring.
- **Footer:** One line that adds trust: “Secure sign-in” and/or “By continuing you agree to our Terms and Privacy.” Link Terms & Privacy. Small, muted (caption), but visible. So it doesn’t feel like a random dark screen with two buttons.

**Spacing:** Generous padding (20–24pt). 24–32pt between headline block and cards; 16–20pt between the two cards.

**Entrance animation:** Role cards (and headline block) should **not** pop in instantly. Use staggered appear: cards fade in with a slight vertical offset (e.g. 8–12pt), 0.2–0.35s delay between each. Duration ~0.4s, spring or ease-out. Logo/headline can appear first (0.1–0.2s), then cards. Feels intentional and professional.

---

## 4. Dynamic / Moving Elements (Professional)

- **Purpose:** Make the screen feel alive and premium without being flashy. Motion = quality.
- **Where:** Onboarding background (drifting orbs or slow gradient). Optional: very subtle pulse on logo (opacity 0.92 ↔ 1.0 over 2–3s, repeat) — use sparingly.
- **Speed:** Slow. 20–40s for orb cycles; 15–30s for gradient shift. No motion under ~10s cycle length.
- **Opacity:** Accent orbs 3–6%; gradient 4–8%. Never loud.
- **Avoid:** Fast particles, bouncy animations, rapid color changes, anything that feels like a game or ad.

---

## 5. Auth screen — Same warmth + trust

- **Background:** Same as role select (reuse `OnboardingBackgroundView`).
- **Logo:** “Cue” at top (or logo mark).
- **Headline:** “Get started” (existing).
- **Trust line:** One short sentence under the headline, e.g. “Sign in securely. We never post without your permission.” or “Your data stays yours.” Muted caption style. This directly counters “is this a scam?”.
- **Sign in with Apple:** Use the system control (black or white per Apple HIG). Ensure it’s clearly the primary action (full width, good height).
- **Continue with email:** Secondary; text or outline style.
- **Footer:** Same as role select: “Terms · Privacy” and optionally “Secure sign-in.” Small, visible.

---

## 6. Profile and step screens (Creator / Talent)

- **Background:** Same warm gradient (reuse onboarding background). **No flat black.**
- **Side-specific value (optional):** On the first screen after role select (e.g. step 1 or dashboard nudge), use one line per role: Creator — "Post briefs. Get the video." / Talent — "Get cast. Get paid."
- **Progress:** Show where they are: “Step 1 of 3” or 3 dots (filled for current). So it feels like a guided flow, not an endless form.
- **Section the form:** One clear section title (e.g. “Introduce yourself”), then fields. Breathing room between sections (24–32pt).
- **Trust:** Optional short line under section title, e.g. “Talent will see this when you post a brief.” (existing copy is fine.)

---

## 7. Copy and tone

- **Headlines:** Short, confident. “Your cue to create.” “Get started.” “Introduce yourself.”
- **Sublines:** One sentence max. Explain why or what happens next.
- **Trust:** “Secure sign-in.” “We never post without your permission.” “By continuing you agree to Terms and Privacy.” Visible but not loud.
- **Buttons:** Sentence case; action-oriented. No all-caps.

---

## 8. What to avoid

- **Pitch black only:** Always add gradient or subtle lift (see §1).
- **No brand:** Every onboarding screen should show “Cue” (or logo).
- **Two identical text blocks:** Role cards need an icon or visual so the choice feels intentional.
- **No trust cues:** At least one “secure” or “terms” line so it doesn’t feel anonymous.
- **Cramped layout:** Use 20–24pt padding and 24–32pt between major blocks.
- **Tiny footer links:** Terms/Privacy should be readable (caption size, not smaller).

---

## 9. SwiftUI implementation checklist (for coder)

- [ ] Add **OnboardingBackgroundView**: base `surface` (pitch black), then **moving layer** — e.g. 3–5 drifting orbs (primaryAccent 3–6%, large, blurred, 20–40s cycle) or slow gradient shift. Use `TimelineView(.animation)` or repeating animation. Use on every onboarding screen.
- [ ] **Role select:** Logo, headline, subline; role cards with SF Symbol icons; **staggered entrance** (cards fade in with slight offset, 0.2–0.35s delay between each); footer “Secure sign-in · Terms · Privacy”.
- [ ] **Auth:** Use same background; add “Cue” at top; add one trust line under “Get started”; keep Apple button and Terms/Privacy in footer.
- [ ] **Creator/Talent profile and steps:** Use same onboarding background; add step indicator (e.g. “Step 1 of 3” or dots).
- [ ] Ensure all onboarding screens use the shared background (pitch black + moving elements or gradient). **No static flat black with no motion.**

---

## 9. Reference

- **Strategy / copy:** `docs/ONBOARDING_FLOWS.md`
- **Colors / components:** `docs/DESIGN_SYSTEM.md`, `docs/UI_POLISH_SPEC.md`
