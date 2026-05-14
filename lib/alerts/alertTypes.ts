export type AlertSeverity = "info" | "warning" | "critical";

export type AlertCategory =
  | "volatility-spike"
  | "queue-deterioration"
  | "catalyst-event"
  | "ai-confidence"
  | "exchange-flow-shift"
  | "market-regime-change"
  | "watchlist";

export interface AlertRule {
  id:          string;
  name:        string;
  category:    AlertCategory;
  description: string;
  threshold?:  number;
  sport?:      string;
  market?:     string;
  enabled:     boolean;
}

export interface Alert {
  id:             string;
  ruleId:         string;
  category:       AlertCategory;
  severity:       AlertSeverity;
  title:          string;
  body:           string;
  market?:        string;
  sport?:         string;
  triggeredAt:    string;
  dismissed:      boolean;
  relatedMarkets?: string[];
}

export const ALERT_CATEGORY_LABELS: Record<AlertCategory, string> = {
  "volatility-spike":    "Volatility Spike",
  "queue-deterioration": "Queue Deterioration",
  "catalyst-event":      "Catalyst Event",
  "ai-confidence":       "AI Confidence Threshold",
  "exchange-flow-shift": "Exchange Flow Shift",
  "market-regime-change":"Market Regime Change",
  "watchlist":           "Watchlist Alert",
};

export const ALERT_SEVERITY_COLOR: Record<AlertSeverity, string> = {
  info:     "text-blue-400",
  warning:  "text-amber-400",
  critical: "text-red-400",
};

export const ALERT_SEVERITY_BG: Record<AlertSeverity, string> = {
  info:     "bg-blue-400/5 border-blue-400/20",
  warning:  "bg-amber-400/5 border-amber-400/20",
  critical: "bg-red-400/5 border-red-400/20",
};
