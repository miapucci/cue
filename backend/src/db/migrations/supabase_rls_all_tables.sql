-- Enable RLS on all public tables that are exposed via API.
-- Run in Supabase SQL Editor. Safe to run multiple times (drops policies then recreates).
-- Uses (select auth.uid()) for initplan performance; single policy per role/action to avoid multiple_permissive_policies.

-- ========== BRIEFS ==========
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Briefs: creator full access" ON public.briefs;
DROP POLICY IF EXISTS "Briefs: anyone can read live" ON public.briefs;

CREATE POLICY "Briefs: select"
  ON public.briefs FOR SELECT
  TO authenticated
  USING (creator_id = (select auth.uid())::text OR status = 'live');

CREATE POLICY "Briefs: insert"
  ON public.briefs FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (select auth.uid())::text);

CREATE POLICY "Briefs: update"
  ON public.briefs FOR UPDATE
  TO authenticated
  USING (creator_id = (select auth.uid())::text)
  WITH CHECK (creator_id = (select auth.uid())::text);

CREATE POLICY "Briefs: delete"
  ON public.briefs FOR DELETE
  TO authenticated
  USING (creator_id = (select auth.uid())::text);

-- ========== SUBMISSIONS ==========
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Submissions: talent own" ON public.submissions;
DROP POLICY IF EXISTS "Submissions: creator of brief" ON public.submissions;

CREATE POLICY "Submissions: select"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (
    talent_id = (select auth.uid())::text
    OR EXISTS (SELECT 1 FROM public.briefs b WHERE b.id = submissions.brief_id AND b.creator_id = (select auth.uid())::text)
  );

CREATE POLICY "Submissions: insert"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (talent_id = (select auth.uid())::text);

CREATE POLICY "Submissions: update"
  ON public.submissions FOR UPDATE
  TO authenticated
  USING (
    talent_id = (select auth.uid())::text
    OR EXISTS (SELECT 1 FROM public.briefs b WHERE b.id = submissions.brief_id AND b.creator_id = (select auth.uid())::text)
  )
  WITH CHECK (
    talent_id = (select auth.uid())::text
    OR EXISTS (SELECT 1 FROM public.briefs b WHERE b.id = submissions.brief_id AND b.creator_id = (select auth.uid())::text)
  );

CREATE POLICY "Submissions: delete"
  ON public.submissions FOR DELETE
  TO authenticated
  USING (
    talent_id = (select auth.uid())::text
    OR EXISTS (SELECT 1 FROM public.briefs b WHERE b.id = submissions.brief_id AND b.creator_id = (select auth.uid())::text)
  );

-- ========== REVIEWS ==========
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews: from_user or to_user" ON public.reviews;
DROP POLICY IF EXISTS "Reviews: from_user insert update" ON public.reviews;
DROP POLICY IF EXISTS "Reviews: from_user update" ON public.reviews;

CREATE POLICY "Reviews: from_user or to_user"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (from_user_id = (select auth.uid())::text OR to_user_id = (select auth.uid())::text);

CREATE POLICY "Reviews: from_user insert"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (from_user_id = (select auth.uid())::text);

CREATE POLICY "Reviews: from_user update"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (from_user_id = (select auth.uid())::text)
  WITH CHECK (from_user_id = (select auth.uid())::text);

-- ========== MESSAGES ==========
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Messages: participant read" ON public.messages;
DROP POLICY IF EXISTS "Messages: from_user insert" ON public.messages;

CREATE POLICY "Messages: participant read"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    from_user_id = (select auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.submissions s
      JOIN public.briefs b ON b.id = s.brief_id
      WHERE s.id = messages.submission_id
        AND (s.talent_id = (select auth.uid())::text OR b.creator_id = (select auth.uid())::text)
    )
  );

CREATE POLICY "Messages: from_user insert"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (from_user_id = (select auth.uid())::text);

-- ========== DEVICE_TOKENS ==========
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Device tokens: own only" ON public.device_tokens;

CREATE POLICY "Device tokens: own only"
  ON public.device_tokens FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid())::text)
  WITH CHECK (user_id = (select auth.uid())::text);
