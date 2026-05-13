// ─── AI Engine mode ───────────────────────────────────────────────────────────

export type AIMode = "simulated" | "hybrid" | "live-ready";
export type AIEngineStatusType = "active" | "simulated" | "degraded" | "queued";

// ─── Domain classification types ─────────────────────────────────────────────

export type VolatilityRegime =
  | "compression"
  | "expansion"
  | "anomaly"
  | "acceleration"
  | "exhaustion"
  | "stable";

export type MarketRegime =
  | "stable"
  | "volatile"
  | "expansion"
  | "compression"
  | "panic"
  | "rotational"
  | "illiquid";

export type BehaviouralState =
  | "panic"
  | "euphoria"
  | "uncertainty"
  | "crowd_consensus"
  | "sharp_divergence"
  | "neutral";

export type AISeverity = "low" | "medium" | "high" | "critical";

export type OpportunityCategory =
  | "divergence"
  | "liquidity"
  | "volatility"
  | "cross_market"
  | "structural";

// ─── AI Market Narrative ──────────────────────────────────────────────────────

export interface AIMarketNarrative {
  id: string;
  timestamp: string;
  narrative: string;
  confidence: number;
  regimeTag: string;
  severity: AISeverity;
  affectedMarkets: string[];
}

// ─── AI Liquidity Insight ─────────────────────────────────────────────────────

export interface AILiquidityInsight {
  id: string;
  timestamp: string;
  interpretation: string;
  confidence: number;
  structuralPressure: "bullish" | "bearish" | "neutral";
  spoofRisk: number;
  liquidityQuality: number;
  buyImbalance: number;
  sellImbalance: number;
  queueHealth: number;
  lateMoney: boolean;
  flowDivergence: boolean;
}

// ─── AI Volatility Insight ────────────────────────────────────────────────────

export interface AIVolatilityInsight {
  id: string;
  timestamp: string;
  regime: VolatilityRegime;
  projectedMovement: number;
  anomalyScore: number;
  confidence: number;
  summary: string;
  affectedSports: string[];
}

// ─── AI Opportunity ───────────────────────────────────────────────────────────

export interface AIOpportunity {
  id: string;
  timestamp: string;
  title: string;
  explanation: string;
  confidence: number;
  severity: AISeverity;
  affectedMarkets: string[];
  category: OpportunityCategory;
}

// ─── AI Behaviour Signal ──────────────────────────────────────────────────────

export interface AIBehaviourSignal {
  id: string;
  timestamp: string;
  state: BehaviouralState;
  summary: string;
  behaviouralPressure: number;
  crowdAlignment: number;
  institutionalDivergence: number;
  confidence: number;
}

// ─── AI Regime State ──────────────────────────────────────────────────────────

export interface AIRegimeState {
  id: string;
  timestamp: string;
  regime: MarketRegime;
  confidence: number;
  commentary: string;
  triggerFactors: string[];
}

// ─── AI Brief ─────────────────────────────────────────────────────────────────

export interface AIBrief {
  id: string;
  timestamp: string;
  headline: string;
  regimeSummary: string;
  keyCatalysts: string[];
  liquidityConditions: string;
  volatilityStatus: string;
  outlook: string;
  generatedBy: string;
}

// ─── AI Engine Status ─────────────────────────────────────────────────────────

export interface AIEngineStatus {
  id: string;
  name: string;
  status: AIEngineStatusType;
  latencyMs: number;
  lastRun: string;
  mode: AIMode;
  description: string;
}

// ─── Combined AI payload ──────────────────────────────────────────────────────

export interface AIIntelligencePayload {
  narrative: AIMarketNarrative;
  liquidity: AILiquidityInsight;
  volatility: AIVolatilityInsight;
  opportunities: AIOpportunity[];
  behaviour: AIBehaviourSignal;
  regime: AIRegimeState;
  brief: AIBrief;
  engines: AIEngineStatus[];
  mode: AIMode;
  timestamp: string;
}
