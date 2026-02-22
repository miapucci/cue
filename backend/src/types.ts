/**
 * Types aligned with Cue iOS models (User, Brief, Submission, Review, etc.)
 * so request/response JSON matches Swift Codable.
 */

export type Role = 'creator' | 'talent';

export interface User {
  id: string;
  displayName: string;
  bio: string;
  socialLink: string | null;
  role: Role;
  onboardingComplete: boolean;
  onboardingStep: string | null;
  sampleClipURLs?: string[] | null;
}

export type BriefStatus = 'draft' | 'live' | 'closed' | 'completed';
export type Orientation = 'vertical' | 'horizontal';

export interface VideoFormat {
  orientation: Orientation;
  durationSeconds: number;
}

export interface Brief {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  payRateCents: number;
  currency: string;
  deadline: string; // ISO 8601
  format: VideoFormat;
  referenceVideoURL: string | null;
  status: BriefStatus;
  submissionCount: number | null;
  isFirstFree: boolean | null;
}

export type SubmissionStatus =
  | 'pendingReview'
  | 'revisionRequested'
  | 'approved'
  | 'rejected';

export interface Submission {
  id: string;
  briefId: string;
  talentId: string;
  videoURL: string;
  status: SubmissionStatus;
  revisionNotes: string | null;
  createdAt: string; // ISO 8601
}

export interface Review {
  id: string;
  submissionId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface Message {
  id: string;
  submissionId: string;
  fromUserId: string;
  body: string;
  createdAt: string;
}

// --- Request bodies ---

export interface AuthAppleRequest {
  idToken: string;
  role: string;
}

export interface AuthEmailSendRequest {
  email: string;
  role: string;
}

export interface AuthEmailVerifyRequest {
  email: string;
  code: string;
  role: string;
}

export interface AuthEmailRegisterRequest {
  email: string;
  password: string;
  role: string;
}

export interface AuthEmailLoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface CreateBriefRequest {
  title: string;
  description: string;
  payRateCents: number;
  currency?: string;
  deadline: string;
  format: VideoFormat;
  referenceVideoURL?: string | null;
}

export interface UpdateMeRequest {
  displayName?: string;
  bio?: string;
  socialLink?: string | null;
  onboardingStep?: string | null;
  sampleClipURLs?: string[];
}

export interface PATCHSubmissionRequest {
  status: SubmissionStatus;
  revisionNotes?: string | null;
}

export interface PostReviewRequest {
  submissionId: string;
  rating: number;
  comment?: string | null;
}

export interface SendMessageRequest {
  submissionId: string;
  body: string;
}

export interface DeviceTokenRequest {
  token: string;
  platform: 'ios' | 'android';
}

// --- Response shapes ---

export interface EarningsResponse {
  pendingCents: number;
  releasedCents: number;
  currency: string;
}

export interface BriefFeedResponse {
  briefs: Brief[];
  nextCursor: string | null;
}

export interface PresignedUploadResponse {
  uploadURL: string;
  videoURL: string;
  expiresAt: string;
}

// --- Auth ---

export interface AuthPayload {
  userId: string;
  role: Role;
  iat?: number;
  exp?: number;
}
