// ── APP ──────────────────────────────────────────────────────
export const APP_NAME = "Influu";
export const APP_DOMAIN = "influu.pk";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ── PLATFORM COMMISSION ───────────────────────────────────────
export const PLATFORM_FEE_PERCENT = 8;

// ── PAYMENT TIMERS ────────────────────────────────────────────
export const STORY_RELEASE_HOURS = 24;
export const POST_RELEASE_DAYS = 7;
export const DRAFT_AUTO_APPROVE_HOURS = 48;

// ── CONTENT TYPES ─────────────────────────────────────────────
export const CONTENT_TYPES = {
  instagram: ["Post", "Reel", "Story"],
  tiktok:    ["Video"],
  youtube:   ["Video", "Short"],
  facebook:  ["Post", "Story"],
} as const;

export const CONTENT_TIMERS: Record<string, { hours: number; label: string }> = {
  story:  { hours: 24,  label: "24-hour release" },
  post:   { hours: 168, label: "7-day release" },
  reel:   { hours: 168, label: "7-day release" },
  video:  { hours: 168, label: "7-day release" },
  short:  { hours: 168, label: "7-day release" },
};

// ── PLATFORMS ─────────────────────────────────────────────────
export const PLATFORMS = [
  { id: "tiktok",    label: "TikTok",    icon: "🎵" },
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "youtube",   label: "YouTube",   icon: "▶" },
  { id: "facebook",  label: "Facebook",  icon: "👤" },
] as const;

// ── INDUSTRIES ────────────────────────────────────────────────
export const INDUSTRIES = [
  "Fashion & Clothing",
  "Food & Beverages",
  "Beauty & Cosmetics",
  "Technology",
  "Health & Fitness",
  "Education",
  "Real Estate",
  "Travel & Tourism",
  "Other",
] as const;

// ── NICHES ────────────────────────────────────────────────────
export const NICHES = [
  "Fashion", "Food & Cooking", "Beauty", "Fitness",
  "Tech", "Travel", "Lifestyle", "Comedy", "Education", "Gaming",
] as const;

// ── CITIES (PAKISTAN) ─────────────────────────────────────────
export const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi",
  "Faisalabad", "Multan", "Peshawar", "Quetta", "Other",
] as const;

// ── BUDGET RANGES ─────────────────────────────────────────────
export const BUDGET_RANGES = [
  { label: "₹5K–20K",   min: 5000,   max: 20000  },
  { label: "₹20K–50K",  min: 20000,  max: 50000  },
  { label: "₹50K–100K", min: 50000,  max: 100000 },
  { label: "₹100K+",    min: 100000, max: null   },
] as const;

// ── CREATOR SIZES ─────────────────────────────────────────────
export const CREATOR_SIZES = [
  { label: "Nano",  range: "1K–10K",   min: 1000,   max: 10000  },
  { label: "Micro", range: "10K–100K", min: 10000,  max: 100000 },
  { label: "Macro", range: "100K–1M",  min: 100000, max: 1000000},
  { label: "Mega",  range: "1M+",      min: 1000000,max: null   },
] as const;

// ── PAYMENT METHODS ───────────────────────────────────────────
export const PAYMENT_METHODS = [
  { id: "jazzcash",      label: "JazzCash",        icon: "💚" },
  { id: "easypaisa",     label: "EasyPaisa",       icon: "🟢" },
  { id: "card",          label: "Debit/Credit Card",icon: "💳" },
  { id: "bank_transfer", label: "Bank Transfer",   icon: "🏦" },
] as const;

// ── CONTRACT STATUS LABELS ────────────────────────────────────
export const CONTRACT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending_signature: { label: "Awaiting signature", color: "#F59E0B" },
  active:            { label: "Active",              color: "#10D9A0" },
  draft_submitted:   { label: "Draft submitted",     color: "#F59E0B" },
  draft_approved:    { label: "Draft approved",      color: "#10D9A0" },
  post_live:         { label: "Post live",           color: "#10D9A0" },
  timer_running:     { label: "Timer running",       color: "#10D9A0" },
  payment_released:  { label: "Paid out",            color: "#9F5FFF" },
  disputed:          { label: "Disputed",            color: "#F45B69" },
  cancelled:         { label: "Cancelled",           color: "#4A4A66" },
};

// ── ROUTES ────────────────────────────────────────────────────
export const ROUTES = {
  home:                "/",
  login:               "/login",
  signup:              "/signup",
  onboarding: {
    brand:   "/onboarding/brand",
    creator: "/onboarding/creator",
  },
  brand: {
    dashboard:    "/brand/dashboard",
    campaigns:    "/brand/campaigns",
    newCampaign:  "/brand/campaigns/new",
    findCreators: "/brand/find-creators",
    contracts:    "/brand/contracts",
    contract:     (id: string) => `/brand/contracts/${id}`,
    payments:     "/brand/payments",
    analytics:    "/brand/analytics",
  },
  creator: {
    dashboard: "/creator/dashboard",
    browse:    "/creator/browse",
    packages:  "/creator/packages",
    contracts: "/creator/contracts",
    earnings:  "/creator/earnings",
  },
};
