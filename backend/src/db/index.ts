/**
 * Postgres (Supabase) — one code path. Set DATABASE_URL in env (local and production).
 */

import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Brief, Submission, User, VideoFormat } from '../types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

let pool: Pool;

export function getPool(): Pool {
  if (!pool) {
    const url = process.env['DATABASE_URL'];
    if (!url) throw new Error('DATABASE_URL is required (e.g. Supabase connection string)');
    pool = new Pool({ connectionString: url });
    pool.on('error', (err: Error) => console.error('Postgres pool error', err));
  }
  return pool;
}

export async function initDb(): Promise<void> {
  const schema = readFileSync(join(__dirname, 'schema.postgres.sql'), 'utf-8');
  await getPool().query(schema);
}

// --- Users ---

export async function insertUser(row: {
  id: string;
  apple_sub: string;
  role: string;
  display_name?: string;
  onboarding_step?: string;
  email?: string | null;
  password_hash?: string | null;
}): Promise<void> {
  await getPool().query(
    `INSERT INTO users (id, apple_sub, role, display_name, onboarding_step, email, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      row.id,
      row.apple_sub,
      row.role,
      row.display_name ?? '',
      row.onboarding_step ?? null,
      row.email ?? null,
      row.password_hash ?? null,
    ]
  );
}

export async function findUserByAppleSub(appleSub: string): Promise<UserRow | undefined> {
  const r = await getPool().query('SELECT * FROM users WHERE apple_sub = $1', [appleSub]);
  return rowToUserRow(r.rows[0]);
}

export async function findUserByEmail(email: string): Promise<UserRow | undefined> {
  const r = await getPool().query('SELECT * FROM users WHERE email = $1', [email]);
  return rowToUserRow(r.rows[0]);
}

export async function findUserById(id: string): Promise<UserRow | undefined> {
  const r = await getPool().query('SELECT * FROM users WHERE id = $1', [id]);
  return rowToUserRow(r.rows[0]);
}

export async function updateUser(
  id: string,
  updates: {
    display_name?: string;
    bio?: string;
    social_link?: string | null;
    onboarding_step?: string | null;
    onboarding_complete?: boolean;
    sample_clip_urls?: string | null;
  }
): Promise<void> {
  const u = updates as Record<string, unknown>;
  const set: string[] = [];
  const vals: unknown[] = [];
  let n = 1;
  if (u.display_name !== undefined) { set.push(`display_name = $${n++}`); vals.push(u.display_name); }
  if (u.bio !== undefined) { set.push(`bio = $${n++}`); vals.push(u.bio); }
  if (u.social_link !== undefined) { set.push(`social_link = $${n++}`); vals.push(u.social_link); }
  if (u.onboarding_step !== undefined) { set.push(`onboarding_step = $${n++}`); vals.push(u.onboarding_step); }
  if (u.onboarding_complete !== undefined) { set.push(`onboarding_complete = $${n++}`); vals.push(u.onboarding_complete); }
  if (u.sample_clip_urls !== undefined) { set.push(`sample_clip_urls = $${n++}`); vals.push(u.sample_clip_urls); }
  if (set.length === 0) return;
  vals.push(id);
  await getPool().query(`UPDATE users SET ${set.join(', ')} WHERE id = $${n}`, vals);
}

export interface UserRow {
  id: string;
  apple_sub: string;
  email: string | null;
  password_hash: string | null;
  display_name: string;
  bio: string;
  social_link: string | null;
  role: string;
  onboarding_complete: number;
  onboarding_step: string | null;
  sample_clip_urls: string | null;
  stripe_connect_account_id: string | null;
  created_at: string;
}

function rowToUserRow(row: Record<string, unknown> | undefined): UserRow | undefined {
  if (!row) return undefined;
  return {
    id: row.id as string,
    apple_sub: row.apple_sub as string,
    email: (row.email as string) ?? null,
    password_hash: (row.password_hash as string) ?? null,
    display_name: (row.display_name as string) ?? '',
    bio: (row.bio as string) ?? '',
    social_link: row.social_link as string | null,
    role: row.role as string,
    onboarding_complete: row.onboarding_complete === true ? 1 : 0,
    onboarding_step: row.onboarding_step as string | null,
    sample_clip_urls: row.sample_clip_urls as string | null,
    stripe_connect_account_id: row.stripe_connect_account_id as string | null,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

export function userRowToUser(row: UserRow): User {
  let sampleClipURLs: string[] | null = null;
  if (row.sample_clip_urls) {
    try {
      const parsed = JSON.parse(row.sample_clip_urls) as unknown;
      if (Array.isArray(parsed)) sampleClipURLs = parsed.filter((x): x is string => typeof x === 'string');
    } catch {
      // ignore invalid JSON
    }
  }
  return {
    id: row.id,
    displayName: row.display_name,
    bio: row.bio,
    socialLink: row.social_link,
    role: row.role as User['role'],
    onboardingComplete: row.onboarding_complete === 1,
    onboardingStep: row.onboarding_step,
    sampleClipURLs: sampleClipURLs ?? undefined,
  };
}

// --- Briefs ---

export interface BriefRow {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  pay_rate_cents: number;
  currency: string;
  deadline: string;
  orientation: string;
  duration_seconds: number;
  reference_video_url: string | null;
  status: string;
  is_first_free: number | null;
  payment_intent_id: string | null;
  payment_status: string;
  created_at: string;
}

function rowToBriefRow(row: Record<string, unknown> | undefined): BriefRow | undefined {
  if (!row) return undefined;
  return {
    id: row.id as string,
    creator_id: row.creator_id as string,
    title: row.title as string,
    description: row.description as string,
    pay_rate_cents: Number(row.pay_rate_cents),
    currency: row.currency as string,
    deadline: row.deadline as string,
    orientation: row.orientation as string,
    duration_seconds: Number(row.duration_seconds),
    reference_video_url: row.reference_video_url as string | null,
    status: row.status as string,
    is_first_free: row.is_first_free != null ? Number(row.is_first_free) : null,
    payment_intent_id: row.payment_intent_id as string | null,
    payment_status: (row.payment_status as string) ?? 'pending',
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

export function briefRowToBrief(row: BriefRow, submissionCount: number | null): Brief {
  const format: VideoFormat = {
    orientation: row.orientation as VideoFormat['orientation'],
    durationSeconds: row.duration_seconds,
  };
  return {
    id: row.id,
    creatorId: row.creator_id,
    title: row.title,
    description: row.description,
    payRateCents: row.pay_rate_cents,
    currency: row.currency,
    deadline: row.deadline,
    format,
    referenceVideoURL: row.reference_video_url,
    status: row.status as Brief['status'],
    submissionCount,
    isFirstFree: row.is_first_free === 1 ? true : row.is_first_free === 0 ? false : null,
  };
}

export async function countSubmissionsForBrief(briefId: string): Promise<number> {
  const r = await getPool().query('SELECT COUNT(*)::int AS c FROM submissions WHERE brief_id = $1', [briefId]);
  return Number(r.rows[0]?.c ?? 0);
}

export async function insertBrief(row: {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  pay_rate_cents: number;
  currency: string;
  deadline: string;
  orientation: string;
  duration_seconds: number;
  reference_video_url: string | null;
  status: string;
  is_first_free: number | null;
  payment_intent_id?: string | null;
  payment_status?: string;
}): Promise<void> {
  await getPool().query(
    `INSERT INTO briefs (id, creator_id, title, description, pay_rate_cents, currency, deadline,
      orientation, duration_seconds, reference_video_url, status, is_first_free, payment_intent_id, payment_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      row.id, row.creator_id, row.title, row.description, row.pay_rate_cents, row.currency, row.deadline,
      row.orientation, row.duration_seconds, row.reference_video_url, row.status, row.is_first_free,
      row.payment_intent_id ?? null, row.payment_status ?? 'pending',
    ]
  );
}

