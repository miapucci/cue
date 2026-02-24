# Cue: Marketing agents brief for Manus

**Order:** Create the **strategy agent first** (runs weekly). Its output decides how often and in what format the other agents run. Then wire **Nano Banana** into one simple flow so a non-technical marketer only sees one place and one action: “Create image.”

---

## Cue in one sentence (for agent context)

**Cue** is an app where **creators** post video briefs and **talent** get cast and paid. Tagline: *"Your cue to create."* Subline: *"Find talent or get cast. Pick your side."*

- **Creator side:** "I need video" — Find talent. Get the video.
- **Talent side:** "I want to get cast" — Get paid to be on camera.

Reference: `Cue/Cue/Onboarding/RoleSelectView.swift` (hero + role cards).

---

## Agent 1: Strategy & research (run this first, weekly)

**Runs:** Once per week (e.g. every Monday).  
**Job:** Research what’s working for apps like Cue, then output a **weekly marketing brief** that all other agents and your marketer follow. This agent sets cadence, post types by platform, and priorities so nobody has to guess.

**Instructions to give the agent:**

"You are the marketing strategy agent for Cue, an app where creators post video briefs and talent get cast and get paid. Tagline: Your cue to create. Find talent or get cast. Pick your side.

**Every week you must:**

1. **Research** (use search/browser): What post frequency and formats are working in 2025–2026 for (a) creator-economy / gig apps, (b) talent/casting platforms, (c) short-form video and social. Note any platform-specific numbers (e.g. ideal posts per week for Instagram Reels vs TikTok vs LinkedIn).

2. **Platform breakdown:** For each channel we care about (Instagram, TikTok, LinkedIn, X), output:
   - Recommended **posts per week** (and per day if relevant).
   - **Post types** that perform best (e.g. Reels vs carousel, hook styles, UGC-style vs polished).
   - **Priority order** for Cue (which platform to focus on first with a short reason).
   - Any **numbers** (e.g. best posting times, typical engagement benchmarks for our category).

3. **Weekly marketing brief:** Turn the above into a single brief the rest of the team and the content agents must follow. Include:
   - **This week’s cadence:** e.g. 'Instagram: 5 posts (3 Reels, 2 carousels). TikTok: 3. LinkedIn: 2. X: 5.'
   - **Content mix:** e.g. '40% creator-focused, 40% talent-focused, 20% brand/community.'
   - **Post types by platform:** e.g. 'Instagram Reels: 15–30s, hook in first 3s. TikTok: same. LinkedIn: short thought-lead or tip + CTA.'
   - **One strategic tweak:** One concrete change or test to try this week (e.g. 'Test “Get cast” vs “Get paid to create” in talent hooks').

4. **Output format:** Structure your reply so it can be copied into our marketing sheet: a clear 'WEEKLY BRIEF' section plus a 'CADENCE' table (Platform | Posts/week | Post types | Priority)."

**Tools:** Browser/search so the agent can pull current benchmarks and best practices.

**Who uses this:** You (or the marketer) run this agent once a week. Its output is the source of truth for how many posts, which platforms, and what formats the **social content** and **ad copy** agents use that week.

---

## Agent 2: Social content (runs on strategy agent’s cadence)

**Runs:** As often as the weekly brief says (e.g. 2–3 times per week, or daily if the brief says so).  
**Input:** The current week’s **weekly marketing brief** from Agent 1 (paste it into the task or attach it).

**Goal:** Draft the actual posts for the week in one go. When **Nano Banana Pro** is enabled for the Cue project, Tobi should **generate the image** for each post (caption + image ready so the marketer can paste and post). Otherwise Tobi outputs caption + **image prompt** and the marketer uses your dashboard to create images. See `docs/MANUS_TOBI_NANOBANANA.md` for enabling Nano Banana so Tobi can generate images.

**Instructions to give the agent:**

"You are the social content agent for Cue. You only run when given a **WEEKLY MARKETING BRIEF** from our strategy agent.

