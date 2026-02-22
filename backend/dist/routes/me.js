import { Router } from 'express';
import multer from 'multer';
import { findUserById, updateUser, userRowToUser, upsertDeviceToken } from '../db/index.js';
import { notFound, validation } from '../errors.js';
import { saveSampleClip } from '../services/storage.js';
const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB
router.post('/sample-clips', upload.single('clip'), async (req, res, next) => {
    try {
        const userId = req.userId;
        const file = req.file;
        if (!file)
            throw validation('clip file required');
        const url = saveSampleClip(userId, file.buffer, file.mimetype);
        res.status(200).json({ url });
    }
    catch (e) {
        next(e);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const userId = req.userId;
        const row = await findUserById(userId);
        if (!row)
            throw notFound('User not found');
        res.json(userRowToUser(row));
    }
    catch (e) {
        next(e);
    }
});
router.patch('/', async (req, res, next) => {
    try {
        const userId = req.userId;
        const body = req.body;
        if (body.sampleClipURLs !== undefined) {
            if (!Array.isArray(body.sampleClipURLs) || body.sampleClipURLs.length > 3) {
                throw validation('sampleClipURLs must be an array of up to 3 URLs');
            }
        }
        const updates = {};
        if (body.sampleClipURLs !== undefined)
            updates.sample_clip_urls = JSON.stringify(body.sampleClipURLs);
        if (body.displayName !== undefined)
            updates.display_name = body.displayName;
        if (body.bio !== undefined)
            updates.bio = body.bio;
        if (body.socialLink !== undefined)
            updates.social_link = body.socialLink;
        if (body.onboardingStep !== undefined)
            updates.onboarding_step = body.onboardingStep;
        if (Object.keys(updates).length > 0)
            await updateUser(userId, updates);
        const row = await findUserById(userId);
        if (!row)
            throw notFound('User not found');
        res.json(userRowToUser(row));
    }
    catch (e) {
        next(e);
    }
});
router.post('/device-token', async (req, res, next) => {
    try {
        const userId = req.userId;
        const body = req.body;
        if (!body?.token?.trim())
            throw validation('token required');
        const platform = body.platform ?? 'ios';
        if (platform !== 'ios' && platform !== 'android')
            throw validation('platform must be ios or android');
        await upsertDeviceToken(userId, body.token.trim(), platform);
        res.status(204).send();
    }
    catch (e) {
        next(e);
    }
});
export default router;
