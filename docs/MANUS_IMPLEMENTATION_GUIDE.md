# Manus implementation guide for Cue marketing agents

Step-by-step for **first-time Manus users**: set up the workspace, create the four agents, give them access to what the app looks like, and run the weekly flow. Nothing assumed.

---

## Part 0: First screen — what to type in Manus

When you open **Agents** and see the welcome message (“What should I call you? What’s my name? Reply style?”), send **two messages** in order.

**Message 1 (answer the setup and name this agent):**

```
You can call me [your name]. Your name is Cue Strategy. Reply in a detailed, structured way. Tone: professional and clear, like a marketing strategist. You're the first of four marketing agents for our app Cue — you're the weekly Strategy & Research agent.
```

**Message 2 (give it the product context and its job):**

Paste the block from **`docs/MANUS_FIRST_MESSAGES.md`** (the “Message 2” section), or paste the **Cue App Visual & Brand Guide** (`docs/CUE_APP_VISUAL_AND_BRAND_GUIDE.md`) plus the Strategy agent instructions from `CUE_MARKETING_AGENTS_BRIEF.md`. That way the agent has the app look, copy, and its exact role in one go.

Then say: “Run your first weekly research and output the WEEKLY MARKETING BRIEF for this week.” You’ll get the cadence table and brief to use for the other agents.

---

## Part 1: Get Manus ready (one-time)

### 1.1 Sign up and open a workspace

