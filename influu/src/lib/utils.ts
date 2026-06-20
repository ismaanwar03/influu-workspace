import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PLATFORM_FEE_PERCENT, CONTENT_TIMERS } from "@/lib/constants";

// ── TAILWIND MERGE ────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── CURRENCY ──────────────────────────────────────────────────
export function formatPKR(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000)   return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount.toLocaleString("en-PK")}`;
}

export function formatPKRExact(amount: number): string {
  return `₹${amount.toLocaleString("en-PK")}`;
}

// ── PLATFORM FEE ─────────────────────────────────────────────
export function calculatePlatformFee(amount: number): number {
  return Math.round((amount * PLATFORM_FEE_PERCENT) / 100);
}

export function calculateCreatorPayout(amount: number): number {
  return amount - calculatePlatformFee(amount);
}

// ── DATE & TIME ───────────────────────────────────────────────
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours   = Math.floor(diff / 3600000);
  const days    = Math.floor(diff / 86400000);

  if (minutes < 1)  return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24)   return `${hours}h ago`;
  if (days < 7)     return `${days}d ago`;
  return formatDate(date);
}

export function getDaysUntil(date: string | Date): number {
  const now  = new Date();
  const then = new Date(date);
  return Math.ceil((then.getTime() - now.getTime()) / 86400000);
}

export function formatDeadline(date: string | Date): string {
  const days = getDaysUntil(date);
  if (days < 0)   return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7)  return `${days}d left`;
  return formatDate(date);
}

// ── CONTENT TIMER ─────────────────────────────────────────────
export function getPaymentTimer(contentType: string): { hours: number; label: string } {
  const key = contentType.toLowerCase();
  return CONTENT_TIMERS[key] ?? CONTENT_TIMERS.post;
}

export function getTimerEndDate(verifiedAt: string | Date, contentType: string): Date {
  const { hours } = getPaymentTimer(contentType);
  const date = new Date(verifiedAt);
  date.setHours(date.getHours() + hours);
  return date;
}

// ── FOLLOWERS ─────────────────────────────────────────────────
export function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000)    return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
}

// ── ENGAGEMENT ────────────────────────────────────────────────
export function formatEngagement(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

export function getEngagementLevel(rate: number): "excellent" | "good" | "average" | "poor" {
  if (rate >= 6)  return "excellent";
  if (rate >= 3)  return "good";
  if (rate >= 1)  return "average";
  return "poor";
}

// ── PLATFORM ICONS ────────────────────────────────────────────
export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    instagram: "📸",
    tiktok:    "🎵",
    youtube:   "▶",
    facebook:  "👤",
  };
  return icons[platform.toLowerCase()] ?? "📱";
}

// ── STRING ────────────────────────────────────────────────────
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

// ── AVATAR COLOR ──────────────────────────────────────────────
const AVATAR_COLORS = [
  "#7C3AFF", "#DB2777", "#10D9A0",
  "#F59E0B", "#3B82F6", "#EF4444",
];

export function getAvatarColor(name: string): string {
  const index = (name.charCodeAt(0) || 65) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

// ── URL ───────────────────────────────────────────────────────
export function extractPostId(url: string): string | null {
  // Instagram: https://www.instagram.com/p/ABC123/
  const igMatch = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  if (igMatch) return igMatch[1];

  // TikTok: https://www.tiktok.com/@user/video/1234567890
  const ttMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (ttMatch) return ttMatch[1];

  // YouTube: https://youtu.be/ABC123 or youtube.com/watch?v=ABC123
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([A-Za-z0-9_-]+)/);
  if (ytMatch) return ytMatch[1];

  return null;
}

export function detectPlatformFromUrl(url: string): string | null {
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("tiktok.com"))    return "tiktok";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("facebook.com")) return "facebook";
  return null;
}

// ── ESCROW PIPELINE STAGES ────────────────────────────────────
export const PIPELINE_STAGES = [
  "Agreed", "Drafted", "Approved", "Posted", "Paid",
] as const;

export function getPipelineStage(status: string): number {
  const stageMap: Record<string, number> = {
    pending_signature: 0,
    active:            0,
    draft_submitted:   1,
    draft_approved:    2,
    post_live:         3,
    timer_running:     3,
    payment_released:  5,
  };
  return stageMap[status] ?? 0;
}
