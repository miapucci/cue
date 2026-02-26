import { verify, verifySupabaseJWT, getAlgFromToken } from '../auth/jwt.js';
import { findUserById } from '../db/index.js';
import { unauthorized } from '../errors.js';
export async function requireAuth(req, _res, next) {
    const header = req.headers['authorization'];
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
        next(unauthorized('Missing or invalid Authorization'));
        return;
    }
    try {
        let userId;
        let role;
        try {
            const payload = verify(token);
            userId = payload.userId;
            role = payload.role;
        }
        catch {
            const supabase = await verifySupabaseJWT(token);
            userId = supabase.sub.toLowerCase();
            const supabaseUser = await findUserById(userId);
            if (!supabaseUser) {
                console.warn('[auth] Supabase JWT valid but user not in DB:', userId);
                next(unauthorized('User not found'));
                return;
            }
            role = supabaseUser.role;
            req.auth = { userId, role };
            req.userId = userId;
            req.role = role;
            next();
            return;
        }
        const user = await findUserById(userId);
        if (!user) {
            next(unauthorized('User not found'));
            return;
        }
        req.auth = { userId, role };
        req.userId = userId;
        req.role = role;
        next();
    }
    catch (err) {
        const header = req.headers['authorization'];
        const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
        const alg = token ? getAlgFromToken(token) : null;
        const msg = messageFromError(err);
        // Log full err so Vercel logs show exactly what was thrown (type, message, stack)
        console.warn('[auth] Token rejected:', msg, alg != null ? `(JWT alg: ${alg})` : '', '| err type:', err === null ? 'null' : err === undefined ? 'undefined' : err?.constructor?.name ?? typeof err);
        next(unauthorized(msg));
    }
}
function messageFromError(err) {
    if (err instanceof Error)
        return err.message;
    if (typeof err === 'string')
        return err;
    if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
        return err.message;
    }
    return String(err ?? 'Auth failed (no details - check server logs)');
}
export function requireRole(role) {
    return (req, _res, next) => {
        if (req.role !== role) {
            next(unauthorized('Insufficient role'));
            return;
        }
        next();
    };
}
