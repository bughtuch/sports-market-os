/**
 * Distribution queue — localStorage shell.
 *
 * Client-safe (checks typeof window).
 * No Supabase in this sprint — queue lives in localStorage.
 * Key: "smos_distribution_queue"
 *
 * Future: replace with Supabase table + realtime subscriptions.
 */

import type {
  DistributionPost,
  DistributionPlatform,
  DistributionType,
  PostStatus,
  QueueStats,
  EngagementEstimate,
} from "./distributionTypes";

const QUEUE_KEY = "smos_distribution_queue";

// ─── Engagement estimate seed (mock) ─────────────────────────────────────────

const REACH_RANGES: Record<DistributionPlatform, [number, number]> = {
  "x":              [1200, 8000],
  "telegram":       [400,  2000],
  "discord":        [100,  500],
  "reddit":         [500,  5000],
  "youtube-shorts": [200,  2000],
  "tiktok":         [500,  4000],
  "instagram":      [300,  3000],
  "email-brief":    [50,   500],
};

const IMPRESSION_MULT: Record<DistributionPlatform, number> = {
  "x":              3.2,
  "telegram":       1.0,
  "discord":        1.0,
  "reddit":         4.0,
  "youtube-shorts": 2.0,
  "tiktok":         3.5,
  "instagram":      2.5,
  "email-brief":    1.0,
};

function mockEngagement(platform: DistributionPlatform): EngagementEstimate {
  const [lo, hi] = REACH_RANGES[platform];
  const reach = Math.floor(lo + Math.random() * (hi - lo));
  return {
    estimatedReach:       reach,
    estimatedImpressions: Math.floor(reach * IMPRESSION_MULT[platform]),
    engagementRate:       parseFloat((0.02 + Math.random() * 0.08).toFixed(3)),
  };
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

function read(): DistributionPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as DistributionPost[]) : [];
  } catch {
    return [];
  }
}

function write(posts: DistributionPost[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(posts));
  } catch {
    // Silent — storage may be full
  }
}

