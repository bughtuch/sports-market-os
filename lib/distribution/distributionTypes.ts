/**
 * Distribution system types — Sprint 20.
 *
 * Covers post model, platform enum, status enum, queue stats,
 * and adapter result types.
 *
 * No real API posting yet — mock/localStorage shell only.
 */

// ─── Platforms ────────────────────────────────────────────────────────────────

export type DistributionPlatform =
  | "x"
  | "telegram"
  | "discord"
  | "reddit"
  | "youtube-shorts"
  | "tiktok"
  | "instagram"
  | "email-brief";

export const PLATFORM_LABELS: Record<DistributionPlatform, string> = {
  "x":              "X / Twitter",
  "telegram":       "Telegram",
  "discord":        "Discord",
  "reddit":         "Reddit",
  "youtube-shorts": "YouTube Shorts",
  "tiktok":         "TikTok",
  "instagram":      "Instagram",
  "email-brief":    "Email Brief",
};

// ─── Statuses ─────────────────────────────────────────────────────────────────

export type PostStatus =
  | "queued"
  | "scheduled"
  | "posted"
  | "failed"
  | "draft";

// ─── Distribution types ───────────────────────────────────────────────────────

export type DistributionType =
  | "signal-card"
  | "x-post"
  | "telegram-broadcast"
  | "shorts-script"
  | "discord-alert"
  | "reddit-breakdown"
  | "email-brief"
  | "creator-broadcast";

export const DISTRIBUTION_TYPE_LABELS: Record<DistributionType, string> = {
  "signal-card":         "Signal Card",
  "x-post":              "X Post",
  "telegram-broadcast":  "Telegram Broadcast",
  "shorts-script":       "Shorts Script",
  "discord-alert":       "Discord Alert",
  "reddit-breakdown":    "Reddit Breakdown",
  "email-brief":         "Email Brief",
  "creator-broadcast":   "Creator Broadcast",
};

// ─── Post model ───────────────────────────────────────────────────────────────

export interface EngagementEstimate {
  estimatedReach:       number;
  estimatedImpressions: number;
  engagementRate:       number; // 0–1
}

export interface PostMetadata {
  sport?:           string;
  signalId?:        string;
  exportLayoutId?:  string;
  exportThemeId?:   string;
  creatorHandle?:   string;
  broadcastGroup?:  string;
  tags?:            string[];
  failureReason?:   string;
}

export interface DistributionPost {
  id:                  string;
  platform:            DistributionPlatform;
  content:             string;
  exportImage?:        string; // data URL ref or export filename
  partnerCode?:        string;
  status:              PostStatus;
  createdAt:           string;
  scheduledFor?:       string;
  engagementEstimate?: EngagementEstimate;
  distributionType:    DistributionType;
  metadata:            PostMetadata;
}

// ─── Queue stats ──────────────────────────────────────────────────────────────

export interface QueueStats {
  queued:         number;
  scheduled:      number;
  posted:         number;
  failed:         number;
  drafts:         number;
  estimatedReach: number;
}

// ─── Adapter result ───────────────────────────────────────────────────────────

export interface AdapterResult {
  success:   boolean;
  postId?:   string;
  error?:    string;
  platform:  DistributionPlatform;
}

// ─── Creator broadcast group ──────────────────────────────────────────────────

export interface BroadcastGroup {
  id:          string;
  name:        string;
  sport:       string;
  platforms:   DistributionPlatform[];
  creatorCount: number;
  estReach:    number;
  activityLevel: "high" | "medium" | "low";
  lastBroadcast?: string;
}
