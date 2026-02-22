import { Router } from 'express';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { verifyAppleIdToken } from '../services/appleAuth.js';
import { sign } from '../auth/jwt.js';
import * as db from '../db/index.js';
import { insertUser, findUserByAppleSub, findUserByEmail, userRowToUser } from '../db/index.js';
import { validation } from '../errors.js';
const SALT_LEN = 16;
const KEY_LEN = 64;
function hashPassword(password) {
    const salt = randomBytes(SALT_LEN).toString('hex');
    const hash = scryptSync(password, salt, KEY_LEN).toString('hex');
    return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash)
        return false;
    const derived = scryptSync(password, salt, KEY_LEN);
    const hashBuf = Buffer.from(hash, 'hex');
    return hashBuf.length === derived.length && timingSafeEqual(derived, hashBuf);
}
const router = Router();
const EMAIL_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const pendingEmailCodes = new Map();
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
/** Dev/simulator: accept mock token and return test user + JWT so sign-in works without Apple. */
function isMockOrTestToken(idToken) {
    if (idToken.startsWith('mock_'))
        return true;
    if (!process.env['APPLE_CLIENT_ID'] && idToken.length > 0 && idToken.length < 500)
        return true;
    return false;
}
const MOCK_APPLE_SUB = 'mock_apple_sub_dev';
router.post('/apple', async (req, res, next) => {
    try {
        const body = req.body;
        if (!body?.idToken || !body?.role) {
            throw validation('idToken and role are required');
        }
        const role = body.role;
        if (role !== 'creator' && role !== 'talent') {
            throw validation('role must be creator or talent');
        }
        let appleSub;
        if (isMockOrTestToken(body.idToken)) {
            appleSub = MOCK_APPLE_SUB;
        }
        else {
            const apple = await verifyAppleIdToken(body.idToken);
            appleSub = apple.sub;
        }
        let userRow = await findUserByAppleSub(appleSub);
        if (!userRow) {
            const id = uuidv4();
            await insertUser({
                id,
                apple_sub: appleSub,
                role,
                display_name: '',
                onboarding_step: 'profile',
            });
            userRow = await db.findUserById(id);
        }
        if (!userRow)
            throw new Error('User not found after create');
        const user = userRowToUser(userRow);
        const token = sign({ userId: user.id, role: user.role });
        res.status(200).json({ user, token });
    }
    catch (e) {
        next(e);
    }
});
/** POST /auth/email/send – send 6-digit code to email (or return in dev). */
router.post('/email/send', async (req, res, next) => {
    try {
        const body = req.body;
        const email = normalizeEmail(body?.email ?? '');
        if (!email || !isValidEmail(email))
            throw validation('Valid email is required');
        const role = body.role;
        if (role !== 'creator' && role !== 'talent')
            throw validation('role must be creator or talent');
        const code = String(Math.floor(100_000 + Math.random() * 900_000));
        const expiresAt = Date.now() + EMAIL_CODE_TTL_MS;
        pendingEmailCodes.set(email, { code, role, expiresAt });
        const devReturnCode = process.env['EMAIL_DEV_RETURN_CODE'] === 'true';
        if (devReturnCode) {
            return res.status(200).json({ sent: true, code });
        }
        // TODO: send email via Resend/SendGrid when EMAIL_* env is set
        res.status(200).json({ sent: true });
    }
    catch (e) {
        next(e);
    }
});
/** POST /auth/email/verify – verify code and return { user, token }. */
router.post('/email/verify', async (req, res, next) => {
    try {
        const body = req.body;
        const email = normalizeEmail(body?.email ?? '');
        if (!email || !isValidEmail(email))
            throw validation('Valid email is required');
        const code = (body?.code ?? '').trim();
        if (!code)
            throw validation('Code is required');
        const role = body.role;
        if (role !== 'creator' && role !== 'talent')
            throw validation('role must be creator or talent');
        const stored = pendingEmailCodes.get(email);
        if (!stored)
            throw validation('No code sent for this email. Request a new code.');
        if (stored.expiresAt < Date.now()) {
            pendingEmailCodes.delete(email);
            throw validation('Code expired. Request a new code.');
        }
        if (stored.code !== code)
            throw validation('Invalid code.');
        pendingEmailCodes.delete(email);
        const appleSub = `email:${email}`;
        let userRow = await findUserByAppleSub(appleSub);
        if (!userRow) {
            const id = uuidv4();
            await insertUser({
                id,
                apple_sub: appleSub,
                role,
                display_name: '',
                onboarding_step: 'profile',
            });
            userRow = (await db.findUserById(id));
        }
        if (!userRow)
            throw new Error('User not found after create');
        const user = userRowToUser(userRow);
        const token = sign({ userId: user.id, role: user.role });
        res.status(200).json({ user, token });
    }
    catch (e) {
        next(e);
    }
});
/** POST /auth/email/register – create account with email + password. */
router.post('/email/register', async (req, res, next) => {
    try {
        const body = req.body;
        const email = normalizeEmail(body?.email ?? '');
        if (!email || !isValidEmail(email))
            throw validation('Valid email is required');
        const password = typeof body?.password === 'string' ? body.password : '';
        if (password.length < 8)
            throw validation('Password must be at least 8 characters');
        const role = body.role;
        if (role !== 'creator' && role !== 'talent')
            throw validation('role must be creator or talent');
        const existing = await findUserByEmail(email);
        if (existing)
            throw validation('An account with this email already exists');
        const id = uuidv4();
        const appleSub = `email:${email}`;
        const passwordHash = hashPassword(password);
        await insertUser({
            id,
            apple_sub: appleSub,
            role,
            display_name: '',
            onboarding_step: 'profile',
            email,
            password_hash: passwordHash,
        });
        const userRow = await db.findUserById(id);
        if (!userRow)
            throw new Error('User not found after create');
        const user = userRowToUser(userRow);
        const token = sign({ userId: user.id, role: user.role });
        res.status(200).json({ user, token });
    }
    catch (e) {
        next(e);
    }
});
/** POST /auth/email/login – sign in with email + password. */
router.post('/email/login', async (req, res, next) => {
    try {
        const body = req.body;
        const email = normalizeEmail(body?.email ?? '');
        if (!email || !isValidEmail(email))
            throw validation('Valid email is required');
        const password = typeof body?.password === 'string' ? body.password : '';
        if (!password)
            throw validation('Password is required');
        const role = body.role;
        if (role !== 'creator' && role !== 'talent')
            throw validation('role must be creator or talent');
        const userRow = await findUserByEmail(email);
        if (!userRow || !userRow.password_hash)
            throw validation('Invalid email or password');
        if (!verifyPassword(password, userRow.password_hash))
            throw validation('Invalid email or password');
        if (userRow.role !== role)
            throw validation('This account is registered as ' + userRow.role + '. Sign in with the correct option.');
        const user = userRowToUser(userRow);
        const token = sign({ userId: user.id, role: user.role });
        res.status(200).json({ user, token });
    }
    catch (e) {
        next(e);
    }
});
export default router;
