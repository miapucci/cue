-- Run in Supabase SQL Editor if your users table is missing sample_clip_urls.
-- Safe to run multiple times (IF NOT EXISTS).

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS sample_clip_urls TEXT;
