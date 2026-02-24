# Manus "Cue" project: what to add before you send messages

Before you send the first messages to the Cue Strategy agent, fill in the **Cue** project’s **Instructions**, **Files**, and **Skills** so every task has shared context and the right capabilities.

---

## 1. Instructions (project-level)

Click the **pencil** on the Instructions card and paste your **shared context** so all agents in this project see it. Paste this (or the full **Cue App Visual & Brand Guide** from `docs/CUE_APP_VISUAL_AND_BRAND_GUIDE.md`):

```
Cue: App where creators post video briefs and talent get cast and get paid. Tagline: Your cue to create. Subline: Find talent or get cast. Pick your side. Creator: "I need video" — Find talent. Get the video. Talent: "I want to get cast" — Get paid to be on camera. App look: dark UI (#0D0D0D), electric blue accent (#00D4FF), premium, minimal. Tone: confident, clear, bold. No jargon. Key screens: Role select (two cards) → Create account/Sign in → Creator home or Talent feed → Post brief / Submit video.
```

Then add one line per agent type if you want:

- **Strategy agent:** Runs weekly. Outputs WEEKLY BRIEF + CADENCE table (Platform | Posts/week | Post types | Priority). Uses research/search.
- **Social agent:** Runs on that brief. Outputs Platform | Post type | Caption | Image prompt per post.
- **Ad agent:** Headlines, body, CTAs, image prompt per ad concept.
- **Landing/email agent:** Hero, bullets, email sequences, image prompts for hero and headers.

**Skills:** You have project skills available (e.g. research, web search, writing). You are encouraged to use any of them when they help the task, and to suggest or add other skills if you think they would improve the outcome.

Save. Now every new task in the Cue project gets this context.

---

## 2. Files (project folder)

Click **+** on the **Files** card and add:

| What to add | Why |
|-------------|-----|
| **Cue App Visual & Brand Guide** | So agents know exact copy, colors, and key screens. Export `docs/CUE_APP_VISUAL_AND_BRAND_GUIDE.md` to PDF (or copy into a Google Doc, export PDF) and upload. |
| **App screenshots** | So agents “see” the app. Upload 3–5 images: Role select screen, Create/Sign in, Creator home or Talent feed, one brief card. Name them clearly (e.g. `01-role-select.png`). |
| **Strategy agent instructions** (optional) | If you want the full “run weekly research and output brief” instructions in a file, paste the Strategy block from `docs/CUE_MARKETING_AGENTS_BRIEF.md` into a doc, export PDF, upload. Then you can say in a task: “Follow the strategy instructions in project files.” |

Result: the project has shared context; you don’t have to paste the brand guide into every task.

---

## 3. Skills (add these)

Click **+** on the **Skills** card and add:

| Skill to add | Why |
|--------------|-----|
| **Research / Web search / Browser** | The Strategy agent must look up current post frequency, platform best practices, and benchmarks. Add whatever Manus calls it (e.g. “Web search”, “Research”, “Browser”) so weekly research actually runs. |
| **Writing / Content** (if available) | Helps Social and Ad agents produce structured copy. Add if you see a “Long-form” or “Marketing copy” or “Structured output” skill. |
| **Image generation** (only if Manus can use it) | Only add if Manus lets you connect an image API (e.g. Nano Banana) or has a built-in “Generate image from prompt” that you can point at your tool. If not, keep the flow we designed: agent outputs **image prompt** → your marketer uses the dashboard to “Create image” via Nano Banana. No skill needed in Manus for that. |

**Priority:** Add **Research / Web search** (or equivalent) first so the Strategy agent can do its job. The rest are optional depending on what skills Manus offers.

---

## 4. Order of operations

1. **Instructions** — Paste the shared Cue context (and optional agent roles). Save.
2. **Files** — Upload the brand guide (PDF) + app screenshots. 
3. **Skills** — Add Research/Web search (required); add Writing/Image if available and useful.
4. **Then** send the two messages from `docs/MANUS_FIRST_MESSAGES.md` (name the agent, give it its job, ask for the weekly brief).

After that, new tasks in the Cue project will have the same instructions and files, and the agent will have the right skills to research and output the weekly brief.

---

## 5. Project vs agents / flow diagram

**Why project and Agents are separate:** A **project** (e.g. Cue) is a shared workspace: Instructions, Files, and Skills that every task in that project gets. **Agents** are the roles you use inside tasks. So the project doesn’t replace agents—it gives every task the same context. You still get **multiple agents** by starting **multiple tasks** inside the Cue project and, in each task’s first message, saying who that agent is (e.g. “You are Cue Strategy” vs “You are Cue Social agent”).

**Agent workflow (flow diagram):**

```
┌─────────────────┐
│ Cue Strategy    │  ← Runs weekly. Research → WEEKLY BRIEF + CADENCE table.
│ (weekly first)  │
└────────┬────────┘
         │ brief
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Cue Social      │     │ Cue Ad          │     │ Cue Landing/   │
│ (posts/captions │     │ (headlines,     │     │ email (hero,    │
│  + image prompt)│     │  CTAs, prompts) │     │  sequences)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                         │                         │
         └─────────────────────────┴─────────────────────────┘
                                   │
                                   ▼
                    Marketer: one place, “Create image” per row
                    (dashboard or Sheet → Nano Banana API)
```

Manus doesn’t show this as a built-in diagram in the UI; you run the flow by starting the right task and prompting (e.g. “Run weekly research” in a Strategy task, then “Draft posts from this week’s brief” in a Social task). You can copy this diagram into Notion/Miro if you want a visual to share.

---

## 6. Giving your marketing partner access to the Cue project

Projects and tasks are **private by default**. Having team seats only adds them to your workspace; it does **not** automatically share the Cue project. So your marketing partner won’t see Cue until you share it.

**What to do:**

1. **Invite them to the project.** Open the **Cue** project, then look for **project settings** or an **invite / share** option (e.g. in the project header, “…” menu, or the “Invite your teammates” area). Use it to **invite your marketing partner to the Cue project** (by email or name if they’re already on the team).
2. **What they get.** Once invited to the project, they get access to the shared **Instructions** and **Files** (and can create tasks that use the project’s Skills). They will only see **tasks they create themselves** in that project; they won’t see your existing tasks unless you share those tasks with them separately.
3. **If you don’t see “Invite to project”:** Ensure your partner is already on the team (via **Invite your teammates** / workspace settings). Then in the Cue project screen, check the top or sidebar for a share/invite control; Manus may label it “Invite to project” or “Share project.”
