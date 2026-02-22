/**
 * Error envelope and HTTP status mapping per BACKEND_API_SPEC.
 * { "error": { "code": "unauthorized" | "not_found" | "validation" | "forbidden" | "server", "message": "..." } }
 */

export type ErrorCode =
  | 'unauthorized'
  | 'not_found'
  | 'validation'
  | 'forbidden'
  | 'server'
  | 'conflict';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function unauthorized(message = 'Unauthorized') {
  return new AppError('unauthorized', message, 401);
}

export function notFound(message = 'Resource not found') {
  return new AppError('not_found', message, 404);
}

export function validation(message: string) {
  return new AppError('validation', message, 422);
}

export function forbidden(message = 'Forbidden') {
  return new AppError('forbidden', message, 403);
}

export function conflict(message: string) {
  return new AppError('conflict', message, 409);
}

export interface ErrorEnvelope {
  error: {
    code: ErrorCode;
    message: string;
  };
}

export function toEnvelope(err: unknown): { statusCode: number; body: ErrorEnvelope } {
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      body: { error: { code: err.code, message: err.message } },
    };
  }
  return {
    statusCode: 500,
    body: { error: { code: 'server', message: 'Internal server error' } },
  };
}