export async function findBriefById(id: string): Promise<BriefRow | undefined> {
  const r = await getPool().query('SELECT * FROM briefs WHERE id = $1', [id]);
  return rowToBriefRow(r.rows[0]);
}

export async function findBriefsByCreator(creatorId: string): Promise<BriefRow[]> {
  const r = await getPool().query('SELECT * FROM briefs WHERE creator_id = $1 ORDER BY created_at DESC', [creatorId]);
  return r.rows.map((row: Record<string, unknown>) => rowToBriefRow(row)!).filter(Boolean);
}

export async function countCreatorLiveBriefs(creatorId: string): Promise<number> {
  const r = await getPool().query('SELECT COUNT(*)::int AS c FROM briefs WHERE creator_id = $1 AND status = $2', [creatorId, 'live']);
  return Number(r.rows[0]?.c ?? 0);
}

export async function updateBriefPaymentStatus(id: string, paymentStatus: string): Promise<void> {
  await getPool().query('UPDATE briefs SET payment_status = $1 WHERE id = $2', [paymentStatus, id]);
}

export async function updateBriefPaymentIntent(id: string, paymentIntentId: string, paymentStatus: string): Promise<void> {
  await getPool().query('UPDATE briefs SET payment_intent_id = $1, payment_status = $2 WHERE id = $3', [paymentIntentId, paymentStatus, id]);
}

