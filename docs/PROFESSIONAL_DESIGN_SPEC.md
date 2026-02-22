# Cue — Professional Design Spec: “A Lot of Time and Thought”

**Goal:** The app must feel **deliberately designed** — like a premium product where every screen has clear hierarchy, consistent depth, and considered details. Nothing should feel “simple” or template-like.

Use this with `DESIGN_SYSTEM.md` and `UI_POLISH_SPEC.md`. This doc defines the **depth and rigor** the coding agent must apply everywhere.

---

## 1. Design language in one sentence

**Editorial dark, product-grade:** Confident typography and strict spacing on a dark canvas, with a clear elevation system and one accent used with restraint. Feels like a serious tool, not a generic app.

---

## 2. Elevation system (depth that reads as intentional)

**Rule:** Every surface has a defined “level.” Same level = same treatment everywhere. No one-off shadows or opacities.

| Level | Name | Use | Background | Shadow | Border (optional) |
|-------|------|-----|------------|--------|-------------------|
| 0 | Base | Screen background | `surface` #0D0D0D | — | — |
| 1 | Raised | Cards, inputs, list rows | Lighter than base (e.g. 0.11–0.13 white) | One soft shadow: 0.25–0.4 opacity black, radius 16–24, y 4–8. | 0.5pt stroke, accent or gray 12–18% opacity |
| 2 | Floating | Modals, dropdowns, FABs | Same as Raised or slightly brighter | **Two shadows:** (1) ambient: 0.2 opacity, radius 32, y 8; (2) key: 0.15 opacity, radius 12, y 4. | Same |
| 3 | Overlay | Toasts, tooltips | Dark with slight blur or 0.95 opacity dark | Stronger shadow so it clearly floats above 2. | — |

**Implementation:** Define tokens in code (e.g. `CueElevation.raised`, `CueElevation.floating`) so every card and modal uses the same shadow and background. Never hand-tune shadow values per screen.

**Card edge detail:** On Raised/Floating cards, a **very subtle inner highlight** at the top edge (white 3–5% opacity, 1pt) gives a “lit from above” feel and reads as premium. Optional but recommended.

---

## 3. Typography scale (purpose-driven, not random)

**Rule:** Every text style has a **role**. Use the scale consistently; no ad-hoc 15pt or 21pt.

| Token | Size | Weight | Role | Line height (approx) | When to use |
|-------|------|--------|------|----------------------|-------------|
| Display | 40–44pt | Bold | Hero moment, one per app (e.g. splash) | 1.1 | Rare; onboarding hero only |
| Hero | 32–34pt | Bold | Screen title or single big statement | 1.15 | One per screen max |
| Title 1 | 24–26pt | Semibold/Bold | Section title, modal title | 1.2 | Section headers |
| Title 2 | 20–22pt | Semibold | Card title, list header | 1.25 | Cards, list sections |
| Title 3 | 17–18pt | Semibold | Subsection | 1.3 | Dense UIs |
| Body | 16–17pt | Regular/Medium | Main copy | 1.4–1.5 | Paragraphs, descriptions |
| Body emphasis | 16pt | Semibold | Buttons, key numbers (pay, earnings) | 1.35 | CTAs, metrics |
| Callout | 15pt | Regular | Secondary but prominent | 1.35 | Supporting blocks |
| Caption 1 | 14pt | Regular | Metadata, labels | 1.3 | Timestamps, labels |
| Caption 2 | 12pt | Regular | Legal, hints | 1.25 | Footer, disclaimers |

**Letter-spacing (tracking):** Slightly tight on Display/Hero (-0.5 to -0.3) for an editorial look. Default for body. Slightly loose on Caption 2 (0.2) for legibility at small size.

**Implementation:** One place (e.g. `CueFonts`) with all tokens. Use semantic names (`.title1`, `.body`, `.caption1`) everywhere — no raw `.font(.system(size: 17))` in views.

---

## 4. Spacing and grid (nothing arbitrary)

**Base unit:** 4pt. All spacing is a multiple of 4: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64.

| Token | Value | Use |
|-------|--------|-----|
| xxs | 4 | Icon–label gap, tight inline |
| xs | 8 | Inline elements, list item padding |
| sm | 12 | Related controls, card internal |
| md | 16 | Default block padding, form fields |
| lg | 20–24 | Screen horizontal padding, section internal |
| xl | 32 | Between sections |
| xxl | 40–48 | Between major areas, before CTA |

**Screen composition:**  
- Horizontal padding: **24pt** (lg) on phones; up to 32pt on larger devices.  
- Vertical rhythm: Section spacing **32pt** (xl). Between related items **12–16pt**.  
- **Max content width:** On iPad/large phone, cap main content at 440–480pt and center so the layout doesn’t stretch into a single wide column. Feels composed.

**Implementation:** Single source (e.g. `CueLayout` or `CueSpacing`) with named constants. Use tokens in every view.

---

## 5. Component specs (cards, buttons, inputs)

### Cards (Raised / Floating)

