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
    const header = req.headers['authorization'];
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    const alg = token ? getAlgFromToken(token) : null;
    const msg = messageFromError(err);
    // Log full err so Vercel logs show exactly what was thrown (type, message, stack)
    console.warn(
      '[auth] Token rejected:',
      msg,
      alg != null ? `(JWT alg: ${alg})` : '',
      '| err type:',
      err === null ? 'null' : err === undefined ? 'undefined' : (err as Error)?.constructor?.name ?? typeof err
    );
    next(unauthorized(msg));
  }
}

function messageFromError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return String(err ?? 'Auth failed (no details - check server logs)');
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
