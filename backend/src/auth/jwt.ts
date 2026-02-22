/**
 * Simple JWT issue/verify for session after Apple auth. No external dependency beyond Node crypto.
 * Payload: { userId, role, iat, exp }. Use Authorization: Bearer <token>.
 */

import { createHmac, timingSafeEqual } from 'crypto';

const ALG = 'HS256';
const TTL_SEC = 60 * 60 * 24 * 30; // 30 days

function b64UrlEncode(buf: Buffer): string {
  return buf.toString('base64url');
}

function b64UrlDecode(str: string): Buffer {
  return Buffer.from(str, 'base64url');
}

function getSecret(): string {
  const s = process.env['JWT_SECRET'];
  if (!s || s.length < 32) throw new Error('JWT_SECRET must be set and at least 32 chars');
  return s;
}

export interface JWTPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export function sign(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const secret = getSecret();
  const now = Math.floor(Date.now() / 1000);
  const full: JWTPayload = { ...payload, iat: now, exp: now + TTL_SEC };
  const header = b64UrlEncode(Buffer.from(JSON.stringify({ alg: ALG, typ: 'JWT' })));
  const body = b64UrlEncode(Buffer.from(JSON.stringify(full)));
  const sig = createHmac('sha256', secret).update(`${header}.${body}`).digest();
  return `${header}.${body}.${b64UrlEncode(sig)}`;
}

export function verify(token: string): JWTPayload {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  const [headerB64, bodyB64, sigB64] = parts;
  const secret = getSecret();
  const expectedSig = createHmac('sha256', secret).update(`${headerB64}.${bodyB64}`).digest();
  const actualSig = b64UrlDecode(sigB64);
  if (expectedSig.length !== actualSig.length || !timingSafeEqual(expectedSig, actualSig)) {
    throw new Error('Invalid token');
  }
  const payload = JSON.parse(b64UrlDecode(bodyB64).toString('utf-8')) as JWTPayload;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) throw new Error('Token expired');
  if (!payload.userId || !payload.role) throw new Error('Invalid payload');
  return payload;
}

/**
 * Verify a Supabase Auth JWT (e.g. from iOS when using Supabase for email sign-up).
 * Payload has sub (user id). Set SUPABASE_JWT_SECRET in env (Supabase Dashboard → Settings → API → JWT Secret).
 */
export function verifySupabaseJWT(token: string): { sub: string } {
  const secret = process.env['SUPABASE_JWT_SECRET'];
  if (!secret) throw new Error('SUPABASE_JWT_SECRET not set');
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  const [headerB64, bodyB64, sigB64] = parts;
  const expectedSig = createHmac('sha256', secret).update(`${headerB64}.${bodyB64}`).digest();
  const actualSig = b64UrlDecode(sigB64);
  if (expectedSig.length !== actualSig.length || !timingSafeEqual(expectedSig, actualSig)) {
    throw new Error('Invalid token');
  }
  const payload = JSON.parse(b64UrlDecode(bodyB64).toString('utf-8')) as { sub?: string; exp?: number };
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp != null && payload.exp < now) throw new Error('Token expired');
  if (!payload.sub) throw new Error('Invalid payload');
  return { sub: payload.sub };
}
