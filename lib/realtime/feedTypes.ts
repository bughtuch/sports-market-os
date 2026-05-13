// ─── Feed event types ─────────────────────────────────────────────────────────

export type FeedEventType =
  | "signal_created"
  | "signal_updated"
  | "volatility_spike"
  | "liquidity_shift"
  | "news_catalyst"
  | "regime_change"
  | "anomaly_detected"
  | "creator_share"
  | "ai_brief_generated"
  | "provider_status_change";

export type FeedSeverity = "low" | "medium" | "high" | "critical";
export type EscalationLevel = "low" | "medium" | "high" | "critical";
export type VolatilityState = "stable" | "building" | "spiking" | "cooling";
export type PulseRate = "slow" | "normal" | "fast" | "rapid";
export type AlertDensity = "sparse" | "normal" | "dense";

// ─── Core event ───────────────────────────────────────────────────────────────

export interface FeedEvent {
  id: string;
  type: FeedEventType;
  severity: FeedSeverity;
  sport: string;
  market: string;
  source: string;
  confidence: number;
  message: string;
  timestamp: number; // Date.now()
}

// ─── Market heat ──────────────────────────────────────────────────────────────

export interface MarketHeatScore {
  slug: string;
  title: string;
  sport: string;
  exchange: string;
  heatScore: number;           // 0–100
  escalationLevel: EscalationLevel;
  volatilityState: VolatilityState;
  aiConviction: number;        // 0–100
  divergence: number;          // 0–100
}

// ─── Terminal motion state ────────────────────────────────────────────────────

export interface TerminalMotionState {
  regime: string;
  pulseRate: PulseRate;
  alertDensity: AlertDensity;
  glowIntensity: number;       // 0–1
  feedCadenceMs: number;
}

// ─── Feed throughput (for status strip) ──────────────────────────────────────

export interface FeedThroughput {
  eventsPerMin: number;
  latencyMs: number;
  providerSyncSecsRemaining: number;
}
