-- Run in Supabase SQL Editor when switching auth to Supabase (iOS app uses Supabase Auth + this table for profile).
-- Safe to run multiple times: drops policies if they exist, then recreates them.

-- 1. Enable RLS on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Read own row
DROP POLICY IF EXISTS "Users can read own row" ON public.users;
CREATE POLICY "Users can read own row"
  ON public.users FOR SELECT
  TO authenticated
  USING (id = auth.uid()::text);

-- 3. Insert own row (e.g. right after sign-up; id must = auth.uid())
DROP POLICY IF EXISTS "Users can insert own row" ON public.users;
CREATE POLICY "Users can insert own row"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid()::text);

-- 4. Update own row
DROP POLICY IF EXISTS "Users can update own row" ON public.users;
CREATE POLICY "Users can update own row"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

-- Service role (backend) bypasses RLS; anon/authenticated are restricted by the above.