// --- Submissions ---

export interface SubmissionRow {
  id: string;
  brief_id: string;
  talent_id: string;
  video_url: string;
  storage_key: string | null;
  status: string;
  revision_notes: string | null;
  created_at: string;
}

function rowToSubmissionRow(row: Record<string, unknown> | undefined): SubmissionRow | undefined {
  if (!row) return undefined;
  return {
    id: row.id as string,
    brief_id: row.brief_id as string,
    talent_id: row.talent_id as string,
    video_url: (row.video_url as string) ?? '',
    storage_key: row.storage_key as string | null,
    status: row.status as string,
    revision_notes: row.revision_notes as string | null,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

export function submissionRowToSubmission(row: SubmissionRow): Submission {
  return {
    id: row.id,
    briefId: row.brief_id,
    talentId: row.talent_id,
    videoURL: row.video_url,
    status: row.status as Submission['status'],
    revisionNotes: row.revision_notes,
    createdAt: row.created_at,
  };
}

export async function insertSubmission(row: { id: string; brief_id: string; talent_id: string }): Promise<void> {
  await getPool().query('INSERT INTO submissions (id, brief_id, talent_id) VALUES ($1, $2, $3)', [row.id, row.brief_id, row.talent_id]);
}

export async function findSubmissionById(id: string): Promise<SubmissionRow | undefined> {
  const r = await getPool().query('SELECT * FROM submissions WHERE id = $1', [id]);
  return rowToSubmissionRow(r.rows[0]);
}

export async function findSubmissionsByBrief(briefId: string): Promise<SubmissionRow[]> {
  const r = await getPool().query('SELECT * FROM submissions WHERE brief_id = $1 ORDER BY created_at ASC', [briefId]);
  return r.rows.map((row: Record<string, unknown>) => rowToSubmissionRow(row)!).filter(Boolean);
}

export async function findSubmissionByBriefAndTalent(briefId: string, talentId: string): Promise<SubmissionRow | undefined> {
  const r = await getPool().query('SELECT * FROM submissions WHERE brief_id = $1 AND talent_id = $2', [briefId, talentId]);
  return rowToSubmissionRow(r.rows[0]);
}

export async function updateSubmissionVideo(id: string, videoUrl: string, storageKey: string | null): Promise<void> {
  await getPool().query('UPDATE submissions SET video_url = $1, storage_key = $2, status = $3 WHERE id = $4', [videoUrl, storageKey, 'pendingReview', id]);
}

export async function updateSubmissionStatus(id: string, status: string, revisionNotes: string | null): Promise<void> {
  await getPool().query('UPDATE submissions SET status = $1, revision_notes = $2 WHERE id = $3', [status, revisionNotes, id]);
}

// --- Brief feed ---

export async function findLiveBriefs(limit: number, cursor: string | null): Promise<{ rows: BriefRow[]; nextCursor: string | null }> {
  const rows = cursor
    ? (await getPool().query('SELECT * FROM briefs WHERE status = $1 AND id < $2 ORDER BY id DESC LIMIT $3', ['live', cursor, limit + 1])).rows
    : (await getPool().query('SELECT * FROM briefs WHERE status = $1 ORDER BY id DESC LIMIT $2', ['live', limit + 1])).rows;
  const out = rows.map((row: Record<string, unknown>) => rowToBriefRow(row)!).filter(Boolean);
  let nextCursor: string | null = null;
  if (out.length > limit) {
    nextCursor = out[limit]!.id;
    out.pop();
  }
  return { rows: out, nextCursor };
}

// --- Reviews ---

export async function insertReview(row: {
  id: string;
  submission_id: string;
  from_user_id: string;
  to_user_id: string;
  rating: number;
  comment: string | null;
}): Promise<{ id: string; submission_id: string; from_user_id: string; to_user_id: string; rating: number; comment: string | null; created_at: string }> {
  const r = await getPool().query(
    'INSERT INTO reviews (id, submission_id, from_user_id, to_user_id, rating, comment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, submission_id, from_user_id, to_user_id, rating, comment, created_at',
    [row.id, row.submission_id, row.from_user_id, row.to_user_id, row.rating, row.comment]
  );
  const row0 = r.rows[0]!;
  return {
    id: row0.id as string,
    submission_id: row0.submission_id as string,
    from_user_id: row0.from_user_id as string,
    to_user_id: row0.to_user_id as string,
    rating: Number(row0.rating),
    comment: row0.comment as string | null,
    created_at: row0.created_at instanceof Date ? row0.created_at.toISOString() : String(row0.created_at),
  };
}

// --- Messages ---

export async function insertMessage(row: { id: string; submission_id: string; from_user_id: string; body: string }): Promise<{ id: string; submission_id: string; from_user_id: string; body: string; created_at: string }> {
  const r = await getPool().query(
    'INSERT INTO messages (id, submission_id, from_user_id, body) VALUES ($1, $2, $3, $4) RETURNING id, submission_id, from_user_id, body, created_at',
    [row.id, row.submission_id, row.from_user_id, row.body]
  );
  const row0 = r.rows[0]!;
  return {
    id: row0.id as string,
    submission_id: row0.submission_id as string,
    from_user_id: row0.from_user_id as string,
    body: row0.body as string,
    created_at: row0.created_at instanceof Date ? row0.created_at.toISOString() : String(row0.created_at),
  };
}

export async function findMessagesBySubmission(submissionId: string): Promise<{ id: string; submission_id: string; from_user_id: string; body: string; created_at: string }[]> {
  const r = await getPool().query('SELECT * FROM messages WHERE submission_id = $1 ORDER BY created_at ASC', [submissionId]);
  return r.rows.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    submission_id: row.submission_id as string,
    from_user_id: row.from_user_id as string,
    body: row.body as string,
    created_at: row.created_at instanceof Date ? (row.created_at as Date).toISOString() : String(row.created_at),
  }));
}

// --- Device tokens ---

export async function upsertDeviceToken(userId: string, token: string, platform: string): Promise<void> {
  const id = crypto.randomUUID();
  await getPool().query(
    `INSERT INTO device_tokens (id, user_id, token, platform) VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, platform) DO UPDATE SET token = excluded.token`,
    [id, userId, token, platform]
  );
}
