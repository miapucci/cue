import { Router } from 'express';
import { getPool } from '../db/index.js';
const router = Router();
router.get('/', async (req, res, next) => {
    try {
        const talentId = req.userId;
        const pool = getPool();
        const pendingR = await pool.query(`SELECT COALESCE(SUM(b.pay_rate_cents), 0)::int AS c FROM submissions s
       JOIN briefs b ON b.id = s.brief_id
       WHERE s.talent_id = $1 AND s.status IN ('pendingReview', 'revisionRequested')`, [talentId]);
        const releasedR = await pool.query(`SELECT COALESCE(SUM(b.pay_rate_cents), 0)::int AS c FROM submissions s
       JOIN briefs b ON b.id = s.brief_id
       WHERE s.talent_id = $1 AND s.status = 'approved'`, [talentId]);
        const pendingCents = Number(pendingR.rows[0]?.c ?? 0);
        const releasedCents = Number(releasedR.rows[0]?.c ?? 0);
        res.json({
            pendingCents,
            releasedCents,
            currency: 'USD',
        });
    }
    catch (e) {
        next(e);
    }
});
export default router;
