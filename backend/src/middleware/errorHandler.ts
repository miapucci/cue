import type { Request, Response, NextFunction } from 'express';
import { toEnvelope } from '../errors.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const { statusCode, body } = toEnvelope(err);
  res.status(statusCode).json(body);
}
