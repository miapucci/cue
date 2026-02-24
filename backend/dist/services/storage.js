/**
 * Video storage: local disk for MVP (uploads/ dir). For production, swap to S3 and use presigned URLs.
 * API: POST /submissions/:id/upload (multipart) stores file and returns submission with videoURL.
 */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
const UPLOAD_DIR = process.env['UPLOAD_DIR'] ?? (process.env['VERCEL'] === '1' ? '/tmp/uploads' : join(process.cwd(), 'data', 'uploads'));
const UPLOAD_BASE_URL = process.env['UPLOAD_BASE_URL'] ?? 'http://localhost:3000/uploads';
export function ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR))
        mkdirSync(UPLOAD_DIR, { recursive: true });
}
export function saveSubmissionVideo(submissionId, buffer, mimeType) {
    ensureUploadDir();
    const ext = mimeType.includes('mp4') ? 'mp4' : 'mov';
    const filename = `${submissionId}-${randomUUID()}.${ext}`;
    const path = join(UPLOAD_DIR, filename);
    writeFileSync(path, buffer);
    return `${UPLOAD_BASE_URL}/${filename}`;
}
/** Save one sample clip for talent onboarding. Returns public URL. */
export function saveSampleClip(userId, buffer, mimeType) {
    ensureUploadDir();
    const ext = mimeType.includes('mp4') ? 'mp4' : 'mov';
    const filename = `sample-${userId}-${randomUUID()}.${ext}`;
    const path = join(UPLOAD_DIR, filename);
    writeFileSync(path, buffer);
    return `${UPLOAD_BASE_URL}/${filename}`;
}
