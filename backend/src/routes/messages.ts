import { Router, type Request, type Response, type NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { insertMessage, findMessagesBySubmission, findSubmissionById, findBriefById } from '../db/index.js';
import { notFound, forbidden, validation } from '../errors.js';

const router = Router();

function paramSubmissionId(req: Request): string {
  const p = req.params.submissionId;
  return Array.isArray(p) ? p[0]! : p!;
}

router.get('/thread/:submissionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submissionId = paramSubmissionId(req);
    const userId = req.userId!;
    const sub = await findSubmissionById(submissionId);
    if (!sub) throw notFound('Submission not found');
    const brief = await findBriefById(sub.brief_id);
    if (!brief) throw notFound('Brief not found');
    if (sub.talent_id !== userId && brief.creator_id !== userId) throw forbidden('Not part of this thread');
    const rows = await findMessagesBySubmission(submissionId);
    res.json(
      rows.map((r) => ({
        id: r.id,
        submissionId: r.submission_id,
        fromUserId: r.from_user_id,
        body: r.body,
        createdAt: r.created_at,
      }))
    );
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId, body } = req.body as { submissionId: string; body: string };
    if (!submissionId || !body?.trim()) throw validation('submissionId and body required');
    const userId = req.userId!;
    const sub = await findSubmissionById(submissionId);
    if (!sub) throw notFound('Submission not found');
    const brief = await findBriefById(sub.brief_id);
    if (!brief) throw notFound('Brief not found');
    if (sub.talent_id !== userId && brief.creator_id !== userId) throw forbidden('Not part of this thread');
    const id = uuidv4();
    const row = await insertMessage({ id, submission_id: submissionId, from_user_id: userId, body: body.trim() });
    res.status(201).json({
      id: row.id,
      submissionId: row.submission_id,
      fromUserId: row.from_user_id,
      body: row.body,
      createdAt: row.created_at,
    });
  } catch (e) {
    next(e);
  }
});

export default router;