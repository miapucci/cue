-- Cue API schema. SQLite for MVP.

-- Users: created/linked via Sign in with Apple
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  apple_sub TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  social_link TEXT,
  role TEXT NOT NULL CHECK (role IN ('creator', 'talent')),
  onboarding_complete INTEGER NOT NULL DEFAULT 0,
  onboarding_step TEXT,
  sample_clip_urls TEXT, -- JSON array of up to 3 URLs
  stripe_connect_account_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Creator's first brief is free; we track per creator
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
  is_first_free INTEGER,
  payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending | captured | released | refunded
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_briefs_creator ON briefs(creator_id);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);

-- Submissions: one per talent per brief (claimed then upload)
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  brief_id TEXT NOT NULL REFERENCES briefs(id),
  talent_id TEXT NOT NULL REFERENCES users(id),
  video_url TEXT NOT NULL DEFAULT '',
  storage_key TEXT, -- our key for presigned upload
  status TEXT NOT NULL DEFAULT 'pendingReview' CHECK (status IN ('pendingReview', 'revisionRequested', 'approved', 'rejected')),
  revision_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(brief_id, talent_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_brief ON submissions(brief_id);
CREATE INDEX IF NOT EXISTS idx_submissions_talent ON submissions(talent_id);

-- Reviews: mutual after completion
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id),
  from_user_id TEXT NOT NULL REFERENCES users(id),
  to_user_id TEXT NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(submission_id, from_user_id)
);

-- Messages: revision notes thread per submission
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id),
  from_user_id TEXT NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_submission ON messages(submission_id);

-- Device tokens for push
CREATE TABLE IF NOT EXISTS device_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  token TEXT NOT NULL,
  platform TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, platform)
);
