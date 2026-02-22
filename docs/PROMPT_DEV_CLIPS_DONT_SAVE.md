# Prompt: Clips Don’t Save When Talent Adds Them

**Send this to your developer agent.**

---

## Prompt to send

```
The clip picker works now – talent can pull up videos – but when they add clips, nothing saves. Fix the save flow so that when talent adds clips (and taps Done), the clips are actually persisted.

**What’s happening**
- User can open the picker and select videos (that part works).
- When they “add” a clip or tap Done, the data is not being saved – either it’s not sent to the backend, the backend isn’t writing to the database, or the app isn’t updating state correctly after a successful save.

**What you need to do**

1. **Trace the full save path for the 3-clips flow**
   - When the user picks a video for a slot: does the app get a file URL, upload it to the backend (e.g. POST /me/sample-clips or equivalent), and store the returned URL in state (e.g. clipURLs[index] = url)?
   - When the user taps Done: does the app call PATCH /me with sampleClipURLs: [url1, url2, url3] and onboardingStep: "earnings_teaser"? Does the backend actually UPDATE the users table (sample_clip_urls, onboarding_step)?
   - After a successful PATCH, does the app call app.updateUser(updatedUser) so the UI and flow advance to the next step?
   - Fix any broken step: ensure each selected clip is uploaded and its URL is stored, ensure Done sends those URLs in updateMe, ensure the backend writes to the database and returns the updated user, and ensure the app updates local state from the response.

2. **Backend**
   - Confirm the sample-clip upload endpoint exists and returns a URL that is then sent in PATCH /me.
   - Confirm PATCH /me accepts sampleClipURLs and runs an UPDATE on the users table (e.g. sample_clip_urls = $1, onboarding_step = $2). Verify in Supabase Table Editor that after “Done,” the user row has sample_clip_urls and onboarding_step set.

3. **iOS**
   - Ensure the callback from the clip picker receives the selected video (file URL or upload result) and that the app stores the resulting URL in the slot (clipURLs[index] = urlString), not just a placeholder like "picked".
   - Ensure completeClips() (or the Done action) builds the array of 3 URLs from clipURLs and passes them to updateMe(..., sampleClipURLs: urls, onboardingStep: "earnings_teaser"). If the API signature doesn’t support sampleClipURLs, add it and wire it through.
   - On success, call app.updateUser(response) so the flow advances. On failure, show a clear error (e.g. “Could not save clips. Try again.”) and don’t advance.

4. **Terminal feedback (optional context)**
   - The user shared terminal output that includes: “System gesture gate timed out,” “Result accumulator timeout,” “process may not map database” (Code -54), and “personaAttributesForPersonaType … usermanagerd … connection invalidated.” Much of that is system/simulator noise (Launch Services, keyboard, user manager). Focus on fixing the save flow; if something in our code triggers a long-running operation on the main thread or a bad system call, fix that, but the main ask is: **clips must save when they add them.**

**Definition of done**
- Talent picks a video for slot 1 → it’s uploaded (or stored) and the slot shows as added (with the real URL stored).
- Same for slots 2 and 3.
- Talent taps Done → the 3 clip URLs are sent to the backend (PATCH /me with sampleClipURLs and onboardingStep), the backend updates the users row, and the app advances to the next onboarding step. In Supabase, the user row has sample_clip_urls populated and onboarding_step updated.
```

---

Use this in the Tobi repo. Key areas: **TalentAddClipsView** (clip state, Done handler, call to updateMe with sampleClipURLs), **ClipPickerView** or equivalent (must pass back a URL or upload result so the slot can store it), **HTTPAPIClient** (updateMe with sampleClipURLs, upload sample-clip if separate), **backend** PATCH /me and sample-clip upload route, and **backend db** updateUser / users table.
