/**
 * Distribution history utilities.
 *
 * Reads from the localStorage queue (shared storage).
 * History = all posts with status "posted" | "failed".
 */

import { getByStatus } from "./distributionQueue";
import type { DistributionPost, QueueStats } from "./distributionTypes";

/** Returns all posted items, most-recent first. */
export function getPostHistory(): DistributionPost[] {
  return getByStatus("posted").sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Returns all failed items, most-recent first. */
export function getFailedHistory(): DistributionPost[] {
  return getByStatus("failed").sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Returns the N most-recent posts across all statuses. */
export function getRecentActivity(limit = 10): DistributionPost[] {
  const { getQueue } = require("./distributionQueue");
  return (getQueue() as DistributionPost[])
    .sort((a: DistributionPost, b: DistributionPost) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

/**
 * Estimated total impressions from all posted items.
 * Mock only — not connected to real analytics.
 */
export function getTotalEstimatedImpressions(): number {
  return getByStatus("posted").reduce(
    (sum, p) => sum + (p.engagementEstimate?.estimatedImpressions ?? 0),
    0
  );
}

/**
 * Estimated total reach from queued + scheduled items.
 * Mock only.
 */
export function getQueuedReach(): number {
  return getByStatus("queued", "scheduled").reduce(
    (sum, p) => sum + (p.engagementEstimate?.estimatedReach ?? 0),
    0
  );
}

/** Breakdown by platform for history. */
export function getHistoryByPlatform(): Record<string, number> {
  const history = getByStatus("posted");
  return history.reduce<Record<string, number>>((acc, p) => {
    acc[p.platform] = (acc[p.platform] ?? 0) + 1;
    return acc;
  }, {});
}
