import { Router } from 'express';
import multer from 'multer';
import { findSubmissionById, updateSubmissionVideo, updateSubmissionStatus, submissionRowToSubmission, findBriefById, findUserById, } from '../db/index.js';
import { saveSubmissionVideo } from '../services/storage.js';
import { releasePaymentToTalent } from '../services/stripe.js';
import { notFound, forbidden, validation } from '../errors.js';
const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB
function paramId(req) {
    const p = req.params.id;
    return Array.isArray(p) ? p[0] : p;
}
router.post('/:id/upload', upload.single('video'), async (req, res, next) => {
    try {
        const submissionId = paramId(req);
        const userId = req.userId;
        const sub = await findSubmissionById(submissionId);
        if (!sub)
            throw notFound('Submission not found');
        if (sub.talent_id !== userId)
            throw forbidden('Not your submission');
        const file = req.file;
        if (!file)
            throw validation('video file required');
        const videoURL = saveSubmissionVideo(submissionId, file.buffer, file.mimetype);
        await updateSubmissionVideo(submissionId, videoURL, null);
        const updated = (await findSubmissionById(submissionId));
        res.json(submissionRowToSubmission(updated));
    }
    catch (e) {
        next(e);
    }
});
router.patch('/:id', async (req, res, next) => {
    try {
        const submissionId = paramId(req);
        const userId = req.userId;
        const body = req.body;
        if (!body.status)
            throw validation('status required');
        const sub = await findSubmissionById(submissionId);
        if (!sub)
            throw notFound('Submission not found');
        const brief = (await findBriefById(sub.brief_id));
        if (brief.creator_id !== userId)
            throw forbidden('Not the brief creator');
        await updateSubmissionStatus(submissionId, body.status, body.revisionNotes ?? null);
        if (body.status === 'approved') {
            const talent = await findUserById(sub.talent_id);
            releasePaymentToTalent({
                briefId: sub.brief_id,
                submissionId,
                talentStripeConnectAccountId: talent?.stripe_connect_account_id ?? null,
                amountCents: brief.pay_rate_cents,
                currency: brief.currency,
                transferGroup: sub.brief_id,
            }).catch(() => { });
        }
        const updated = (await findSubmissionById(submissionId));
        res.json(submissionRowToSubmission(updated));
    }
    catch (e) {
        next(e);
    }
});
export default router;
