# Automating marketing: posting and what we can’t automate

You already have agents that produce the weekly brief and content. This doc covers **automating the rest** (posting) and what **can’t** be automated (creating social accounts).

---

## 1. “Agents that create accounts” — what’s possible

**Creating social media accounts (Instagram, TikTok, LinkedIn, X) via bots or agents:**  
Platforms prohibit this in their Terms of Service. You can’t safely or compliantly automate “create an Instagram account” or “create a TikTok account.” Account creation and initial login are one-time, human steps.

**What you can do instead:**

- **One-time:** You (or your marketer) create the brand accounts manually and connect them once to a scheduler or API (see below).
- **If you mean “create accounts in our Cue app”:** That’s your own product; you can automate signups via your backend and/or Manus/API if you expose it.
- **If you mean “create posts”:** Yes — that’s the “post for us” part below.

So: no agents that create social accounts; yes to agents + automation that **post** for you once accounts exist and are connected.

---

## 2. “Agents that post for us” — yes, via automation

The flow you want:

1. **Strategy agent** (Misa) runs weekly → outputs brief.  
2. **Content agents** (Tobi, Addi, Mario) run → output captions + image prompts (and you get images via Nano Banana/dashboard).  
3. **Automation** takes that content and **posts** to Instagram, TikTok, LinkedIn, X (or schedules posts).

Manus doesn’t natively “log in and post” to social platforms. You get automation by connecting Manus (or your sheet/backend) to a **scheduler** or **platform APIs**.

### Option A: Scheduler app (easiest)

Use a tool that already has “post to Instagram/TikTok/LinkedIn/X”:

| Tool | What it does | How it fits |
|------|-----------------------------|-------------|
| **Buffer**, **Hootsuite**, **Later**, **Meta Business Suite** | You connect your social accounts once (OAuth). Then you (or an API) create “posts” with caption + image + schedule; they publish at the set time. | Manus agents output a table (platform, caption, image URL). You (or a Zap/backend) push each row to the scheduler’s API or “draft” queue. A human can approve, or you auto-schedule. |

**Automation chain:**

1. **Manus** (or you) puts the week’s posts into a **Google Sheet** (Platform | Caption | Image URL | Scheduled time).  
2. **Zapier:** “New row in Sheet” or “Scheduled trigger” → “Create post in Buffer” (or Hootsuite/Later) with that row’s caption + image URL + platform + time.  
3. **Buffer** (or the scheduler) posts at the scheduled time.

So “agents that post for us” = **agents produce content** → **sheet or API** → **Zapier (or backend)** → **scheduler** → **platforms**. No extra “posting agent” in Manus; the posting is done by the scheduler once it has the content.

### Option B: Your backend + platform APIs

If you want full control and no third-party scheduler:

1. **Connect accounts once:** Use each platform’s OAuth (Instagram Graph API, TikTok API, LinkedIn API, X API) so your backend can act on behalf of the brand account.  
2. **Data source:** Same as above — a sheet or internal DB with rows: platform, caption, image URL, scheduled_time.  
3. **Your backend:** A job (cron or queue) reads rows where `scheduled_time <= now` and `status = pending`, calls the right platform API to create a post, then marks the row as `posted`.

Agents still only produce content; your backend does the actual “post for us.”

### Option C: Manus + Zapier (trigger and deliver)

- **Trigger:** Zapier “Schedule” (e.g. every Monday) → “Create Manus task” with prompt: “Run weekly research and output the WEEKLY MARKETING BRIEF.”  
- **Deliver:** When the task completes, Manus (via webhook or Zapier “Watch Manus task”) can pass the output to the next Zap step: e.g. “Add rows to Google Sheet” or “Send to Buffer.”  
- Then a second Zap (sheet → Buffer, or sheet → your backend) handles **posting** as in A or B.

So you can automate “run Strategy every week” and “put content into the sheet/scheduler”; the actual “post” is still the scheduler or your API.

---

## 3. Practical next steps

1. **Accounts:** Create and connect your brand’s social accounts once (Instagram, TikTok, etc.) to one scheduler (e.g. Buffer) or to your backend via OAuth. No agent needed for this.  
2. **Content:** Keep using Misa → Tobi, Addi, Mario. Their output (plus your “Create image” step for visuals) stays the same.  
3. **Posting:**  
   - **Quick path:** Put the week’s posts (platform, caption, image URL, time) into a **Google Sheet**. Use **Zapier** to create scheduled posts in **Buffer** (or Hootsuite/Later) from that sheet. Buffer then “posts for you” at the right time.  
   - **Dev path:** Backend that reads from the same sheet (or your DB), calls Instagram/TikTok/LinkedIn/X APIs to publish; run on a schedule or when rows are “ready to post.”

---

## 4. Summary

| Question | Answer |
|----------|--------|
| Agents that **create** (social) **accounts**? | No. Platforms don’t allow automated account creation. Do it once, manually. |
| Agents that **post** for us? | Yes, but “posting” is done by a **scheduler** (Buffer, Hootsuite, etc.) or **your backend** using platform APIs. Agents produce the content; automation sends that content to the scheduler/API. |
| How automated can it be? | Fully: Strategy on a schedule (Zapier → Manus) → content into sheet → Zapier/backend → scheduler/API → posts go out. You only need to connect accounts once and optionally approve drafts. |