**Cue context:** App where creators post video briefs and talent get cast and get paid. Tagline: Your cue to create. Find talent or get cast. Creator angle: I need video — find talent, get the video. Talent angle: I want to get cast — get paid to be on camera.

**Your job:** Using the attached weekly brief (cadence, post types by platform, content mix), draft every post for this week. For each post output:

- **Platform** (Instagram, TikTok, LinkedIn, or X)
- **Post type** (e.g. Reel, carousel, single image, thread)
- **Caption (ready to paste):** Exact caption the marketer copies into the platform and hits Post. Include hashtags where the platform uses them (e.g. Instagram). Output only the caption text.
- **Image prompt** (one short, concrete prompt for an AI image tool: what the visual should show, style, mood. e.g. 'Minimal app mockup on dark background, phone showing “Your cue to create” screen, premium feel.')

Follow the brief’s cadence exactly. Mix creator-focused and talent-focused posts as specified. Tone: confident, clear, a bit bold. No jargon. Every post that needs a visual must have an **Image prompt** (or, if Nano Banana Pro is enabled for the project, use the image generation tool to create the image and attach or link it so the marketer can paste caption + image and post). Format each post as a clear block with **Platform**, **Post type**, **Caption (copy into app and post):** [caption only], and either **Image:** [generated] or **Image prompt:**."

**Output:** One structured list (table or numbered list) that can be pasted into a **Google Sheet** or the **marketing dashboard** (see below). Format: for each post give a block with **Caption (copy into app and post):** so the marketer can paste into the platform and hit Post, plus **Image** (generated by Tobi via Nano Banana Pro when enabled) or **Image prompt**. One Social agent for all platforms. See `docs/MANUS_TOBI_NANOBANANA.md` to enable Nano Banana so Tobi generates images. That way the marketer only has to click “Create image” next to each row—no copying prompts or opening multiple tools.

---

## Agent 3: Ad copy & hooks (runs 1–2x per week or as needed)

**Runs:** When you’re refreshing ads (e.g. weekly or biweekly). **Input:** Same weekly brief so headlines and formats match the strategy.

**Goal:** Headlines, body copy, and CTAs for paid (Meta, TikTok, Google). Output includes an **image prompt** for each ad concept so the marketer can generate creatives in one place.

**Instructions to give the agent:**

"You write performance ad copy for Cue. Use the attached **WEEKLY MARKETING BRIEF** so your formats and angles match our strategy.

**Audiences:** (1) Creators who need video — fast casting, quality talent, simple briefs. (2) Talent who want to get cast — get paid, real briefs, one app.

**For each ad concept output:** 3–5 headlines (under 40 chars where needed), 2–3 body variants, 1–2 CTAs, and **one image prompt** (what the ad creative should show for AI image generation). Tone: direct, benefit-led."

**Output:** Same idea as Agent 2—structured so it can go into the same sheet/dashboard with a clear **Image prompt** column for one-click generation.

---

## Agent 4: Landing / email copy (runs monthly or when refreshing funnels)

**Runs:** Less often; can be triggered when strategy agent recommends a messaging or funnel tweak.

**Goal:** Hero, benefit bullets, CTA; short email sequences for creators and talent. Include **image prompts** for hero and key visuals so the marketer can generate them without guessing.

**Instructions:** Same Cue positioning as above. Output: hero headline, bullets, CTA block; 3-email sequence per audience; **image prompt** for hero and for 1–2 email headers. Structure so hero prompt and email prompts can be dropped into the same “Create image” flow.

---

## Wiring Nano Banana so your marketer isn’t confused

**Principle:** Your marketer should only see **one place** (a single page or one sheet) and **one action**: “Create image.” No API keys, no copying prompts into Nano Banana’s UI, no tech steps.

### Option A: Marketing dashboard (recommended)

**You build once:**

1. **Data source:** A **Google Sheet** (e.g. “Cue Marketing – This Week”) with columns: **Platform** | **Schedule** | **Caption** | **Image prompt** | **Image URL** | **Status**. You (or Zapier when a Manus task completes) paste or push the agents’ output into this sheet so each row has at least Caption + Image prompt.

