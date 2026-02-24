# Project Skills: Add options and linking Nano Banana

This doc explains what you see when you click **Add** in the Project Skills modal and how to link **Nano Banana** for Cue marketing.

---

## Where this is in the repo

- **Project setup (Instructions, Files, Skills):** `docs/MANUS_CUE_PROJECT_SETUP.md`
- **Which skills to add for Cue:** same file, section **3. Skills (add these)** — Research/Web search first, then Writing/Image if available
- **Nano Banana + Manus (Zapier, backend, or no direct link):** `docs/MANUS_NANOBANA_SETUP.md`
- **One place for the marketer (“Create image”):** `docs/CUE_MARKETING_AGENTS_BRIEF.md` (Wiring Nano Banana)

---

## What happens when you click **Add** (Project Skills)

When you click **Add** in the Project Skills modal, Manus gives you these options:

| Option | What it does |
|--------|----------------|
| **Build with Manus** | Turn a successful chat into a skill. You do a task in Manus, then ask it to save the workflow as a Skill. Good for custom flows (e.g. “research → brief”). |
| **Upload a skill** | Add a skill from your machine: `.zip`, `.skill` file, or folder. Use if you have a skill package already. |
| **Add from official** | Pick from Manus’s official library (e.g. Research, Web search, Writing). **Start here** for Cue: add Research/Web search first. |
| **Import from GitHub** | Add a skill from a GitHub repo (community or your own). |

For Cue, add **Research / Web search** (or equivalent) from the **official** list first. Then add Writing/Content or Image if you see useful ones.

---

## How to “link” Nano Banana

Nano Banana is **not** a built-in Manus skill. You don’t “add Nano Banana” as a skill from the Add menu. You link it in one of these ways:

### Option 1: No Nano Banana skill in Manus (recommended for your flow)

- **In Manus:** Agents output **image prompts** in the weekly brief (e.g. in the Social/Ad agent output).
- **Outside Manus:** Your marketer uses **one place** (dashboard or Sheet) and clicks **“Create image”** per row. That app or Zapier calls the **Nano Banana API** with the prompt; the marketer never touches Nano Banana or API keys.
- **In Project Skills:** You do **not** need an “image” or “Nano Banana” skill. Only add Research/Web search (and Writing if useful). Image creation stays in your dashboard/Zapier.

See: `docs/CUE_MARKETING_AGENTS_BRIEF.md` (Wiring Nano Banana) and `docs/MANUS_NANOBANA_SETUP.md`.

### Option 2: Custom skill that calls Nano Banana

If you want the **agent inside Manus** to trigger image generation:

1. **Build with Manus** or **Import from GitHub**: Create (or import) a skill whose instructions say “when the user asks for an image, call this API…” and that can perform HTTP requests (if Manus supports that for skills).
2. **Backend bridge:** Run a small backend that accepts “generate image with this prompt” and calls the [Nano Banana API](https://docs.nanobananaapi.ai). Expose it as a webhook/API and, if Manus allows, add it as a **tool** for the agent (not necessarily as a “Skill” in the Skills list). Then the agent can request images and get back a URL.

So “linking Nano Banana” in Manus = giving the agent a **tool** or **custom skill** that ultimately calls your backend or Nano Banana’s API. The Add → Skills menu won’t show “Nano Banana”; you’d use **Build with Manus** or **Import from GitHub** (plus your backend) to create that link.

### Option 3: Zapier in between

Manus runs the task → Zapier (e.g. on a new task or outcome) calls the Nano Banana API with the prompt from the task. No skill in Manus; the “link” is the Zap. Details in `docs/MANUS_NANOBANA_SETUP.md`.

---

## Short answer

- **Add skill:** Use **Add from official** to add **Research/Web search** (and optionally Writing). Use **Build with Manus** or **Import from GitHub** only if you need a custom workflow or image-calling skill.
- **Link Nano Banana:** Either (1) **no link in Manus** — agents output prompts, your dashboard/Sheet + Nano Banana API do “Create image” — or (2) **custom skill/tool** that calls your backend → Nano Banana API, added via Build with Manus or a GitHub skill plus backend.
