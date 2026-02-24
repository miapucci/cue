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
        const msg = err instanceof Error ? err.message : 'Invalid or expired token';
        const header = req.headers['authorization'];
        const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
        const alg = token ? getAlgFromToken(token) : null;
        if (process.env.NODE_ENV !== 'production' || alg === 'RS256') {
            console.warn('[auth] Token rejected:', msg, alg != null ? `(JWT alg: ${alg})` : '');
        }
        next(unauthorized('Invalid or expired token'));
    }
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
