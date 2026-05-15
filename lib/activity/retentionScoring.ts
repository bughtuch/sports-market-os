/**
 * retentionScoring.ts — Intelligence Habit Score computation.
 *
 * Deterministic score (0–100) based on observable usage patterns.
 * Institutional framing — not gamified.
 */

import type { ActivitySummary } from "./activityTypes";

export interface RetentionScore {
  total:              number;   // 0–100
  label:              string;
  components: {
    dailyUsage:       number;
    briefEngagement:  number;
    alertActivity:    number;
    exportActivity:   number;
    watchlistUse:     number;
    streakBonus:      number;
  };
  tier: "establishing" | "active" | "embedded" | "power";
}

export function computeRetentionScore(summary: ActivitySummary): RetentionScore {
  const last7 = summary.last7Days;

  // Days active in last 7
  const activeDays = last7.filter(d =>
    d.terminal_views + d.exports_created + d.alerts_created +
    d.briefs_viewed + d.watchlists_used + d.distribution_actions > 0
  ).length;

  // Totals over last 7 days
  const totalBriefs   = last7.reduce((s, d) => s + d.briefs_viewed, 0);
  const totalAlerts   = last7.reduce((s, d) => s + d.alerts_created, 0);
  const totalExports  = last7.reduce((s, d) => s + d.exports_created, 0);
  const totalWL       = last7.reduce((s, d) => s + d.watchlists_used, 0);

  // Component scores (each 0–100 before weighting)
  const dailyUsage      = Math.min(100, Math.round((activeDays / 7) * 100));
  const briefEngagement = Math.min(100, totalBriefs * 14);
  const alertActivity   = Math.min(100, totalAlerts * 20);
  const exportActivity  = Math.min(100, totalExports * 25);
  const watchlistUse    = Math.min(100, totalWL * 20);
  const streakBonus     = Math.min(100, summary.streak * 10);

  // Weighted total
  const total = Math.round(
    dailyUsage      * 0.30 +
    briefEngagement * 0.20 +
    alertActivity   * 0.15 +
    exportActivity  * 0.15 +
    watchlistUse    * 0.10 +
    streakBonus     * 0.10
  );

  const tier: RetentionScore["tier"] =
    total >= 75 ? "power"       :
    total >= 50 ? "embedded"    :
    total >= 25 ? "active"      : "establishing";

  const label =
    tier === "power"       ? "Power User"       :
    tier === "embedded"    ? "Embedded"         :
    tier === "active"      ? "Active"           : "Establishing";

  return {
    total,
    label,
    components: { dailyUsage, briefEngagement, alertActivity, exportActivity, watchlistUse, streakBonus },
    tier,
  };
}

export function tierColor(tier: RetentionScore["tier"]): string {
  return {
    power:       "text-emerald-400",
    embedded:    "text-blue-400",
    active:      "text-amber-400",
    establishing: "text-zinc-400",
  }[tier];
}
