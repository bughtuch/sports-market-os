/**
 * briefScoring.ts — Deterministic scoring for daily brief quality and market state.
 */

import type { DailyBrief } from "@/lib/briefs/briefTypes";
import type { BriefScores } from "./briefTypes";

export function scoreBrief(brief: DailyBrief): BriefScores {
  const hour = new Date().getUTCHours();

  // AI confidence: highest in morning (fresh data), drops overnight
  const baseConfidence =
    brief.type === "morning"          ? 78 :
    brief.type === "midday"           ? 72 :
    brief.type === "overnight"        ? 61 :
    brief.type === "volatility-alert" ? 82 :
    brief.type === "exchange-shift"   ? 79 : 70;

  // Modulate by hour (peak accuracy 07:00–11:00 UTC)
  const hourBonus = (hour >= 7 && hour <= 11) ? 4 : (hour >= 0 && hour <= 4) ? -6 : 0;
  const aiConfidence = Math.min(95, Math.max(50, baseConfidence + hourBonus));

  // Volatility severity: scale from brief type
  const volatilitySeverity =
    brief.type === "volatility-alert" ? 88 :
    brief.type === "exchange-shift"   ? 72 :
    brief.type === "morning"          ? 54 :
    brief.type === "midday"           ? 48 : 32;

  // Market stress: catalyst count + volatility type
  const catalystWeight    = Math.min(brief.catalysts.length * 10, 40);
  const signalWeight      = Math.min(brief.topSignalTitles.length * 8, 40);
  const volatileTypeBonus = brief.type === "volatility-alert" ? 20 : 0;
  const marketStressScore = Math.min(100, catalystWeight + signalWeight + volatileTypeBonus);

  // Anomaly score: deviation from quiet baseline
  const hasMultipleWarnings = brief.sections.filter(s => s.severity === "warning" || s.severity === "critical").length;
  const anomalyScore = Math.min(100, hasMultipleWarnings * 25 + (brief.type === "volatility-alert" ? 35 : 0));

  // Creator opportunity: catalysts + morning timing
  const creatorBase = brief.type === "morning" ? 60 : 40;
  const creatorBoost = brief.catalysts.length >= 3 ? 20 : brief.catalysts.length >= 2 ? 10 : 0;
  const creatorOpportunityScore = Math.min(100, creatorBase + creatorBoost);

  return {
    aiConfidence,
    volatilitySeverity,
    marketStressScore,
    anomalyScore,
    creatorOpportunityScore,
  };
}

export function scoreToLabel(score: number): string {
  if (score >= 80) return "HIGH";
  if (score >= 60) return "MODERATE";
  if (score >= 40) return "LOW";
  return "MINIMAL";
}

export function detectSessionType(): "morning" | "midday" | "overnight" {
  const hour = new Date().getUTCHours();
  if (hour >= 5  && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "midday";
  return "overnight";
}
