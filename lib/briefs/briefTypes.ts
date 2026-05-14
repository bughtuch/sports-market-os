export type BriefType =
  | "morning"
  | "midday"
  | "overnight"
  | "volatility-alert"
  | "exchange-shift";

export type BriefSectionType =
  | "top-signals"
  | "catalysts"
  | "volatility"
  | "exchange-flow"
  | "ai-regime"
  | "watchlist-movement"
  | "summary";

export interface BriefSection {
  type:     BriefSectionType;
  heading:  string;
  body:     string;
  bullets?: string[];
  severity?: "info" | "warning" | "critical";
}

export interface DailyBrief {
  id:                  string;
  type:                BriefType;
  title:               string;
  subtitle:            string;
  generatedAt:         string;
  sport?:              string;
  sections:            BriefSection[];
  topSignalTitles:     string[];
  catalysts:           string[];
  aiRegimeSummary:     string;
  exchangeFlowNote:    string;
  volatilityNote:      string;
  watchlistMovement:   string;
}

export const BRIEF_TYPE_LABELS: Record<BriefType, string> = {
  "morning":          "Morning Brief",
  "midday":           "Midday Brief",
  "overnight":        "Overnight Brief",
  "volatility-alert": "Volatility Alert Brief",
  "exchange-shift":   "Exchange Shift Brief",
};