- **Background:** Elevation token (Raised or Floating).  
- **Corner radius:** 20pt (cards), 16pt (smaller blocks). Consistent.  
- **Padding:** 20pt internal (lg).  
- **Shadow:** From elevation system (one or two layers).  
- **Border:** 0.5pt, accent 12–18% or gray 15%.  
- **Optional:** 1pt inner highlight at top edge (white 3–5%).  
- **Press:** Scale 0.98, spring; no change to shadow on press (keep it subtle).

### Primary button

- **Height:** 56pt (not 52). Feels substantial.  
- **Background:** Solid accent or **very subtle** vertical gradient (accent → accent at 0.9 brightness) so it’s not flat.  
- **Corner radius:** 14pt.  
- **Label:** Body emphasis, white; sentence case.  
- **Shadow:** Optional: 0.15 opacity black, radius 8, y 4 so button feels raised.  
- **Press:** Scale 0.97, opacity 0.94; spring.

### Secondary button / text button

- Outline: 1pt stroke, accent 40–50% opacity; or text-only with accent.  
- Same height 44–48pt if outline; tap target at least 44pt.  
- Same press feedback as primary (scale).

### Text fields

- **Background:** Raised elevation.  
- **Corner radius:** 12pt.  
- **Border:** Default 0.5pt gray 20%; **focus:** 1pt accent 50% or soft glow (accent 20% blur 8pt).  
- **Placeholder:** Muted (e.g. 0.5 opacity secondary).  
- **Padding:** 16pt; height min 52pt for single line.  
- **Cursor / selection:** Accent.

---

## 6. Screen composition (every screen has structure)

**Rule:** A screen is not “a list of components.” It has **zones.**

1. **Chrome / status** (optional): Top bar, nav, or a thin “Cue” bar. Consistent height (44–56pt).  
2. **Hero / headline zone:** One clear headline (Hero or Title 1) and optional subline. Enough margin so it doesn’t touch the next block.  
3. **Content zone:** Cards or list; uses elevation and spacing tokens.  
4. **Action zone:** Primary CTA anchored at bottom or clearly as the last element; 24–32pt padding from content above.

**Onboarding role select, applied:**  
- No chrome needed; first screen.  
- Hero zone: Logo “Cue” (Title 1 or custom), then “Your cue to create.” (Hero), then subline (Body). Spacing: 16pt between logo and hero, 8pt between hero and subline; 32pt below subline before cards.  
- Content zone: Two role cards, 20pt apart; cards use Raised elevation, icon + text + chevron.  
- Footer zone: “Secure sign-in · Terms · Privacy” (Caption 2), 40pt from bottom, 24pt from cards.  
- **Max width:** Content (cards + padding) max 400pt, centered, so on large screens it doesn’t stretch.

**Empty states:** Never raw “No X yet.” Use: (1) Short headline (Title 2 or Title 3), (2) One line of explanation (Body or Caption 1), (3) Optional illustration or icon, (4) One CTA. Same spacing and elevation rules.

**Loading:** Skeleton that matches the content shape (cards or list rows), or a single centered indicator with a short label (Caption 1). No spinner alone in the middle of empty space.

---

## 7. Motion (consistent and purposeful)

- **Duration:** Micro (tap): 0.2–0.25s. Enter/exit: 0.35–0.45s. Screen transition: 0.4–0.5s.  
- **Easing:** Spring for UI (response 0.35–0.4, damping 0.75–0.85). Ease-out for entrances.  
- **What to animate:** Press states, sheet present/dismiss, list insert/remove, tab change.  
- **What not to:** Decorative motion on every tap; long loops; bouncy overshoot on serious flows.

---

## 8. Color (restraint)

- **Base:** Near-black only. One primary accent (electric blue).  
- **Neutrals:** Text primary (white), text secondary (0.65–0.75 opacity), border/divider (0.12–0.2 white or accent).  
- **Reserve:** Success (lime) and CTA (pink) for reward and paywall only.  
- **Surfaces:** From elevation (slightly lighter than base for Raised/Floating). No random gray values.

---

## 9. Checklist for the coding agent (professional feel)

- [ ] **Elevation:** Implement `CueElevation` (or equivalent) with Raised and Floating: background + one or two shadows + optional 0.5pt border. Use on every card and modal.  
- [ ] **Typography:** Full scale in one place (Display, Hero, Title 1–3, Body, Callout, Caption 1–2). Use only these tokens; add line spacing and tracking where specified.  
- [ ] **Spacing:** 4pt grid; named tokens (xs, sm, md, lg, xl, xxl). Screen padding 24pt; section spacing 32pt.  
- [ ] **Max content width:** Onboarding and key flows: content area max 440pt (or 400pt for role select), centered.  
- [ ] **Cards:** Raised elevation, 20pt radius, 20pt padding, optional top-edge highlight. Buttons: 56pt height, optional subtle gradient or shadow.  
- [ ] **Inputs:** Focus state (border or glow); placeholder muted; min height 52pt.  
- [ ] **Screen zones:** Every screen has headline zone, content zone, and action zone. Empty and loading states designed (headline + line + CTA or skeleton).  
- [ ] **Motion:** Spring for taps and transitions; durations 0.2–0.5s; no decorative overload.

Apply this system **everywhere** — onboarding, creator home, talent feed, modals, empty states. Consistency is what makes it look like a lot of thought went in.
