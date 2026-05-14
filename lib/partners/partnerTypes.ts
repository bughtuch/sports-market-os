/**
 * Partner tracking types — Sprint 17 referral infrastructure.
 *
 * Compliance note: These types support attribution tracking only.
 * No financial settlement, no commission payouts, no Stripe integration.
 * Future commission infrastructure is explicitly documented below.
 */

// ─── Status ───────────────────────────────────────────────────────────────────

export type PartnerStatus = "pending" | "active" | "suspended";
export type PartnerPlatform =
  | "telegram"
  | "x"
  | "youtube"
  | "discord"
  | "newsletter"
  | "other";

export type ReferralEventType = "click" | "signup" | "export" | "api_referral";

// ─── Partner profile ──────────────────────────────────────────────────────────

export interface PartnerProfile {
  id: string;
  userId: string;
  partnerCode: string;
  displayName: string | null;
  platform: PartnerPlatform | null;
  audienceSize: string | null;
  status: PartnerStatus;
  createdAt: string;

  // NOTE: commissionRate, payoutMethod, stripeConnectId are NOT included.
  // Financial fields will be added in a future billing sprint.
}

// ─── Referral event ───────────────────────────────────────────────────────────

export interface ReferralEvent {
  partnerCode: string;
  eventType: ReferralEventType;
  referredUserId?: string;
  sourceUrl?: string;
  landingPage?: string;
  metadata?: Record<string, unknown>;
}

// ─── Partner metrics ──────────────────────────────────────────────────────────

export interface PartnerMetrics {
  partnerCode: string;
  clicks: number;
  signups: number;
  exports: number;
  apiReferrals: number;
  estimatedReach: number;
  updatedAt: string;

  // NOTE: commissionTotal, pendingPayout are NOT included.
  // Financial aggregates will be added after Stripe integration.
}

// ─── Referral capture ─────────────────────────────────────────────────────────

export interface ReferralCapture {
  code: string;
  landingPage: string;
  timestamp: string;
  sourcePath: string;
}

// ─── API response shapes ──────────────────────────────────────────────────────

export interface PartnerProfileResponse {
  profile: PartnerProfile | null;
  isPartner: boolean;
  referralUrl: string | null;
}

export interface PartnerMetricsResponse {
  metrics: PartnerMetrics | null;
  partnerCode: string | null;
}

export interface TrackEventResponse {
  tracked: boolean;
  eventType: ReferralEventType;
}
