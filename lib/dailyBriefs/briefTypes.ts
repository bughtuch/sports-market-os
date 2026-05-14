/**
 * Types for the persisted daily brief layer (Sprint 30).
 * Distinct from lib/briefs/briefTypes.ts which covers in-memory brief generation.
 */

export type SessionType = "morning" | "midday" | "overnight";

export interface PersistedBrief {
  id:            string;
  generated_for: string;   // YYYY-MM-DD
  session_type:  string;
  title:         string;
  summary:       string;
  regime:        string;
  ai_confidence: number;   // 0–100
  metadata:      Record<string, unknown>;
  created_at:    string;
  sections?:     PersistedBriefSection[];
}

export interface PersistedBriefSection {
  id:           string;
  brief_id:     string;
  section_type: string;
  title:        string;
  content:      string;
  severity:     string;
  sort_order:   number;
  metadata:     Record<string, unknown>;
}

export interface BriefScores {
  aiConfidence:            number;   // 0–100
  volatilitySeverity:      number;   // 0–100
  marketStressScore:       number;   // 0–100
  anomalyScore:            number;   // 0–100
  creatorOpportunityScore: number;   // 0–100
}

export interface BriefHistoryEntry {
  id:            string;
  generated_for: string;
  session_type:  string;
  title:         string;
  ai_confidence: number;
  regime:        string;
  created_at:    string;
}

export const SESSION_LABELS: Record<SessionType, string> = {
  morning:   "Morning Brief",
  midday:    "Midday Brief",
  overnight: "Overnight Brief",
};

export const CONFIDENCE_COLOR = (score: number): string => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 65) return "text-amber-400";
  return "text-red-400";
};
