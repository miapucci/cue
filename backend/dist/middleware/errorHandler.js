import { toEnvelope } from '../errors.js';
export function errorHandler(err, _req, res, _next) {
    const { statusCode, body } = toEnvelope(err);
    // So clients and proxies always see the real 401 reason (e.g. Supabase JWT: ...)
    if (statusCode === 401 && body.error?.message) {
        res.setHeader('X-Auth-Error', body.error.message);
    }
    res.status(statusCode).json(body);
}
