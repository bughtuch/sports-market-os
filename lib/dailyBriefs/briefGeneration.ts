/**
 * briefGeneration.ts — Wraps existing generator + scoring for persistence.
 * Bridges lib/briefs/ (in-memory) with lib/dailyBriefs/ (persisted).
 */

import { generateDailyBrief } from "@/lib/briefs/dailyBriefGenerator";
import type { BriefType, DailyBrief } from "@/lib/briefs/briefTypes";
import { scoreBrief, detectSessionType } from "./briefScoring";
import type { BriefScores, PersistedBriefSection } from "./briefTypes";

export interface GeneratedBriefBundle {
  brief:    DailyBrief;
  scores:   BriefScores;
  sections: PersistedBriefSection[];
  date:     string;      // YYYY-MM-DD
  session:  string;
}

export function buildBriefBundle(type?: BriefType): GeneratedBriefBundle {
  const brief   = generateDailyBrief(type);
  const scores  = scoreBrief(brief);
  const now     = new Date();
  const date    = now.toISOString().split("T")[0];
  const session = detectSessionType();

  const sections: PersistedBriefSection[] = brief.sections.map((s, i) => ({
    id:           ``,   // assigned by DB
    brief_id:     ``,   // assigned after insert
    section_type: s.type,
    title:        s.heading,
    content:      [s.body, ...(s.bullets ?? [])].join("\n"),
    severity:     s.severity ?? "info",
    sort_order:   i,
    metadata:     {},
  }));

  // Creator opportunities section
  sections.push({
    id:           ``,
    brief_id:     ``,
    section_type: "creator-opportunities",
    title:        "Creator Opportunities",
    content:      buildCreatorSection(brief),
    severity:     "info",
    sort_order:   sections.length,
    metadata:     { creatorScore: scores.creatorOpportunityScore },
  });

  return { brief, scores, sections, date, session };
}

function buildCreatorSection(brief: DailyBrief): string {
  const lines = [
    `Creator opportunity score: ${Math.round((brief.catalysts.length / 8) * 100)}% content readiness.`,
    `Active catalysts for content: ${brief.catalysts.slice(0, 2).join(" · ")}.`,
    `Top signal for recap: ${brief.topSignalTitles[0] ?? "No signals"}.`,
    `Regime context: ${brief.aiRegimeSummary.split(".")[0]}.`,
    `Suggested formats: market recap thread · volatility analysis · exchange flow commentary.`,
  ];
  return lines.join("\n");
}