function nanoid(): string {
  return `dist_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Returns the full queue (all statuses). */
export function getQueue(): DistributionPost[] {
  return read();
}

/** Returns posts filtered by one or more statuses. */
export function getByStatus(...statuses: PostStatus[]): DistributionPost[] {
  return read().filter(p => statuses.includes(p.status));
}

/**
 * Adds a post to the queue with status "queued".
 * Returns the created post.
 */
export function queuePost(
  draft: Omit<DistributionPost, "id" | "createdAt" | "status">
): DistributionPost {
  const post: DistributionPost = {
    ...draft,
    id:        nanoid(),
    status:    "queued",
    createdAt: new Date().toISOString(),
    engagementEstimate: draft.engagementEstimate ?? mockEngagement(draft.platform),
  };
  const posts = read();
  write([post, ...posts]);
  return post;
}

/**
 * Saves a post as a draft (status "draft").
 */
export function saveDraft(
  draft: Omit<DistributionPost, "id" | "createdAt" | "status">
): DistributionPost {
  const post: DistributionPost = {
    ...draft,
    id:        nanoid(),
    status:    "draft",
    createdAt: new Date().toISOString(),
  };
  const posts = read();
  write([post, ...posts]);
  return post;
}

/**
 * Schedules a post for a future ISO datetime.
 */
export function schedulePost(
  draft: Omit<DistributionPost, "id" | "createdAt" | "status">,
  scheduledFor: string
): DistributionPost {
  const post: DistributionPost = {
    ...draft,
    id:          nanoid(),
    status:      "scheduled",
    createdAt:   new Date().toISOString(),
    scheduledFor,
    engagementEstimate: draft.engagementEstimate ?? mockEngagement(draft.platform),
  };
  const posts = read();
  write([post, ...posts]);
  return post;
}

/** Removes a post by id. */
export function removeQueuedPost(id: string): void {
  write(read().filter(p => p.id !== id));
}

/** Resets a failed post back to "queued". */
export function retryQueuedPost(id: string): void {
  write(
    read().map(p =>
      p.id === id ? { ...p, status: "queued", metadata: { ...p.metadata, failureReason: undefined } } : p
    )
  );
}

/** Marks a post as successfully posted. */
export function markPosted(id: string): void {
  write(read().map(p => (p.id === id ? { ...p, status: "posted" } : p)));
}

/** Marks a post as failed, optionally storing the reason. */
export function markFailed(id: string, reason?: string): void {
  write(
    read().map(p =>
      p.id === id
        ? { ...p, status: "failed", metadata: { ...p.metadata, failureReason: reason } }
        : p
    )
  );
}

/**
 * Duplicates an existing post as a new "queued" entry.
 * Useful for re-queuing a posted item to a different platform.
 */
export function duplicatePost(id: string): DistributionPost | null {
  const original = read().find(p => p.id === id);
  if (!original) return null;
  return queuePost({
    platform:         original.platform,
    content:          original.content,
    exportImage:      original.exportImage,
    partnerCode:      original.partnerCode,
    distributionType: original.distributionType,
    metadata:         original.metadata,
  });
}

/** Promotes a draft to queued status. */
export function publishDraft(id: string): void {
  write(
    read().map(p =>
      p.id === id && p.status === "draft"
        ? { ...p, status: "queued", engagementEstimate: mockEngagement(p.platform) }
        : p
    )
  );
}

/** Returns aggregate stats for the current queue. */
export function getQueueStats(): QueueStats {
  const posts = read();
  const queued    = posts.filter(p => p.status === "queued").length;
  const scheduled = posts.filter(p => p.status === "scheduled").length;
  const posted    = posts.filter(p => p.status === "posted").length;
  const failed    = posts.filter(p => p.status === "failed").length;
  const drafts    = posts.filter(p => p.status === "draft").length;
  const estimatedReach = posts
    .filter(p => p.status === "queued" || p.status === "scheduled")
    .reduce((sum, p) => sum + (p.engagementEstimate?.estimatedReach ?? 0), 0);

  return { queued, scheduled, posted, failed, drafts, estimatedReach };
}

/** Clears the entire queue — use with caution. */
export function clearQueue(): void {
  write([]);
}

// ─── Seed helpers (for demo) ──────────────────────────────────────────────────

export type { DistributionPlatform, DistributionType };

/** Pre-fills the queue with demo posts if it's empty. */
export function seedQueueIfEmpty(): void {
  if (read().length > 0) return;

  const demos: Omit<DistributionPost, "id" | "createdAt" | "status">[] = [
    {
      platform: "x",
      content:  "🏇 Horse Racing market structure just shifted. AI detected a significant back-money surge on the 3:40 at Ascot. Volatility is climbing. Exchange order flow intelligence via Sports Market OS.",
      distributionType: "signal-card",
      metadata: { sport: "Horse Racing", tags: ["horseracing", "betfair"] },
    },
    {
      platform: "telegram",
      content:  "📊 TENNIS INTELLIGENCE BRIEF\n\nExchange data shows unusual lay activity on the favourite in the 2nd set. AI confidence: 84%. This is structural — not noise.\n\nMarket intelligence only · Not financial advice",
      distributionType: "telegram-broadcast",
      metadata: { sport: "Tennis", broadcastGroup: "Tennis Trading Creators" },
    },
    {
      platform: "x",
      content:  "NBA market update: Unusual pre-game line movement detected across 3 major exchanges. AI volatility score: 91. Structural signal — not a tip.\n\n#NBA #MarketIntelligence",
      distributionType: "x-post",
      metadata: { sport: "NBA", tags: ["NBA", "markets"] },
    },
  ];

  const posts = demos.map((d, i) => ({
    ...d,
    id:        nanoid(),
    status:    (["queued", "draft", "posted"] as PostStatus[])[i] ?? "queued",
    createdAt: new Date(Date.now() - i * 3_600_000).toISOString(),
    engagementEstimate: mockEngagement(d.platform),
  })) as DistributionPost[];

  write(posts);
}
