import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { insertBrief, findBriefById, findBriefsByCreator, findLiveBriefs, countSubmissionsForBrief, briefRowToBrief, countCreatorLiveBriefs, findSubmissionsByBrief, findSubmissionByBriefAndTalent, insertSubmission, findSubmissionById, submissionRowToSubmission, updateBriefPaymentStatus, updateBriefPaymentIntent, } from '../db/index.js';
import { notFound, forbidden, validation } from '../errors.js';
import { createPaymentIntent, getPaymentIntentStatus } from '../services/stripe.js';
const router = Router();
router.post('/', async (req, res, next) => {
    try {
        const creatorId = req.userId;
        const body = req.body;
        if (!body.title || !body.description || body.payRateCents == null || !body.deadline || !body.format) {
            throw validation('title, description, payRateCents, deadline, format required');
        }
        const isFirstFree = (await countCreatorLiveBriefs(creatorId)) === 0 ? 1 : 0;
        const id = uuidv4();
        await insertBrief({
            id,
            creator_id: creatorId,
            title: body.title,
            description: body.description,
            pay_rate_cents: body.payRateCents,
            currency: body.currency ?? 'USD',
            deadline: body.deadline,
            orientation: body.format.orientation,
            duration_seconds: body.format.durationSeconds,
            reference_video_url: body.referenceVideoURL ?? null,
            status: 'live',
            is_first_free: isFirstFree,
            payment_status: isFirstFree ? 'captured' : 'pending',
        });
        const row = (await findBriefById(id));
        const count = await countSubmissionsForBrief(id);
        res.status(201).json(briefRowToBrief(row, count));
    }
    catch (e) {
        next(e);
    }
});
router.get('/mine', async (req, res, next) => {
    try {
        const creatorId = req.userId;
        const rows = await findBriefsByCreator(creatorId);
        const briefs = await Promise.all(rows.map(async (r) => briefRowToBrief(r, await countSubmissionsForBrief(r.id))));
        res.json(briefs);
    }
    catch (e) {
        next(e);
    }
});
router.get('/feed', async (req, res, next) => {
    try {
        const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
        const cursor = (typeof req.query.cursor === 'string' ? req.query.cursor : null) || null;
        const { rows, nextCursor } = await findLiveBriefs(limit, cursor);
        const briefs = await Promise.all(rows.map(async (r) => briefRowToBrief(r, await countSubmissionsForBrief(r.id))));
        res.json({ briefs, nextCursor });
    }
    catch (e) {
        next(e);
    }
});
function paramId(req) {
    const p = req.params.id;
    return Array.isArray(p) ? p[0] : p;
}
router.get('/:id/submissions', async (req, res, next) => {
    try {
        const briefId = paramId(req);
        const userId = req.userId;
        const brief = await findBriefById(briefId);
        if (!brief)
            throw notFound('Brief not found');
        if (brief.creator_id !== userId)
            throw forbidden('Not the brief creator');
        const rows = await findSubmissionsByBrief(briefId);
        res.json(rows.map((r) => submissionRowToSubmission(r)));
    }
    catch (e) {
        next(e);
    }
});
router.post('/:id/claim', async (req, res, next) => {
    try {
        const briefId = paramId(req);
        const talentId = req.userId;
        const brief = await findBriefById(briefId);
        if (!brief)
            throw notFound('Brief not found');
        if (brief.status !== 'live')
            throw validation('Brief is not open for claims');
        const existing = await findSubmissionByBriefAndTalent(briefId, talentId);
        if (existing)
            throw validation('You already claimed this brief');
        const id = uuidv4();
        await insertSubmission({ id, brief_id: briefId, talent_id: talentId });
        const row = (await findSubmissionById(id));
        res.status(201).json(submissionRowToSubmission(row));
    }
    catch (e) {
        next(e);
    }
});
router.get('/:id/can-view-submissions', async (req, res, next) => {
    try {
        const briefId = paramId(req);
        const userId = req.userId;
        const row = await findBriefById(briefId);
        if (!row)
            throw notFound('Brief not found');
        if (row.creator_id !== userId)
            throw forbidden('Not the brief creator');
        if (row.is_first_free === 1) {
            return res.json({ canViewSubmissions: true });
        }
        if (row.payment_status === 'captured' || row.payment_status === 'released') {
            return res.json({ canViewSubmissions: true });
        }
        if (row.payment_intent_id) {
            const status = await getPaymentIntentStatus(row.payment_intent_id);
            if (status === 'captured') {
                await updateBriefPaymentStatus(briefId, 'captured');
                return res.json({ canViewSubmissions: true });
            }
            if (status === 'pending') {
                const { getStripe } = await import('../services/stripe.js');
                const stripe = getStripe();
                const pi = await stripe.paymentIntents.retrieve(row.payment_intent_id);
                if (pi.client_secret)
                    return res.json({ canViewSubmissions: false, clientSecret: pi.client_secret });
            }
        }
        const { clientSecret, paymentIntentId } = await createPaymentIntent({
            briefId,
            amountCents: row.pay_rate_cents,
            currency: row.currency,
        });
        await updateBriefPaymentIntent(briefId, paymentIntentId, 'pending');
        res.json({ canViewSubmissions: false, clientSecret });
    }
    catch (e) {
        next(e);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const row = await findBriefById(paramId(req));
        if (!row)
            throw notFound('Brief not found');
        const count = await countSubmissionsForBrief(row.id);
        res.json(briefRowToBrief(row, count));
    }
    catch (e) {
        next(e);
    }
});
export default router;
