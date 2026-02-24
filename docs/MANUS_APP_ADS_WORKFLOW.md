# Cue app ads in Manus: images, video, carousels (no Nano Banana required)

Manus can generate **images**, **videos**, and **carousels** with its built-in tools. Use this workflow so agents and you create assets in Manus — no need for agents to auto-use Nano Banana or the browser.

**Creative direction (all assets):** Never feel like we're advertising our own product. Feel like we found something cool and wanted to share. Mention Cue at the end. Open to skits, UGC, whatever performs.

---

## 1. Generating images (app ads, social, mockups)

Use **Manus AI Design / image generation** for app screenshots, promotional posters, ad banners, social graphics, icons.

**Steps:**

1. Go to [manus.im](https://manus.im) and log in.
2. Open **AI Design** or the **image generator** (e.g. [manus.im/tools/ai-design](https://manus.im/tools/ai-design) or the Image Generation section).
3. Enter a detailed prompt. Example for Cue:

   ```
   Create a modern app promotion image for Cue (app where creators post video briefs and talent get cast): sleek phone mockup showing the app's dark UI and electric blue accent (#00D4FF), creator and talent vibes — not corporate, like someone found a cool app and wanted to share. Text overlay optional: "Your cue to create." High-resolution, Instagram ad format 1080x1080 or 9:16 for stories. Minimal, premium, no stock smiles.
   ```

4. Manus generates options; refine with follow-up prompts if needed (e.g. "Make it more UGC-style" or "Add a subtle Cue logo at the end").
5. Download the final image(s).

**Use for:** Static ads, stories, carousel panels, social posts. Agents can output **ready-to-paste prompts** for this tool so you or Sandra run them without the agent auto-calling Nano Banana.

---

## 2. Generating videos (app demos, teasers, UGC-style)

Manus supports **text-to-video** and **image-to-video** — short app demos, teaser ads, UGC-style clips.

**Steps:**

1. Open Manus **video tools**, e.g.:
   - **Text-to-video:** describe the video from scratch.
   - **Image-to-video:** start from an app screenshot or mockup and animate it.
   - Or use the general video generator / playbook.
2. **Text-to-video prompt** example for Cue:

   ```
   Generate a 15-second promotional video for Cue (app for creators and talent to post briefs and get cast): feels like someone found a cool app and is sharing it — not an ad. Show quick cuts: creator posting a brief, talent submitting a clip, dark UI with electric blue accent. Text at the end only: "Your cue to create. Find it on the app store." Vertical 9:16 for Reels/TikTok. UGC-style, authentic, no corporate vibe.
   ```

3. **Image-to-video:** Upload an app screenshot or mockup, then prompt:

   ```
   Animate this app interface into a 15–20 second demo: zoom on key screens, subtle motion, end with "Your cue to create" and app store buttons. Vertical format, Reels/TikTok. Feels like a friend sharing something they found, not a brand ad.
   ```

4. Manus handles scenes, transitions, and (where supported) audio. Review, iterate, export.

**Use for:** Social ads, Reels, TikTok, product clips. Agents can output **ready-to-paste video prompts** for you to run in these tools.

---

## 3. Generating carousels (multi-slide posts)

Use **Manus AI Slides** (Nano Banana Pro) to create full carousels in one prompt — export as images or PDF for Instagram/LinkedIn.

**Steps:**

1. Go to **AI Slides** (e.g. [manus.im/tools/nano-banana-pro-slides](https://manus.im/tools/nano-banana-pro-slides) or under AI design).
2. One detailed prompt for the whole carousel. Example for Cue:

   ```
   Create a 6-slide Instagram carousel for Cue (app where creators post video briefs and talent get cast): Slide 1: Eye-catching cover "Your cue to create" — found something cool vibe, not corporate. Slide 2: Creator angle — "I need video" / find talent. Slide 3: Talent angle — "I want to get cast" / get paid. Slide 4: Quick app mockup (dark UI, electric blue). Slide 5: One testimonial-style line. Slide 6: "Find talent or get cast" + soft CTA. Dark background #0D0D0D, accent #00D4FF, minimal, consistent. Export-ready for Instagram carousel.
   ```

3. Manus generates the full carousel; edit individual slides if needed.
4. Export as PDF or separate images → upload to Instagram/LinkedIn as a carousel.

**Use for:** Instagram/LinkedIn carousels. Agents can output **one carousel prompt** per concept for you to run in AI Slides.

---

## 4. How agents fit in (no auto Nano Banana)

**Option A – Agents use Manus tools in-task:** If your Cue project has **Manus image generation**, **video**, or **Slides** available as tools, the agents (Tobi, Addi, Mario) can be instructed to *use those Manus tools* when creating assets. They do **not** need to open Nano Banana in the browser.

**Option B – Agents output prompts, you run in Manus:** If you prefer to control credits and review in the UI, agents only output **copy + a ready-to-paste prompt** for each asset. You (or Sandra) paste the prompt into:
- **AI Design / image generator** for images
- **Text-to-video or image-to-video** for videos  
- **AI Slides** for carousels  

Then you download and use the assets. No agent auto-use of Nano Banana or browser.

**Recommendation:** Use **Option B** for evaluation and one-off tests (so you don’t burn credits in the background). Use **Option A** when Manus exposes image/video/Slides to the agent and you want full automation. Either way, agents should **not** be instructed to "use the browser to open Nano Banana" — use Manus’s own tools or output prompts only.

---

## 5. Quick reference

| Asset type   | Where in Manus              | Agent outputs                          |
|-------------|-----------------------------|----------------------------------------|
| **Images**  | AI Design / image generator | Caption + **image prompt** (paste into Manus) or use in-task tool |
| **Videos**  | Text-to-video / image-to-video | Concept + **video prompt** (paste into Manus) or use in-task tool |
| **Carousels** | AI Slides (Nano Banana Pro) | **One carousel prompt** (paste into AI Slides) or use in-task tool |

**Prompt tips:** Include app name (Cue), key message (Your cue to create; find talent or get cast), format (e.g. 9:16, 1080x1080), brand colors (#0D0D0D, #00D4FF), and creative direction: "Feels like we found something cool and wanted to share — not advertising our product."

---

## 6. Links

- Manus: [manus.im](https://manus.im)
- AI Design: look for **AI Design** or **image generator** in the app or at `/tools/ai-design`
- Video: **text-to-video** / **image-to-video** or **video generator** playbook
- Carousels: **AI Slides** / **Nano Banana Pro Slides** (e.g. `/tools/nano-banana-pro-slides`)
- Chat shortcut: “Help me create advertising assets for my app” to get guided to the right tools
