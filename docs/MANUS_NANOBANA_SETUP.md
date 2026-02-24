# Manus + Nanobana Pro: Marketing Agents Setup

Quick reference for setting up **marketing agents** on Manus and **plugging Nanobana Pro** in so agents can use it for creative assets.

---

## 1. Manus: marketing agents

**What Manus is:** AI agent platform (manus.im / open.manus.ai). Agents can run tasks, use 500+ integrations, and be triggered from Slack, Zapier, or the API.

**Set up marketing agents:**

1. **Workspace & API key**
   - Go to [Manus](https://manus.im) (or your Manus workspace).
   - Create or open a workspace.
   - In **Workspace settings**, generate an **API key** (you’ll use it for the API and sometimes for integrations).

2. **Define the marketing agent(s)**
   - In Manus, create an **Agent** (or use a template if available).
   - Give it a clear goal, e.g.:
     - “Draft and schedule social posts for the week.”
     - “Turn product bullet points into ad copy and suggest visuals.”
     - “Research competitors and summarize positioning; suggest messaging.”
   - Add **tools/integrations** the agent is allowed to use (e.g. Gmail, Calendar, Notion, Slack, or custom API calls if supported).

3. **Trigger agents**
   - **From Manus app:** Start a task/session and describe the marketing goal.
   - **From Slack:** Use the Manus–Slack integration; message the Manus bot or run a command in a channel to start a task.
   - **From Zapier:** In a Zap, add “Manus” as an action (e.g. “Create Task”) and pass in trigger data (e.g. “New row in Google Sheet” → “Create Manus task: draft post for this product”).
   - **From code/API:** `POST https://open.manus.ai/v1/tasks` with your API key and a task description (see [Manus API docs](https://open.manus.ai/docs)).

**Docs:** [Manus API](https://open.manus.ai/docs), [Integrations (Slack, Zapier)](https://open.manus.ai/docs/integrations/index).

---

## 2. Plug Nanobana Pro into Manus

**What Nanobana Pro is:** AI image generation (e.g. marketing visuals, 4K, text-in-image). Often exposed via a REST API (e.g. “Nano Banana Pro”–style APIs with Bearer token).

**Ways to “plug it in” so Manus can use it:**

### Option A: Zapier (no code)

1. In **Zapier**, create a Zap:
   - **Trigger:** Manus (e.g. “Task completed” or “New task”) **or** another trigger (e.g. “New row in sheet,” “New form submit”).
   - **Action:** HTTP by Zapier (or an official “Nano Banana Pro” / image-API app if one exists) to call the Nanobana Pro API:
     - URL: your Nanobana Pro API endpoint (e.g. image generation).
     - Method: POST.
     - Headers: `Authorization: Bearer YOUR_NANOBANA_API_KEY`, `Content-Type: application/json`.
     - Body: prompt and options (from the Nanobana Pro API docs).
2. Optionally add a step to send the result **back** to Manus (e.g. upload the image as a file or add to a task) or to Slack/email.

So: **Manus runs the marketing task** → Zapier sees the outcome or a separate trigger → **Zapier calls Nanobana Pro** → you get the image and can feed it back into Manus or elsewhere.

### Option B: Manus API + your backend (custom “helper”)

1. You run a small **backend** (e.g. Node/Express or a serverless function) that:
   - Receives a request (e.g. “generate image with this prompt”).
   - Calls the **Nanobana Pro API** (Bearer token, prompt, size, etc.).
   - Returns the image URL or file.
2. Expose this as a **webhook** or **API** that Manus can call if Manus supports “custom HTTP” or “webhook” as a tool. Check Manus docs for “custom tools” or “HTTP request” in the agent builder.
3. In Manus, add this endpoint as a **tool** for your marketing agent so it can “request a marketing image” and get back a link or file.

### Option C: Use both in the same workflow (no direct link)

- Use **Manus** for copy, strategy, and task breakdown (e.g. “draft 5 tweet ideas,” “outline a landing page”).
- Use **Nanobana Pro** separately (app or API) for visuals when you need them.
- Manually or via Zapier: when Manus outputs “we need a hero image for X,” you (or a Zap) call Nanobana Pro with that description and attach the result where you need it.

---

## 3. Quick checklist

- [ ] Manus: workspace created, API key generated.
- [ ] Manus: at least one marketing agent defined (goal + allowed tools).
- [ ] Manus: trigger tested (from app, Slack, or Zapier).
- [ ] Nanobana Pro: API key and base URL noted (from your Nanobana Pro account/docs).
- [ ] Connection: either Zapier (Manus ↔ HTTP → Nanobana Pro) or custom backend that Manus can call to generate images.
- [ ] One end-to-end test: e.g. “Create a task in Manus: ‘draft a tweet and suggest one hero image prompt’” → Manus drafts copy → you (or Zapier/backend) call Nanobana Pro with that prompt and attach the image.

---

## 4. Cue-specific agents and Nano Banana for non-technical marketer

See **`docs/CUE_MARKETING_AGENTS_BRIEF.md`** for:
- **Agent order:** Strategy & research agent first (weekly) → sets cadence and post types; then Social, Ad copy, Landing/email agents that run on that brief.
- Exact instructions and Cue positioning (tagline, creator/talent angles).
- **Wiring Nano Banana** so a non-technical marketer has one place and one action (“Create image”): marketing dashboard (simple web app + Google Sheet + Nano Banana API) or Sheet + Zapier. Marketer never touches API keys or Nano Banana’s UI.

---

## 5. Links

- **Manus:** [manus.im](https://manus.im), [API docs](https://open.manus.ai/docs), [Integrations](https://open.manus.ai/docs/integrations/index).
- **Nano Banana (your setup):** [nanobanana.io](https://nanobanana.io) — create/generate page for Pro. Use agent output as creative briefs for images; if your plan exposes an API, add Zapier or a custom backend to request images by prompt.
