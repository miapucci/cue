import { verify } from '../auth/jwt.js';
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
        const payload = verify(token);
        const user = await findUserById(payload.userId);
        if (!user) {
            next(unauthorized('User not found'));
            return;
        }
        req.auth = { userId: payload.userId, role: payload.role };
        req.userId = payload.userId;
        req.role = payload.role;
        next();
    }
    catch {
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
