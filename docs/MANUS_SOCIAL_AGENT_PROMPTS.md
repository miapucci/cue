# Social agent: one agent vs per-platform agents

**Recommendation:** Use **one Social agent** (e.g. Tobi) for all platforms. Paste the weekly brief once; the agent outputs every post for the week with clear **Caption (copy into app and post)** blocks. Your marketer copies each block into Instagram, TikTok, LinkedIn, or X and hits Post. No need for separate agents unless you want deeper platform-specific tuning.

---

## When one agent is enough

- One run = whole week’s posts for every platform.
- Consistent mix (creator/talent) across platforms because one agent sees the full brief.
- Marketer gets one list; each post is labeled by platform and ready to paste.

---

## When to consider separate agents per platform

Use **separate agents per platform** only if you want:

- Very different tone/length per platform (e.g. TikTok hook scripts with timing vs LinkedIn thought-lead).
- Platform-native formatting (e.g. “Instagram caption + hashtag block” vs “TikTok script: 0–3s hook, 3–10s payoff”).
- To run or approve platforms on different schedules.

Downside: you run 4 tasks and paste the brief 4 times; a bit more overhead.

---

## Optional: per-platform agent prompts (if you split later)

If you create **Instagram-only**, **TikTok-only**, **LinkedIn-only**, or **X-only** tasks, use the same Cue context and weekly brief, but set the scope in the first message. Example for each:

**Instagram-only (first message in that task):**
```
You are the Instagram-only social agent for Cue. You only run when given a WEEKLY MARKETING BRIEF. Output only Instagram posts (Reels, carousels, single image) per the brief’s Instagram cadence. Cue context: [same as main Social agent]. For each post output: **Caption (copy into app and post):** [caption + hashtags], **Image prompt:** [for the visual]. Format so the marketer can copy the caption into Instagram and hit Post.
```

**TikTok-only:**
```
You are the TikTok-only social agent for Cue. You only run when given a WEEKLY MARKETING BRIEF. Output only TikTok posts (short-form video concepts) per the brief’s TikTok cadence. Include hook (first 3s) and body. Cue context: [same as main Social agent]. For each post: **Caption (copy into app and post):** [caption], **Image prompt** or **Visual concept:** [what the video should show]. Format so the marketer can copy into TikTok and post.
```

**LinkedIn-only / X-only:** Same pattern—replace platform name, refer to the brief’s cadence for that platform, and keep **Caption (copy into app and post):** so the marketer can paste and post.

---

## Copy-paste ready format (one agent)

The main Social agent (in `CUE_MARKETING_AGENTS_BRIEF.md`) is instructed to output each post like this so the marketer can paste and post:

- **Platform:** Instagram / TikTok / LinkedIn / X  
- **Post type:** Reel, carousel, etc.  
- **Caption (copy into app and post):** [only the caption text]  
- **Image prompt:** [for generating the visual]

Your friend’s flow: open the platform → paste the caption → add the image (from your dashboard/sheet) → hit Post.