1. Go to **[manus.im](https://manus.im)** (or [manus.ai](https://manus.ai)) and sign up / log in.
2. Create or open a **workspace** (e.g. “Cue Marketing”). This is where your agents and tasks live.
3. In workspace **Settings**, find **API keys** and create one. Save it somewhere safe (you’ll use it for Zapier or scripts later; you may not need it for the in-app flow).

### 1.2 Prepare the “app context” agents will use

Manus needs to **see** what Cue looks like so it can generate on-brand, relevant content (screens, UI, colors, copy). Do this once and reuse it.

**A. Screenshots to capture (Simulator or device)**

Take **clear screenshots** of these screens and name them so you can find them:

| Screenshot file name      | Screen / what it shows |
|---------------------------|-------------------------|
| `01-role-select.png`      | First screen: “Your cue to create.” + two cards (I need video / I want to get cast) |
| `02-create-or-sign-in.png`| After picking a role: “Create account” and “Sign in” |
| `03-auth-email.png`       | Email/password screen (Create account or Sign in with email) |
| `04-creator-home.png`     | Creator home (after onboarding) |
| `05-talent-feed.png`      | Talent feed of briefs |
| `06-post-brief.png`       | Post a brief (form or sheet) |
| `07-brief-card.png`       | A single brief card (talent or creator view) |

Save them in a folder you can access from the web (e.g. **Google Drive** or **Dropbox**), set sharing to “Anyone with link,” and copy the **public link** for each image. You’ll paste these links into Manus when you create tasks or attach to an agent.

**B. One “Cue App Visual & Brand Guide” doc (for agents to read)**

Create a short doc (Google Doc or Notion) that you can paste into Manus or attach as context. Include:

- **What Cue is:** One sentence (creators post briefs, talent get cast and paid). Tagline: “Your cue to create.” Subline: “Find talent or get cast. Pick your side.”
- **App look:** Dark UI (background #0D0D0D), elevated cards slightly lighter. Primary accent **electric blue (#00D4FF)**. Lime green for success/earnings; cyber pink for high-impact CTAs. Serif for logo and hero; clean, premium, no clutter.
- **Key screens (with screenshot links):**  
  - First screen: Role select — two cards, “I need video” (Creator) and “I want to get cast” (Talent).  
  - Then: Create account / Sign in → email+password or Apple.  
  - Creator: home, post brief, view submissions.  
  - Talent: feed of briefs, submit video, earnings.
- **Tone:** Confident, clear, a bit bold. No jargon. Benefit-led for both sides.

Save this doc and either **paste its text** into the agent instructions (or the first task) or export to PDF and **attach** it to tasks. If Manus supports a “knowledge” or “context” folder, upload the doc + screenshot links there so every task can use it.

**C. Repo references (for you, not necessarily for Manus)**

- **Copy and headlines:** `Cue/Cue/Onboarding/RoleSelectView.swift` — exact “Your cue to create.”, “Find talent or get cast.”, card titles and subtitles.
- **Colors/fonts:** `Cue/Cue/Design/CueColors.swift`, `Cue/Cue/Design/CueFonts.swift`.

You can paste short snippets from those files into the brand guide doc so the agents have the exact headlines and color hex codes.

---

## Part 2: Create the four agents in Manus

In the Manus app, look for **Agents** (or **Create agent**). Create four agents. Name them clearly (e.g. “Cue – Strategy”, “Cue – Social”, “Cue – Ad copy”, “Cue – Landing/email”).

### 2.1 Agent 1: Strategy & research

- **Name:** Cue – Strategy (or “Weekly marketing strategy”).
- **Goal / instructions:** Paste the **full Strategy agent instructions** from `docs/CUE_MARKETING_AGENTS_BRIEF.md` (the “Instructions to give the agent” block for Agent 1).
- **Context:** Add the **Cue App Visual & Brand Guide** (paste text or attach the doc). Optionally attach the **screenshot links** (or a short “Screens” section with the list of what each screenshot shows) so the agent knows what the product looks like.
- **Tools / integrations:** Enable **browser or search** if Manus offers it, so the agent can research post frequency and formats.
- **When to run:** Weekly (e.g. every Monday). You start a **new task** for this agent each week and use its output as the “weekly brief” for the other agents.

### 2.2 Agent 2: Social content

- **Name:** Cue – Social content.
- **Goal / instructions:** Paste the **Social content agent** instructions from `CUE_MARKETING_AGENTS_BRIEF.md`. Emphasize: “You only run when given a WEEKLY MARKETING BRIEF. For each post output: Platform, Post type, Caption, Image prompt.”
- **Context:** Same **Cue App Visual & Brand Guide** and, if possible, the **screenshot links** so captions and image prompts can reference real screens (e.g. “hero image evoking the role-select screen”).
- **When to run:** After the strategy agent. When you start a task, **attach or paste the current week’s weekly brief** (from Agent 1’s last run). Run 2–3 times per week or as the brief specifies.

### 2.3 Agent 3: Ad copy & hooks

- **Name:** Cue – Ad copy.
- **Goal / instructions:** Paste the **Ad copy agent** instructions from the brief. Include: “Use the attached WEEKLY MARKETING BRIEF. Output headlines, body, CTAs, and one image prompt per ad concept.”
- **Context:** Same brand guide + screenshots so ad creative can match the app (e.g. “dark background, electric blue accent”).
- **When to run:** 1–2 times per week (or when refreshing ads). Attach the **latest weekly brief** to each task.

### 2.4 Agent 4: Landing / email copy

- **Name:** Cue – Landing/email.
- **Goal / instructions:** Paste the **Landing/email agent** instructions from the brief. Include hero, bullets, CTA, email sequences, and **image prompts** for hero and key visuals.
- **Context:** Same brand guide + screenshots.
- **When to run:** Monthly or when you refresh funnels. You can attach the latest brief if you want messaging aligned with current strategy.

---

## Part 3: Give Manus access to what the app looks like (checklist)

Use this so you don’t miss anything:

- [ ] **Screenshots** of: Role select, Create/Sign in, Auth (email), Creator home, Talent feed, Post brief, Brief card. Upload to Drive/Dropbox, get public links.
- [ ] **Cue App Visual & Brand Guide** doc with: one-sentence product, tagline, subline, creator/talent angles, **colors** (dark #0D0D0D, blue #00D4FF, lime, pink), **tone** (confident, clear, bold), and a short list of key screens (with screenshot links if possible).
- [ ] **Exact copy** from the app (from `RoleSelectView.swift` or the brief): “Your cue to create.”, “Find talent or get cast. Pick your side.”, “I need video”, “I want to get cast”, creator/talent subtitles.
- [ ] **Attach or paste** the guide (and optionally the screenshot links) into **every agent’s context** or into the **first task** you run for each agent, so they always have the same reference.
- [ ] If Manus has a **Knowledge base** or **Project files**: upload the brand guide and a short “screens.txt” with the list of screens and screenshot URLs so tasks can pull from it.

That way Manus has access to **what the app looks like** and can generate relevant, on-brand content and image prompts.

---

## Part 4: Weekly flow (how to run it)

1. **Monday (or your chosen day):** Start a **new task** for **Agent 1 (Strategy)**. In the task prompt, say: “Run your weekly research and output the WEEKLY MARKETING BRIEF for this week. Include cadence, post types by platform, and one strategic tweak.” Attach or paste the **Cue App Visual & Brand Guide** (and screenshot links) if this task doesn’t already inherit them. Run the task and wait for the reply.
2. **Copy the weekly brief** from the strategy agent’s output (the “WEEKLY BRIEF” and “CADENCE” table).
3. **Social content:** Start a **new task** for **Agent 2 (Social)**. In the prompt, say: “Here is this week’s marketing brief. Draft all posts for the week. For each post give: Platform, Post type, Caption, Image prompt.” **Paste the weekly brief** into the task (or attach it). Run the task. Copy the output into your **Google Sheet** (or marketing dashboard) so each row has Caption + Image prompt.
4. **Ad copy (if needed):** Start a task for **Agent 3**. Paste the same weekly brief. Ask for ad concepts with headlines, body, CTAs, and image prompts. Add those to your sheet or workflow.
5. **Images:** Your marketer uses the **one place** (dashboard or sheet) and clicks **Create image** for each row (Nano Banana is wired via your backend or Zapier so she never touches the API). She downloads images and posts.

Repeat each week; strategy agent’s output drives how many posts and which formats the social (and ad) agents produce.

---

## Part 5: Attaching files and context in Manus

- **In the Manus app:** When you create a **task**, look for **Attach** or **Add context**. You can usually:
  - **Upload a file** (PDF, doc, images).
  - **Paste a URL** (e.g. to a screenshot or a Google Doc). If the doc is “Anyone with link can view,” Manus may be able to use it.
  - **Paste text** (e.g. the full brand guide or the weekly brief).
- **For images:** If Manus accepts image URLs, paste the **public links** to your screenshots in the task or in the brand guide doc. That way the agent “sees” the app when generating captions and image prompts.
- **API (optional):** If you use the **Manus API** ([open.manus.ai/docs](https://open.manus.ai/docs)), you can create tasks with `attachments` (e.g. `url` for your screenshot or doc link). Use the same context for every “Cue marketing” task so agents always have the app visuals and brand in scope.

---

## Part 6: What you’re not missing

- **Strategy agent first** so cadence and format aren’t guessed.
- **One brief per week** so social and ad agents stay aligned.
- **Structured output** (Platform | Caption | Image prompt) so the marketer’s sheet/dashboard has one clear “Create image” action per row.
- **App context:** Screenshots + brand guide + exact copy so Manus knows what Cue looks like and sounds like.
- **Nano Banana wired** so the marketer never has to open Nano Banana or touch API keys (see `CUE_MARKETING_AGENTS_BRIEF.md`).

If you add new screens or change taglines, update the **Cue App Visual & Brand Guide** and re-attach or re-paste it into the agents (or your default task template) so Manus stays in sync with the app.
