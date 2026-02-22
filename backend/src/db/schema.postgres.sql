-- Cue API schema for Postgres (Supabase). One code path: use DATABASE_URL everywhere.

-- Users: created via Sign in with Apple or email+password
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  apple_sub TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT,
  display_name TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  social_link TEXT,
  role TEXT NOT NULL CHECK (role IN ('creator', 'talent')),
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_step TEXT,
  sample_clip_urls TEXT,
  stripe_connect_account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);
-- For email+password: set apple_sub = 'email:' || email, and set email + password_hash.

CREATE INDEX IF NOT EXISTS idx_users_apple_sub ON users(apple_sub);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- If users table already existed, add new columns with:
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Briefs
CREATE TABLE IF NOT EXISTS briefs (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  pay_rate_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  deadline TEXT NOT NULL,
  orientation TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  reference_video_url TEXT,
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('draft', 'live', 'closed', 'completed')),
  is_first_free SMALLINT,
  payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);

CREATE INDEX IF NOT EXISTS idx_briefs_creator ON briefs(creator_id);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);

-- Submissions
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  brief_id TEXT NOT NULL REFERENCES briefs(id),
  talent_id TEXT NOT NULL REFERENCES users(id),
  video_url TEXT NOT NULL DEFAULT '',
  storage_key TEXT,
  status TEXT NOT NULL DEFAULT 'pendingReview' CHECK (status IN ('pendingReview', 'revisionRequested', 'approved', 'rejected')),
  revision_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  UNIQUE(brief_id, talent_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_brief ON submissions(brief_id);
CREATE INDEX IF NOT EXISTS idx_submissions_talent ON submissions(talent_id);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id),
  from_user_id TEXT NOT NULL REFERENCES users(id),
  to_user_id TEXT NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  UNIQUE(submission_id, from_user_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id),
  from_user_id TEXT NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);

CREATE INDEX IF NOT EXISTS idx_messages_submission ON messages(submission_id);

-- Device tokens
CREATE TABLE IF NOT EXISTS device_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  token TEXT NOT NULL,
  platform TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  UNIQUE(user_id, platform)
);
