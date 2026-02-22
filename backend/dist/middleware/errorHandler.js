import { toEnvelope } from '../errors.js';
export function errorHandler(err, _req, res, _next) {
    const { statusCode, body } = toEnvelope(err);
    res.status(statusCode).json(body);
}
