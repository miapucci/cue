# Tobi + Nano Banana: let the Social agent generate images

You want **Tobi** (the Social content agent) to **generate the images** for each post using Nano Banana, so your marketer gets caption + image ready to paste into the platform and hit Post. This doc is the setup.

**Prefer Manus only (no Nano Banana)?** Use **Manus’s built-in tools** for images, video, and carousels instead. Agents then use Manus’s image/video/Slides tools or output **Ready-to-paste prompts** for you to run in Manus. See **`docs/MANUS_APP_ADS_WORKFLOW.md`** and **`docs/MANUS_AGENTS_CREATIVE_DIRECTION_AND_TEST.md`** for the updated agent instructions.

---

## 1. Manus’s built-in Nano Banana Pro

Manus has **Nano Banana Pro** integrated for:

- **Slides:** Batch-generated slide decks (Nano Banana Pro templates in Slides).
- **Standalone images:** In Manus, go to **Image Generation** (or the tool that uses Nano Banana Pro), describe the image, generate and download.

For **Tobi to generate images inside a task**, the agent needs to be able to call that image-generation capability. That usually means it’s available as a **tool** or **integration** for the project or the task.

---

## 2. Enable image generation for the Cue project (so Tobi can use it)

1. **Open the Cue project** in Manus.
2. **Find project tools / integrations.**  
   On the project screen you often see connected tools (e.g. Google Drive, GitHub, Slack, Notion). Look for:
   - **“Add tool”** / **“Connect”** / **“Integrations”**, or  
   - A **Nano Banana Pro** or **Image generation** option.
3. **Add or enable Nano Banana Pro (or Image generation)** for the Cue project.  
   If you see “Nano Banana Pro” or “Image generation” in the list, add or turn it on for this project so tasks in the project (including Tobi’s) can use it.
