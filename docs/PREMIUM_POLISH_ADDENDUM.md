# Cue — Premium Polish Addendum: “A Tremendous Amount of Effort”

**Goal:** Every screen should feel like a **lot of thought and craft** went in — dynamic, layered, with gradients and motion so it never feels static or template-like. Use this **with** `AI_UI_AGENT_BRIEF.md` and `UI_POLISH_SPEC.md`.

---

## 1. Gradients — Use Everywhere They Add Depth

**Do not rely on flat fills.** Where the design system allows, add subtle gradients so surfaces feel crafted.

| Where | What to do |
|-------|------------|
| **Card backgrounds** | Soft gradient wash: e.g. accent 8–12% at one edge (top-left or left) fading to transparent/surface. Or vertical: slightly lighter at top (white 4–6%) → surface. |
| **Card borders / left edge** | Gradient stroke: accent → accent.opacity(0.3) or accent → clear along left or top edge. 1pt or subtle glow. |
| **Icon containers (role cards, list rows)** | Fill with `LinearGradient(accent.opacity(0.2–0.35) → accent.opacity(0.1))` or radial; optional soft ring (stroke gradient). |
| **Primary button** | Optional: very subtle vertical gradient (accent → accent at 0.9 brightness) so it’s not flat. |
| **Hero / screen background** | On key screens (onboarding already has orbs): optional **slow-moving radial** (accent 4–8%, center drifts or opacity breathes over 15–30s). Or static radial: center accent 6–10%, radius ~1.2× height. |
| **Media (brief cards, thumbnails)** | Always bottom gradient overlay: transparent → black 70–80%, height 40–80pt, so text is readable and card feels finished. |
| **Empty state / secondary areas** | Subtle radial or linear (accent 3–5%) in the background so the screen isn’t dead flat. |

**Rule:** Gradients are subtle (low opacity). They add depth and “effort,” not noise. Use `CueColors.primaryAccent` and `CueColors.ctaUrgency`; no new colors.

---

## 2. Motion — Every Screen Feels Alive

**Nothing should pop in instantly or sit completely static.** Add motion in a way that feels premium (slow, intentional), not flashy.

| Where | What to do |
|-------|------------|
| **List / card entrances** | **Staggered appear:** each card or row fades in with slight vertical offset (8–14pt), 0.15–0.3s delay between items, duration ~0.35–0.45s, spring or ease-out. Apply to brief feed, submissions list, earnings, creator home cards. |
| **Onboarding** | Already: drifting orbs in `OnboardingBackgroundView`, staggered role cards. Extend to **all** onboarding steps: same background + staggered entrance for headline then form sections. |
| **Hero / logo** | Optional very subtle idle: e.g. logo or hero text opacity 0.92 ↔ 1.0 over 2–3s, repeat forever, slow. Or a soft gradient shift behind the logo. |
| **Tap feedback** | Every tappable card/button: scale (0.97–0.98) + spring. Optional slight opacity dip on press. |
| **Success / reward** | Use `successMoney` (lime) with a **pulse** or scale animation; optional short confetti or particle burst. Feels like “a lot of effort” went into the moment. |
| **Screen transitions** | Prefer spring or ease-out, 0.35–0.5s. Sheets: present with spring; drag to dismiss with resistance. |

**Rule:** Motion is **slow and purposeful.** No fast spins, no bouncy overshoot on serious flows. Cycle lengths for ambient motion: 15–40s. For entrances: one clear sequence (hero → content → CTA or list in order).

**Ambient motion (implementation):** Use `TimelineView(.animation)` (or equivalent) for drifting orbs and slow gradient shifts so motion is continuous and smooth, not keyframe-only. No motion under 10s cycle length for ambient elements.

---

## 3. Moving Parts — Backgrounds and “Alive” Feel

| Where | What to do |
|-------|------------|
| **Onboarding** | Keep and use `OnboardingBackgroundView` on **every** onboarding screen (role select, auth, profile, steps). Drifting orbs = moving parts; no static flat black. |
| **Main app (Creator home, Talent feed)** | Add a **subtle moving layer** behind content: e.g. 1–2 very slow radial gradients (accent 4–6%) whose center or opacity changes over 20–30s (`TimelineView(.animation)` or repeating animation). Or reuse a lighter version of the orb logic (fewer/smaller orbs, slower). So even “list” screens feel slightly alive. |
| **Modals / overlays** | Optional: dimmed background with very subtle gradient (not flat black). Content enters with spring. |

**Materials (optional):** For one or two hero surfaces (e.g. role select card, top feed card), consider `.ultraThinMaterial` with dark tint instead of solid fill, for a glass-like depth. Use sparingly.

**No large flat black:** Any full-screen or large area that's a single solid color should have at least one of: gradient wash, subtle radial, or moving layer. No big flat black rectangles.

**Rule:** “Moving parts” = user can sense that something is gently moving or shifting. It doesn’t have to be obvious; it should feel **considered.**

---

## 4. Checklist for “Tremendous Effort”

Before considering a screen done, confirm:

- [ ] **Gradients:** Cards or key surfaces have at least one gradient (wash, border, or icon container). Media has bottom gradient for text. Hero/empty states have subtle background gradient or radial.
- [ ] **Motion:** Lists/cards use staggered entrance (fade + offset + delay). Buttons/cards have press scale + spring. Onboarding uses `OnboardingBackgroundView` and staggered content.
- [ ] **Moving parts:** Onboarding always has moving background. Main app key screens (feed, creator home) have at least a subtle slow gradient or orb layer so the screen isn’t static.
- [ ] **No flat blocks:** No big areas of a single solid color with no gradient, shadow, or motion. Elevation (`.cueRaised` / `.cueFloating`) + gradients + motion = “tremendous effort.”

---

## 5. Reference

- **Onboarding motion + orbs:** `Cue/Cue/Design/OnboardingBackgroundView.swift`, `ONBOARDING_VISUAL_SPEC.md` §1, §4.
- **Gradient and depth:** `UI_POLISH_SPEC.md` §4 (gradient overlays on media, glass option), §5 (brief cards, role cards).
- **Staggered entrances:** `RoleSelectView` (hero then cards with delay); replicate pattern for any new list or card stack.

Apply this addendum **on top of** the existing brief and design tokens. Same colors, same typography, same components — but more gradients, more motion, and more moving parts so it feels like a tremendous amount of effort went into it.