2. **Single page the marketer opens:** A simple **web app** (e.g. in `Tobi/marketing-dashboard` or a small Vercel/Netlify project) that:
   - Reads from that sheet (via Google Sheets API or a small backend you deploy with a read-only key).
   - Shows a table: Platform | Caption | Image prompt | **[Create image]** button.
   - When she clicks **Create image** on a row, the app calls **your** backend (or a serverless function) that holds the **Nano Banana API key**; the backend calls [Nano Banana’s API](https://docs.nanobananaapi.ai) with that row’s prompt, gets the image URL (or file), and returns it.
   - The page shows the image and a **Download** (or **Copy link**) button. Optionally the backend writes the image URL back into the sheet so the row is updated.

**What the marketer does:** Opens one URL → sees the week’s posts → clicks “Create image” on each row → downloads or copies the image. She never sees Nano Banana, API keys, or prompts unless she wants to read them in the table.

**Nano Banana API (for you):** [Nano Banana API docs](https://docs.nanobananaapi.ai) — e.g. `POST` to generate with `prompt`, auth via Bearer token. You store the token in env vars on your backend only.

### Option B: Sheet + Zapier (no custom app)

If you prefer not to host a small app:

1. Same **Google Sheet** with columns: Platform | Caption | Image prompt | Image URL | Status.
2. You (or a Zap that runs when you add a row) run a **scheduled Zap** or a **manual “Zapier task”**: for each row where Image prompt is filled and Image URL is empty, call Nano Banana’s API (Zapier “Webhooks by Zapier” or “HTTP by Zapier”), then write the returned image URL into the sheet.
3. Your marketer’s only job: open the sheet, see new rows (from agent output), and either trigger the Zap or wait for you to run it. She downloads images from the Image URL column. Slightly more manual but still one place (the sheet).

### What to tell your marketer

- “Everything for the week is in **one place** [link to dashboard or sheet].”
- “For each post, click **Create image** (or use the link we add). Download the image and use it with the caption we already wrote.”
- No need to log into Nano Banana or understand APIs—you handle that once in the backend or Zapier.

---

## Order of operations (summary)

1. **Create Agent 1 (Strategy)** in Manus. Run it weekly. Use its output as the **weekly marketing brief**.
2. **Create Agents 2–4** (Social, Ad copy, Landing/email). Each run uses the latest brief; their output is always structured with **Caption** + **Image prompt** (and platform/schedule).
3. **Set up the one place for your marketer:** Either the marketing dashboard (Option A) or the sheet + Zapier (Option B). Store the Nano Banana API key only on your side (backend or Zapier).
4. **Flow:** Strategy (weekly) → you paste brief into Social/Ad tasks → agents output table → you (or Zapier) put rows into the sheet → marketer opens dashboard or sheet → clicks “Create image” per row → downloads and posts.

---

## Repo references for agents

- **Positioning and copy:** `Cue/Cue/Onboarding/RoleSelectView.swift` — “Your cue to create.”, “Find talent or get cast. Pick your side.”, “I need video” / “I want to get cast”.
- **Product context:** `README.md`, `docs/DEV_HANDOFF_ENTRY_AUTH_AND_BACKEND.md`.

---

## Implementation and app context for Manus

- **First-time Manus setup and weekly flow:** **`docs/MANUS_IMPLEMENTATION_GUIDE.md`** — step-by-step: sign up, workspace, create all four agents, attach context, run strategy then social/ad, and what to give Manus so it “sees” the app.
- **Ready-to-paste context for Manus:** **`docs/CUE_APP_VISUAL_AND_BRAND_GUIDE.md`** — copy this into Manus (or into a Google Doc you attach) so agents have the app look, colors, copy, and key screens. Use it so they generate relevant content and accurate image prompts.

---

## Nano Banana

- **Product:** [Nano Banana](https://nanobanana.io) (your Pro account).
- **API (for wiring):** [docs.nanobananaapi.ai](https://docs.nanobananaapi.ai) — generate endpoint, Bearer token. Use from your backend or Zapier so the marketer never touches it.
