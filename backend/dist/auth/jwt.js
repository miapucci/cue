/**
 * JWT issue/verify for session (Apple auth) and Supabase Auth tokens.
 * Supabase: HS256 (legacy secret) or RS256/ES256 via jose + JWKS.
 */
import { createHmac, timingSafeEqual } from 'crypto';
import * as jose from 'jose';
const ALG = 'HS256';
const TTL_SEC = 60 * 60 * 24 * 30; // 30 days
function b64UrlEncode(buf) {
    return buf.toString('base64url');
}
function b64UrlDecode(str) {
    return Buffer.from(str, 'base64url');
}
function getSecret() {
    const s = process.env['JWT_SECRET'];
    if (!s || s.length < 32)
        throw new Error('JWT_SECRET must be set and at least 32 chars');
    return s;
}
export function sign(payload) {
    const secret = getSecret();
    const now = Math.floor(Date.now() / 1000);
    const full = { ...payload, iat: now, exp: now + TTL_SEC };
    const header = b64UrlEncode(Buffer.from(JSON.stringify({ alg: ALG, typ: 'JWT' })));
    const body = b64UrlEncode(Buffer.from(JSON.stringify(full)));
    const sig = createHmac('sha256', secret).update(`${header}.${body}`).digest();
    return `${header}.${body}.${b64UrlEncode(sig)}`;
}
export function verify(token) {
    const parts = token.split('.');
    if (parts.length !== 3)
        throw new Error('Invalid token');
    const [headerB64, bodyB64, sigB64] = parts;
    const secret = getSecret();
    const expectedSig = createHmac('sha256', secret).update(`${headerB64}.${bodyB64}`).digest();
    const actualSig = b64UrlDecode(sigB64);
    if (expectedSig.length !== actualSig.length || !timingSafeEqual(expectedSig, actualSig)) {
        throw new Error('Invalid token');
    }
    const payload = JSON.parse(b64UrlDecode(bodyB64).toString('utf-8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now)
        throw new Error('Token expired');
    if (!payload.userId || !payload.role)
        throw new Error('Invalid payload');
    return payload;
}
/** Decode JWT header (no verification). */
function decodeHeader(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        return JSON.parse(b64UrlDecode(parts[0]).toString('utf-8'));
    }
    catch {
        return null;
    }
}
/** Decode JWT header to get alg (no verification). Use when logging auth failures. */
export function getAlgFromToken(token) {
    return decodeHeader(token)?.alg ?? null;
}
/**
 * Verify a Supabase Auth JWT (e.g. from iOS when using Supabase for email sign-up).
 * Supports: HS256 (Legacy JWT Secret) and RS256/ES256 (JWT Signing Keys via SUPABASE_URL JWKS, using jose).
 * Set SUPABASE_JWT_SECRET for HS256, or SUPABASE_URL for RS256/ES256 (e.g. https://xxx.supabase.co).
 */
export async function verifySupabaseJWT(token) {
    const parts = token.split('.');
    if (parts.length !== 3)
        throw new Error('Invalid token');
    const header = decodeHeader(token);
    const alg = header?.alg ?? 'HS256';
    const [headerB64, bodyB64, sigB64] = parts;
    const payload = JSON.parse(b64UrlDecode(bodyB64).toString('utf-8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp != null && payload.exp < now)
        throw new Error('Token expired');
    if (!payload.sub)
        throw new Error('Invalid payload');
    if (alg === 'HS256') {
        const secret = process.env['SUPABASE_JWT_SECRET'];
        if (!secret)
            throw new Error('SUPABASE_JWT_SECRET not set');
        const expectedSig = createHmac('sha256', secret).update(`${headerB64}.${bodyB64}`).digest();
        const sigBuffer = b64UrlDecode(sigB64);
        if (expectedSig.length !== sigBuffer.length || !timingSafeEqual(expectedSig, sigBuffer)) {
            throw new Error('Invalid token');
        }
        return { sub: payload.sub };
    }
    if (alg === 'RS256' || alg === 'ES256') {
        const url = process.env['SUPABASE_URL'];
        if (!url?.startsWith('https://'))
            throw new Error('SUPABASE_URL required for RS256/ES256 (set to https://your-project.supabase.co)');
        const base = url.replace(/\/$/, '');
        const jwksUrl = `${base}/auth/v1/.well-known/jwks.json`;
        const JWKS = jose.createRemoteJWKSet(new URL(jwksUrl));
        const { payload: verified } = await jose.jwtVerify(token, JWKS, {
            issuer: `${base}/auth/v1`,
            audience: 'authenticated',
        });
        const sub = verified.sub;
        if (!sub || typeof sub !== 'string')
            throw new Error('Invalid payload');
        return { sub };
    }
    throw new Error(`Unsupported JWT alg: ${alg}`);
}