4. **If you don’t see it:** Check **Workspace settings** or **Account** for “Integrations” or “Nano Banana Pro” and enable it there; it may then show up for projects. Manus docs: [Nano Banana Pro](https://manus.im/docs/integrations/nano-banana-pro).

Once it’s enabled for the project, Tobi’s task should have access to image generation when you run it.

---

## 2b. Or: use your connected browser (Browser Operator)

If you **connected your browser to Manus** (Manus Browser Operator), Tobi can **use that browser to access Nano Banana** directly. No need for a separate Nano Banana Pro integration in the project.

**How it works:** Manus Browser Operator uses your **local browser** and **existing logins**. So:

1. **Be logged into Nano Banana** in the browser that Manus controls (e.g. open [nanobanana.io](https://nanobanana.io) or your Nano Banana Pro URL, log in, and leave that session available). When you run a task that needs the browser, Manus will use that browser — and your login — to open Nano Banana.
2. **When you run Tobi’s task**, grant **browser access** when Manus asks, so the agent can open Nano Banana, enter the prompt for each post, generate the image, and capture or download it.
3. **Tell Tobi** to use the browser to go to Nano Banana and generate each image (see the browser-specific block in section 3 below).

**Pros:** Uses the Nano Banana interface you already have; no extra project integration. **Cons:** The agent has to navigate and click (slower, and can be less reliable if the site layout changes). Best when you’re already using the Browser Operator and logged into Nano Banana.

---

## 3. What to tell Tobi (copy-paste for the Social task)

Paste this into **Tobi’s task** (or into the Social agent’s first message in the Cue project) so Tobi generates images when the tool is available:

```
You are the social content agent for Cue. You only run when given a WEEKLY MARKETING BRIEF from our strategy agent. You have access to image generation (Nano Banana Pro) — use it to create the visual for each post that needs one.

**Cue context:** App where creators post video briefs and talent get cast and get paid. Tagline: Your cue to create. Find talent or get cast. Creator angle: I need video — find talent, get the video. Talent angle: I want to get cast — get paid to be on camera.

**Your job:** Using the attached weekly brief (cadence, post types by platform, content mix), draft every post for this week. For each post:

1. **Platform** (Instagram, TikTok, LinkedIn, or X) and **Post type** (e.g. Reel, carousel, single image, thread).
2. **Caption (copy into app and post):** The exact caption the marketer will paste into the platform. Include hashtags where the platform uses them (e.g. Instagram). Output only the caption text.
3. **Image:** Use the image generation tool (Nano Banana Pro) with a short, concrete prompt (what the visual should show, style, mood; e.g. minimal app mockup on dark background, phone showing "Your cue to create" screen, premium feel). Include the generated image or a link to it in your reply so the marketer can download it, paste the caption, attach the image, and hit Post.

Follow the brief's cadence exactly. Mix creator-focused and talent-focused posts as specified. Tone: confident, clear, a bit bold. No jargon. For every post that needs a visual, generate the image with the tool and attach or link it — the marketer should not have to create images elsewhere. Format each post as a clear block: **Platform**, **Post type**, **Caption (copy into app and post):**, **Image:** (generated and attached/linked).
```

If image generation is **not** available in the project, Tobi will fall back to outputting **Image prompt:** for each post; your marketer can then use your dashboard/sheet to create the image and paste caption + image and post.

---

## 3b. If Tobi is using the connected browser to access Nano Banana

When you’re using the **Browser Operator** (your browser connected to Manus) and you’re logged into Nano Banana in that browser, paste this into Tobi’s task so Tobi uses the browser to generate images:

```
You are the social content agent for Cue. You only run when given a WEEKLY MARKETING BRIEF from our strategy agent. You have access to the connected browser — use it to open Nano Banana (I am already logged in there) and generate the visual for each post that needs one.

**Cue context:** App where creators post video briefs and talent get cast and get paid. Tagline: Your cue to create. Find talent or get cast. Creator angle: I need video — find talent, get the video. Talent angle: I want to get cast — get paid to be on camera.

**Your job:** Using the attached weekly brief (cadence, post types by platform, content mix), draft every post for this week. For each post:

1. **Platform** (Instagram, TikTok, LinkedIn, or X) and **Post type** (e.g. Reel, carousel, single image, thread).
2. **Caption (copy into app and post):** The exact caption the marketer will paste into the platform. Include hashtags where the platform uses them (e.g. Instagram). Output only the caption text.
3. **Image:** Use the browser to go to Nano Banana (I'm logged in). For each post that needs a visual, enter a short, concrete image prompt (what the visual should show, style, mood; e.g. minimal app mockup on dark background, phone showing "Your cue to create" screen, premium feel), generate the image, and include the generated image or a link to it in your reply so the marketer can download it, paste the caption, attach the image, and hit Post.

Follow the brief's cadence exactly. Mix creator-focused and talent-focused posts as specified. Tone: confident, clear, a bit bold. No jargon. For every post that needs a visual, use the browser to generate the image in Nano Banana and attach or link it — the marketer should not have to create images elsewhere. Format each post as a clear block: **Platform**, **Post type**, **Caption (copy into app and post):**, **Image:** (generated via Nano Banana and attached/linked).
```

When you start the task, **grant browser access** when Manus asks so Tobi can control the browser and open Nano Banana.

---

## 4. Video (TikTok, Reels, etc.)

Manus’s Nano Banana Pro integration is described for **images** and **slide decks**, not for full **video** generation. So today Tobi can:

- **Generate images** for posts (single image, carousel, or visual for a Reel thumbnail/concept).
- **Output copy and image prompts** for video (e.g. hook, script, “visual concept”); the actual video file would be created elsewhere (e.g. CapCut, another tool, or Nano Banana’s own video API if/when you have it).

If Nano Banana or Manus later add in-task video generation, you can add a line to Tobi’s instructions: “For TikTok/Reels, use the video generation tool when available; otherwise output the script and visual concept.”

---

## 5. Summary

| Step | Action |
|------|--------|
| 1 | **Option A:** Enable **Nano Banana Pro** or **Image generation** in the Cue project’s tools/integrations. **Option B:** Connect your **browser** to Manus (Browser Operator) and stay **logged into Nano Banana** in that browser. |
| 2 | In Tobi’s task, use the instructions in **section 3** (built-in tool) or **section 3b** (browser). When using the browser, **grant browser access** when Manus asks. |
| 3 | Marketer’s flow: open Tobi’s output → for each post, copy **Caption (copy into app and post)** → download/use the **Image** Tobi generated → paste into the platform and hit Post. |

Images are generated by Tobi in Manus (via the built-in tool or via your browser on Nano Banana); video is still copy + concept for now unless you add a separate video tool later.
