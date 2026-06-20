// ── USER & AUTH ─────────────────────────────────────────────
export type UserRole = "brand" | "creator" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ── BRAND PROFILE ───────────────────────────────────────────
export interface BrandProfile {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  website?: string;
  rating: number;
  totalCampaigns: number;
  user: User;
}

// ── CREATOR PROFILE ─────────────────────────────────────────
export interface CreatorProfile {
  id: string;
  userId: string;
  bio: string;
  niche: string;
  city: string;
  rating: number;
  totalDeals: number;
  availability: "available" | "busy" | "unavailable";
  socialAccounts: SocialAccount[];
  packages: Package[];
  user: User;
}

// ── SOCIAL ACCOUNT ──────────────────────────────────────────
export type SocialPlatform = "instagram" | "tiktok" | "youtube" | "facebook";

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  followers: number;
  engagementRate: number;
  isVerified: boolean;
}

// ── PACKAGE ─────────────────────────────────────────────────
export type ContentType = "post" | "reel" | "story" | "video" | "short";

export interface Package {
  id: string;
  title: string;
  platform: SocialPlatform;
  contentType: ContentType;
  price: number;
  deliveryDays: number;
  description?: string;
  isActive: boolean;
}

// ── CAMPAIGN ─────────────────────────────────────────────────
export type CampaignStatus = "draft" | "active" | "completed" | "cancelled";

export interface Campaign {
  id: string;
  brandId: string;
  brand: BrandProfile;
  title: string;
  platform: SocialPlatform;
  contentType: ContentType;
  brief: string;
  budget: number;
  deadline: string;
  minFollowers: number;
  maxRevisions: number;
  status: CampaignStatus;
  applicationsCount: number;
  createdAt: string;
}

// ── CONTRACT ─────────────────────────────────────────────────
export type ContractStatus =
  | "pending_signature"
  | "active"
  | "draft_submitted"
  | "draft_approved"
  | "post_live"
  | "timer_running"
  | "payment_released"
  | "disputed"
  | "cancelled";

export interface Contract {
  id: string;
  brandId: string;
  creatorId: string;
  campaignId?: string;
  brand: BrandProfile;
  creator: CreatorProfile;
  platform: SocialPlatform;
  contentType: ContentType;
  amount: number;
  deadline: string;
  maxRevisions: number;
  revisionsUsed: number;
  status: ContractStatus;
  pdfUrl?: string;
  signedAt?: string;
  createdAt: string;
  escrowTransaction?: EscrowTransaction;
  contentSubmission?: ContentSubmission;
}

// ── ESCROW ────────────────────────────────────────────────────
export type EscrowStatus = "locked" | "release_pending" | "released" | "refunded";

export interface EscrowTransaction {
  id: string;
  contractId: string;
  totalAmount: number;
  platformFee: number;
  creatorPayout: number;
  status: EscrowStatus;
  paymentMethod: string;
  paymobRef?: string;
  lockedAt: string;
  releasedAt?: string;
}

// ── CONTENT SUBMISSION ────────────────────────────────────────
export type SubmissionStatus =
  | "pending_review"
  | "revision_requested"
  | "approved"
  | "live"
  | "verified"
  | "deleted";

export interface ContentSubmission {
  id: string;
  contractId: string;
  version: number;
  fileUrls: string[];
  caption: string;
  hashtags: string;
  status: SubmissionStatus;
  revisionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  postUrl?: string;
  timerEndsAt?: string;
}

// ── DISPUTE ───────────────────────────────────────────────────
export type DisputeStatus = "open" | "under_review" | "resolved_creator" | "resolved_brand";

export interface Dispute {
  id: string;
  contractId: string;
  raisedByUserId: string;
  reason: string;
  status: DisputeStatus;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ── NOTIFICATION ──────────────────────────────────────────────
export type NotificationType =
  | "new_application"
  | "offer_received"
  | "contract_signed"
  | "draft_submitted"
  | "draft_approved"
  | "draft_revision"
  | "post_verified"
  | "payment_released"
  | "dispute_opened"
  | "dispute_resolved";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ── API RESPONSE ──────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── PAYMENT ───────────────────────────────────────────────────
export type PaymentMethod = "card" | "jazzcash" | "easypaisa" | "bank_transfer";

export interface PaymentIntent {
  orderId: string;
  amount: number;
  currency: "PKR";
  paymentMethod: PaymentMethod;
  redirectUrl: string;
}
