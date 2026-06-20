import { z } from "zod";

// ── AUTH ──────────────────────────────────────────────────────
export const loginSchema = z.object({
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role:     z.enum(["brand", "creator"]),
  terms:    z.boolean().refine((v) => v === true, "You must accept the terms"),
});
export type SignupInput = z.infer<typeof signupSchema>;

// ── ONBOARDING ────────────────────────────────────────────────
export const brandOnboardingSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  industry:    z.string().min(1, "Select an industry"),
  website:     z.string().url("Enter a valid URL").optional().or(z.literal("")),
  platforms:   z.array(z.string()).min(1, "Select at least one platform"),
  budget:      z.string().min(1, "Select a budget range"),
});
export type BrandOnboardingInput = z.infer<typeof brandOnboardingSchema>;

export const creatorOnboardingSchema = z.object({
  bio:   z.string().min(10, "Bio must be at least 10 characters").max(200),
  niche: z.string().min(1, "Select your niche"),
  city:  z.string().min(1, "Enter your city"),
  rates: z.object({
    story: z.number().min(0).optional(),
    reel:  z.number().min(0).optional(),
    post:  z.number().min(0).optional(),
    video: z.number().min(0).optional(),
  }),
});
export type CreatorOnboardingInput = z.infer<typeof creatorOnboardingSchema>;

// ── CAMPAIGN ──────────────────────────────────────────────────
export const campaignSchema = z.object({
  title:        z.string().min(5, "Title must be at least 5 characters"),
  platform:     z.string().min(1, "Select a platform"),
  contentType:  z.string().min(1, "Select content type"),
  brief:        z.string().min(50, "Brief must be at least 50 characters"),
  budget:       z.number().min(1000, "Minimum budget is ₹1,000"),
  deadline:     z.string().min(1, "Select a deadline"),
  maxRevisions: z.number().min(1).max(3),
  minFollowers: z.number().min(0).default(0),
});
export type CampaignInput = z.infer<typeof campaignSchema>;

// ── DRAFT SUBMISSION ──────────────────────────────────────────
export const draftSubmitSchema = z.object({
  caption:  z.string().min(10, "Caption must be at least 10 characters"),
  hashtags: z.string().optional(),
});
export type DraftSubmitInput = z.infer<typeof draftSubmitSchema>;

// ── REVISION REQUEST ──────────────────────────────────────────
export const revisionSchema = z.object({
  feedback: z.string().min(20, "Please provide detailed feedback (min. 20 characters)"),
});
export type RevisionInput = z.infer<typeof revisionSchema>;

// ── PACKAGE ───────────────────────────────────────────────────
export const packageSchema = z.object({
  platform:    z.string().min(1, "Select a platform"),
  contentType: z.string().min(1, "Select content type"),
  price:       z.number().min(500, "Minimum price is ₹500"),
  deliveryDays:z.number().min(1).max(30),
  description: z.string().optional(),
});
export type PackageInput = z.infer<typeof packageSchema>;
