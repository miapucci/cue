import { Router, type Request, type Response, type NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { insertReview, findSubmissionById, findBriefById } from '../db/index.js';
import { notFound, validation } from '../errors.js';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fromUserId = req.userId!;
    const { submissionId, rating, comment } = req.body as { submissionId: string; rating: number; comment?: string | null };
    if (!submissionId || rating == null) throw validation('submissionId and rating required');
    if (rating < 1 || rating > 5) throw validation('rating must be 1–5');
    const sub = await findSubmissionById(submissionId);
    if (!sub) throw notFound('Submission not found');
    if (sub.status !== 'approved') throw validation('Can only review approved submissions');
    const brief = await findBriefById(sub.brief_id);
    if (!brief) throw notFound('Brief not found');
    const toUserId = sub.talent_id === fromUserId ? brief.creator_id : sub.talent_id;
    const id = uuidv4();
    const row = await insertReview({
      id,
      submission_id: submissionId,
      from_user_id: fromUserId,
      to_user_id: toUserId,
      rating,
      comment: comment ?? null,
    });
    res.status(201).json({
      id: row.id,
      submissionId: row.submission_id,
      fromUserId: row.from_user_id,
      toUserId: row.to_user_id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
    });
  } catch (e) {
    next(e);
  }
});

export default router;