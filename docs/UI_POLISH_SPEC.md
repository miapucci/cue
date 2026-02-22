# Cue — UI Polish Spec: Premium, Fun, Modern

**Goal:** The app should feel like **Spotify meets Cash App meets CRED** — dark, confident, a little playful, and premium. Not a 2000s form app. Every screen should feel intentional and satisfying to use.

Use this doc together with `DESIGN_SYSTEM.md`. This doc is the **visual sauce** for the coder: concrete numbers, patterns, and SwiftUI guidance so the UI looks and feels great.

---

## 1. What “Premium” and “Fun” Mean Here

| Premium means | Fun means |
|---------------|-----------|
| Depth (layers, subtle shadow, glow), not flat gray boxes | Personality in type and micro-copy; small delights on tap and success |
| Restraint (neon only on CTAs/rewards); lots of breathing room | Motion that feels alive (spring, not linear); cards that respond to touch |
| Clear hierarchy (one hero element per screen; type that guides the eye) | Swipe feed that feels like “what’s next?” not a list of chores |
| Surfaces that feel tactile (rounded corners, soft edges, optional glass) | Earnings and approvals that *feel* good (color, animation, copy) |

**Anti-patterns (what makes it look 2000s):**
- Flat rectangles with a 1pt gray border and no depth
- All content the same visual weight (no clear headline vs body vs caption)
- Buttons that don’t react to press
- Cramped layout; no white (negative) space
- System default 12pt corner radius everywhere
- No motion anywhere
- Placeholder media as a gray box with text in the middle
- Large flat black areas with no gradient, shadow, or motion
- Pure white (#FFFFFF) for long body paragraphs on dark — use slight off-white or token
- No press feedback on buttons or cards — every tappable must have scale (and optionally opacity) on press
- Money or payout hidden in generic body text with no emphasis or success treatment
- Instant pop-in for lists or cards — use staggered entrance
- Fast or bouncy motion for ambient elements (orbs, gradients) — cycle length ≥15s
- Multiple competing CTAs on one screen — one primary action
- Introducing new colors or shadows outside the design system

---

## 2. Typography Scale & Hierarchy

**Problem:** If everything is “bold” or “medium” at similar sizes, nothing feels like the hero. Use a clear scale so each screen has one clear “thing” you see first.

**Scale (use these consistently):**

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| Hero | 34pt | Bold | Screen title or single big message (e.g. “Your cue to create.”) |
| Title | 22–24pt | Bold / Semibold | Section or card title |
| Title 2 | 18–20pt | Semibold | Secondary headings |
| Body | 16–17pt | Medium / Regular | Main copy |
| Body emphasis | 16pt | Semibold | Buttons, key numbers (pay rate, earnings) |
| Caption | 14pt | Regular | Supporting text, metadata |
| Caption small | 12pt | Regular | Timestamps, labels |

**Tips:**
- Prefer **SF Pro Rounded** for a friendlier, less “system” feel (use `.rounded()` or custom font if bundled). Fallback: system with `.weight(.medium)` for body.
- **Line height:** Add 2–4pt extra for body (e.g. `lineSpacing: 4`) so blocks of text don’t feel tight.
- **Letter spacing:** Slightly tight on big headlines (-0.5 to -0.3) can feel more editorial; default for body.
- **Body text on dark:** For long paragraphs, prefer a slight off-white (e.g. `#F0F0F0` or `white.opacity(0.95)`) over pure white to reduce glare; keep headings at full white or accent where needed.

**SwiftUI:** Extend `Font.Cue` with the above sizes and use them everywhere instead of ad‑hoc `.font(.system(...))`.

---

## 3. Spacing & Rhythm

**Grid:** 4pt base; use 8, 12, 16, 20, 24, 32, 40, 48. No random 14 or 18 unless it’s half-grid for alignment.

**Screen-level:**
- Horizontal padding: **20pt** (or 24pt on larger devices). Never flush to edge.
- Vertical spacing between sections: **24–32pt**. Between related elements: **12–16pt**.
- Let screens **breathe:** avoid stacking more than 4–5 dense blocks; use spacing to group.

**Within cards:**
- Internal padding: **16–20pt**. Between card content elements: **8–12pt**.

**One primary action per screen:** The main button or card should be the only “loud” element. Everything else supports it.

---

## 4. Corners, Depth & Surfaces

**Corners:**
- **Cards:** 16–20pt radius (not 8 or 12). Feels soft and modern.
- **Buttons:** 14–16pt radius; same as cards so the language is consistent.
- **Inputs:** 12–14pt radius.
- **Small chips/tags:** 8pt or full pill (capsule).

**Depth (avoid flat “one gray box”):**
- **Card background:** Not pure `surface.opacity(0.6)`. Use a **slightly elevated** surface: e.g. `Color(white: 0.12)` or `surface` blended with a tiny bit of white (e.g. 6–8% white). So it’s clearly “on top of” the screen background.
- **Border:** If you use a border, make it subtle: `primaryAccent.opacity(0.15–0.25)` or a very dark gray, **0.5–1pt**. Or skip border and use **shadow** for depth (see below).
- **Shadow (cards):** Soft, large radius, low opacity. Example: `color: .black.opacity(0.35)`, `radius: 20`, `x: 0`, `y: 8`. Only one layer; don’t stack multiple shadows. Use to separate card from background.
- **“Glass” option:** For key cards (e.g. role select, or top of feed), consider `.ultraThinMaterial` in dark mode with a dark tint, or a very subtle gradient overlay (dark at bottom) so content stays readable. Use sparingly.

**Gradient overlays on media:**
- On brief cards (vibe preview image/video), add a **bottom gradient** (transparent → black 70–80%) so white text (pay, deadline) is always readable and the card feels polished. 40–80pt height.

---

## 5. Cards (Brief, Role, Submission)

**Brief card (feed):**
- **Aspect ratio:** 4:5 or 9:16 (vertical) so it feels like “content,” not a squat rectangle. If no media, use a **gradient placeholder** (e.g. dark gray to primaryAccent at 10% opacity) or a subtle pattern, not a flat gray box.
- **Media first:** Image/video thumb fills the card; overlay gradient at bottom. Put **pay rate** and **deadline** on the gradient; use white or primaryAccent for pay, caption for “Due …”.
- **Optional:** Very subtle accent glow at bottom (primaryAccent 5% opacity, blur) to tie to brand.
- **Tap feedback:** Scale down to 0.98 with spring animation on press; optional subtle opacity change. Release springs back.
- **Corner radius:** 20pt so it feels like a “tile” not a box.

**Role select cards (“I need video” / “I want to get cast”):**
- Same depth rules: elevated surface, soft shadow or very subtle border.
- **Hover/press:** Scale 0.98; optional border or glow that strengthens on press (e.g. primaryAccent 0.3 → 0.6 opacity).
- **Icon or small visual:** Optional small icon (e.g. play for creator, person for talent) in accent to give personality. Don’t overdo.

**Submission cards (creator view):**
- Thumbnail + talent name + “Responds in &lt; 2h” if available. Same depth and corner rules; thumbnail with rounded corners (e.g. 12pt) to match.

---

## 6. Buttons

**Primary (main CTA):**
- **Height:** 52–56pt minimum (easy tap target).
- **Background:** Solid `primaryAccent` or `ctaUrgency` (for paywall/reward). Optional: very subtle **gradient** (e.g. same color to 10% brighter) for a bit of shine; don’t make it noisy.
- **Press state:** Scale to **0.97** with `animation(.spring(response: 0.3, dampingFraction: 0.7))`. Optional: slight brightness drop (e.g. opacity 0.9) on press.
- **Corner radius:** 14–16pt.
- **Label:** Body emphasis, white (or surface if on pink). No all-caps; sentence case.

**Secondary (e.g. “Continue with email”):**
- Outline: 1pt stroke `primaryAccent.opacity(0.5)` or text-only. Same tap scale feedback.
- Don’t compete with primary; keep it clearly secondary (size or weight).

**SwiftUI:** Use `ButtonStyle` that applies scale and optional opacity on `pressed`. Example:

```swift
struct CuePrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: configuration.isPressed)
    }
}
```

---

## 7. Text Fields & Inputs

**Avoid “form dump”:**
- One or two inputs per screen when possible; group related fields with clear labels.
- **Placeholder:** Slightly muted (e.g. `textSecondary` at 0.8). Don’t use the same weight as filled text.
- **Background:** Same elevated surface as cards (not pure black). Corner radius 12–14pt.
- **Focus state:** Border or outer glow with `primaryAccent` (e.g. 0.4 opacity) when focused. Optional: 0.5pt border.
- **Cursor / tint:** Use `primaryAccent` for cursor and selection so it feels on-brand.

---

## 8. Motion & Micro-interactions

**Principles:**
- **Spring, not linear:** Use `.spring(response: 0.35–0.45, dampingFraction: 0.75–0.85)` for most UI (cards, buttons, modals).
- **Short:** 0.2–0.4s for tap feedback; 0.35–0.5s for screen transitions or card entry.
- **Purposeful:** Animate layout changes (list reorder, appearing/disappearing), key state changes (success, error), and press feedback. Don’t animate everything.

**Where to add motion:**
- **Button press:** Scale 0.97–0.98 (see above).
- **Card tap (brief, role):** Scale 0.98 on press.
- **Success (payment released, video approved):** Lime green pulse or checkmark draw; optional light confetti or particle burst. Reserve **successMoney** for this moment.
- **List/feed:** Staggered fade-in or slight slide (e.g. 0.05s delay per item) when items appear. Don’t overdo.
- **Sheet/present:** Present with spring; drag to dismiss with resistance so it feels physical.

**Avoid:** Long loading animations; spinning logos for more than 1–2s. Prefer skeleton or simple progress.

---

## 9. Color Use (Recap + Extras)

- **Background:** `#0D0D0D` (surface). No pure black `#000` for large areas; near-black is easier on the eyes.
- **Primary accent:** Tabs, selected state, links, key icons. Use at **full strength** for interactive elements; use **opacity 0.3–0.5** for subtle borders or glows.
- **Success / money:** Only for “money in,” “approved,” “released.” Lime green pulse or checkmark.
- **CTA / urgency:** Only for primary paywall or high-impact actions. Pink button.

**"Money moment" pattern:** When the user sees earnings, payout, or approval: (1) amount or status is the visual hero, (2) success color (lime) is used for the positive state, (3) a short animation (pulse, checkmark draw, or light confetti) plays once. Keep copy short ("Payment released."). Never bury payout in generic body text.

**Gradients (optional):**
- **Hero areas:** Very subtle radial or linear (e.g. primaryAccent 3–5% at corner) to add depth. Don’t make the screen “glowy” everywhere.
- **Card media:** Bottom linear (transparent → black) for text legibility.

---

## 10. Reference Apps & What to Steal

| App | Steal this |
|-----|------------|
| **Spotify** | Dark background, one accent (green), card depth, big tap targets, minimal chrome. |
| **Cash App** | Money moments feel “real” (green, clear numbers); simple hierarchy; no clutter. |
| **CRED** | Premium dark UI; gradient accents; confidence in empty space. |
| **TikTok** | Full-bleed media; one primary action; “next” feeling (swipe). |
| **Linear** | Subtle borders, soft shadows, excellent type hierarchy and spacing. |

---

## 11. SwiftUI Implementation Checklist (for Coder)

- [ ] **Typography:** Implement full scale in `CueFonts` (Hero 34pt, Title 22–24pt, Body 16pt, Caption 14/12pt). Use everywhere; no ad-hoc sizes.
- [ ] **Spacing:** Use 8pt grid (8, 16, 20, 24, 32). Screen padding 20–24pt; card padding 16–20pt.
- [ ] **Cards:** 16–20pt corner radius; elevated background (e.g. `Color(white: 0.12)` or surface + slight lift); one soft shadow (black 0.35, radius 20, y 8). Brief cards: 4:5 or 9:16 aspect, media + bottom gradient for text.
- [ ] **Buttons:** Min height 52pt; 14–16pt radius; `ButtonStyle` with scale 0.97 and spring on press.
- [ ] **Inputs:** Elevated fill; 12–14pt radius; focus ring/glow with primaryAccent.
- [ ] **Role select cards:** Same depth and press scale; optional icon; no flat gray box.
- [ ] **BriefCardView:** Media-first layout; gradient overlay on media; pay + deadline on gradient; tap scale 0.98.
- [ ] **Motion:** Spring for all interactive feedback and transitions; success state uses successMoney and optional pulse/confetti.
- [ ] **Reserve neon:** Lime and pink only on CTAs and reward moments; rest is primaryAccent and neutrals.
- [ ] **One hero per screen:** One clear headline or one main CTA; everything else supports it.

---

## 12. Copy & Tone in UI

- Buttons: sentence case, action-oriented (“Post brief”, “See my briefs”, “View submissions”).
- Empty states: short and human (“No briefs yet. Check back soon.” or “Your brief is live. We’ll notify you when someone submits.”).
- Errors: one line + optional “Try again.” No technical jargon.
- Success: “Payment released.” “Video approved.” Optional short celebration line; then move on.

This keeps the app feeling **premium and fun** without looking like a generic form app from the 2000s. Use this doc as the source of truth for visual polish; refer back to `DESIGN_SYSTEM.md` for brand and color rules.
