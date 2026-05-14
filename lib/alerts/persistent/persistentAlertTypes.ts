// ─── Alert type definitions ───────────────────────────────────────────────────

export type PersistentAlertType =
  | "volatility-spike"
  | "liquidity-anomaly"
  | "queue-deterioration"
  | "ai-confidence"
  | "exchange-flow-shift"
  | "catalyst-detected"
  | "market-regime-change";

export type PersistentSeverity = "low" | "medium" | "high" | "critical";

export const PERSISTENT_ALERT_TYPES: { id: PersistentAlertType; label: string; description: string }[] = [
  { id: "volatility-spike",     label: "Volatility Spike",      description: "Trigger when implied volatility exceeds the threshold (σ)." },
  { id: "liquidity-anomaly",    label: "Liquidity Anomaly",     description: "Trigger on unexpected thin liquidity or spread widening." },
  { id: "queue-deterioration",  label: "Queue Deterioration",   description: "Trigger when Betfair queue depth falls below threshold %." },
  { id: "ai-confidence",        label: "AI Confidence",         description: "Trigger when AI signal confidence exceeds threshold %." },
  { id: "exchange-flow-shift",  label: "Exchange Flow Shift",   description: "Trigger on institutional rotation above percentile threshold." },
  { id: "catalyst-detected",    label: "Catalyst Detected",     description: "Trigger on any high-severity news catalyst in selected sport." },
  { id: "market-regime-change", label: "Market Regime Change",  description: "Trigger when AI regime classification changes on a sport." },
];

export const PERSISTENT_SEVERITY_LEVELS: PersistentSeverity[] = ["low", "medium", "high", "critical"];

export const PERSISTENT_SEVERITY_COLOR: Record<PersistentSeverity, string> = {
  low:      "text-zinc-400",
  medium:   "text-blue-400",
  high:     "text-amber-400",
  critical: "text-red-400",
};

export const PERSISTENT_SEVERITY_BG: Record<PersistentSeverity, string> = {
  low:      "bg-zinc-400/5  border-zinc-400/20",
  medium:   "bg-blue-400/5  border-blue-400/20",
  high:     "bg-amber-400/5 border-amber-400/20",
  critical: "bg-red-400/5   border-red-400/20",
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface PersistentAlertRule {
  id:          string;
  user_id:     string;
  market_slug?: string;
  sport?:      string;
  alert_type:  PersistentAlertType;
  threshold?:  number;
  severity:    PersistentSeverity;
  enabled:     boolean;
  metadata:    Record<string, unknown>;
  created_at:  string;
  updated_at:  string;
  // Derived display fields (not stored)
  name?:       string;
  description?: string;
}

export interface TriggeredAlert {
  id:            string;
  alert_rule_id: string;
  user_id:       string;
  market_slug?:  string;
  sport?:        string;
  title:         string;
  message:       string;
  severity:      PersistentSeverity;
  triggered_at:  string;
  metadata:      Record<string, unknown>;
}

export interface CreateAlertRulePayload {
  market_slug?: string;
  sport?:       string;
  alert_type:   PersistentAlertType;
  threshold?:   number;
  severity:     PersistentSeverity;
  metadata?:    Record<string, unknown>;
}

export interface AlertRuleStats {
  total:        number;
  enabled:      number;
  disabled:     number;
  byType:       Record<PersistentAlertType, number>;
  bySport:      Record<string, number>;
  bySeverity:   Record<PersistentSeverity, number>;
}

export interface TriggeredAlertStats {
  total:         number;
  today:         number;
  critical:      number;
  high:          number;
  mostActiveSport?: string;
  mostActiveType?:  PersistentAlertType;
}

// ─── Default threshold values per alert type ──────────────────────────────────

export const DEFAULT_THRESHOLDS: Partial<Record<PersistentAlertType, number>> = {
  "volatility-spike":    2.0,
  "queue-deterioration": 0.3,
  "ai-confidence":       80,
  "exchange-flow-shift": 80,
};
