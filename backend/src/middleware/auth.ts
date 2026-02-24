import type { Request, Response, NextFunction } from 'express';
import { verify, verifySupabaseJWT, getAlgFromToken } from '../auth/jwt.js';
import { findUserById } from '../db/index.js';
import { unauthorized } from '../errors.js';
import type { AuthPayload, Role } from '../types.js';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
      userId?: string;
      role?: Role;
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const header = req.headers['authorization'];
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    next(unauthorized('Missing or invalid Authorization'));
    return;
  }
  try {
    let userId: string;
    let role: Role;
    try {
      const payload = verify(token);
      userId = payload.userId;
      role = payload.role as Role;
    } catch {
      const supabase = await verifySupabaseJWT(token);
      userId = supabase.sub.toLowerCase();
      const supabaseUser = await findUserById(userId);
      if (!supabaseUser) {
        console.warn('[auth] Supabase JWT valid but user not in DB:', userId);
        next(unauthorized('User not found'));
        return;
      }
      role = supabaseUser.role as Role;
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid or expired token';
    const header = req.headers['authorization'];
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    const alg = token ? getAlgFromToken(token) : null;
    // Always log rejection reason so Vercel logs show why 401 (expired, wrong secret, wrong project, etc.)
    console.warn('[auth] Token rejected:', msg, alg != null ? `(JWT alg: ${alg})` : '');
    // In debug mode, return the real reason in the 401 body so you can see it in Vercel response / app
    const bodyMessage =
      process.env['DEBUG_AUTH'] === '1' ? msg : 'Invalid or expired token';
    next(unauthorized(bodyMessage));
  }
}

export function requireRole(role: Role) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (req.role !== role) {
      next(unauthorized('Insufficient role'));
      return;
    }
    next();
  };
}
