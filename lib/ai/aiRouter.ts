/**
 * AI Router — orchestrates all AI engines and provides structured output.
 *
 * Current mode: simulated (all output generated locally, no external API calls).
 *
 * Future architecture:
 *   - "hybrid": local engines + selective Claude/OpenAI calls for narrative
 *   - "live-ready": full LLM routing with ensemble fallback
 *
 * AI providers to support:
 *   - Anthropic Claude (claude-opus-4-6, claude-sonnet-4-6)
 *   - OpenAI GPT-4o
 *   - Local inference (llama.cpp, Ollama)
 *   - Ensemble routing with confidence weighting
 */

import type {
  AIBrief,
  AIEngineStatus,
  AIIntelligencePayload,
  AIMode,
} from "./types";
import { generateNarrative } from "./narratorEngine";
import { generateLiquidityInsight } from "./liquidityEngine";
import { generateVolatilityInsight } from "./volatilityEngine";
import { generateOpportunities } from "./opportunityEngine";
import { generateBehaviourSignal } from "./behaviouralEngine";
import { generateRegimeState } from "./regimeEngine";

// ─── Mode ─────────────────────────────────────────────────────────────────────

const AI_MODE: AIMode = "simulated";

// ─── Brief generator ──────────────────────────────────────────────────────────

function wave(phase: number): number {
  return Math.sin(Date.now() / 30000 + phase);
}

function pick<T>(arr: readonly T[], phase: number): T {
  const idx = Math.abs(Math.floor(((wave(phase) + 1) / 2) * arr.length)) % arr.length;
  return arr[idx] as T;
}

function ts(): string {
  return new Date().toISOString();
}

const BRIEF_HEADLINES = [
  "Compression Regime: Pre-Catalyst Positioning Detected Across Exchange Network",
  "Elevated Volatility: Sharp-Side Divergence Widening Across Primary Markets",
  "Rotational Flow: Institutional Capital Repositioning Ahead of Key Catalyst Window",
  "Liquidity Anomaly: Queue Deterioration Pattern Consistent with Informed Pre-Event Activity",
  "Expansion Phase: Volume Acceleration Confirming Directional Momentum Formation",
  "Sharp Divergence Alert: Crowd/Institutional Positioning at Multi-Session High",
  "Volatile Regime: Multiple Structural Triggers Converging Across Market Sectors",
  "Illiquid Conditions: Structural Withdrawal Pattern Detected Across Exchange Network",
] as const;

const REGIME_SUMMARIES = [
  "Global market regime operating in compression phase. Volatility contraction consistent with pre-expansion historical patterns.",
  "Cross-market volatility elevated above baseline. Multiple sectors exhibiting simultaneous structural pressure.",
  "Rotational dynamics dominating cross-sector flow. Institutional repositioning consistent with tactical rebalancing.",
  "Liquidity deteriorating across monitored exchanges. Structural withdrawal pattern identified.",
  "Expansion phase characterised by increasing volume and participation. Structural indicators positive.",
  "Sharp/crowd divergence at elevated levels. Informed positioning against prevailing consensus.",
  "Volatile regime active with multiple trigger factors. AI monitoring at heightened sensitivity.",
  "Stable conditions prevailing. Standard monitoring parameters active.",
] as const;

const OUTLOOKS = [
  "Multiple structural indicators converging on compression-to-expansion transition. AI monitoring elevated across all sectors.",
  "Current regime consistent with pre-catalyst accumulation patterns. Intelligence engine prioritising queue health and flow anomalies.",
  "Elevated divergence between crowd and structural positioning warrants close monitoring across high-volume markets.",
  "Rotational dynamics suggest capital preservation positioning by institutional participants. Monitoring continuation.",
  "Volume acceleration confirms structural trend. Intelligence engine tracking momentum across exchange network.",
  "Sharp-side consensus strengthening against crowd positioning. Behavioural divergence at multi-session high.",
  "Volatile conditions require elevated monitoring. AI engines operating at maximum sensitivity.",
  "Stable regime with developing compression pattern. Pre-expansion monitoring active.",
] as const;

const KEY_CATALYSTS_POOL: string[][] = [
  ["Queue depth deterioration — Ascot 2.40 · Betfair", "Late-money signature — Djokovic vs Alcaraz", "Cross-market flow rotation — Premier League"],
  ["Sharp-side accumulation — NFL Total Markets", "Volatility compression — Warriors vs Lakers", "Informed positioning — UFC Main Event"],
  ["Polling divergence — US Election Contract · Polymarket", "Liquidity withdrawal — Horse Racing sector", "Volume acceleration — Premier League AHC"],
  ["Pre-event structural withdrawal — Cheltenham 3.15", "Crowd/sharp divergence — Poirier vs Gaethje", "IV compression — Chiefs vs Bills totals"],
];

const LIQUIDITY_CONDITIONS = [
  "Liquidity deteriorating across primary exchange order books. Queue depth below 20th percentile. Structural withdrawal pattern active.",
  "Liquidity quality elevated. Order book depth above historical average. Institutional participation at normal levels.",
  "Mixed liquidity conditions. Primary markets healthy, peripheral markets showing thinning. Flow rotation in progress.",
  "Thin market conditions. Elevated price impact risk. Pre-event informed withdrawal consistent with catalyst anticipation.",
] as const;

const VOLATILITY_STATUSES = [
  "Volatility compression entering fourth cycle. Pre-expansion configuration forming. AI confidence elevated.",
  "Volatility expansion phase active. IV above 75th percentile across monitored markets. Structural acceleration confirmed.",
  "Volatility within normal bounds. No structural anomalies. Standard monitoring parameters active.",
  "Volatility anomaly detected. 3.2σ deviation from 30-day baseline. Non-standard price discovery in progress.",
] as const;

function generateBrief(): AIBrief {
  return {
    id: `brief-${Date.now()}`,
    timestamp: ts(),
    headline: pick(BRIEF_HEADLINES, 0),
    regimeSummary: pick(REGIME_SUMMARIES, 0.8),
    keyCatalysts: pick(KEY_CATALYSTS_POOL, 1.6) as string[],
    liquidityConditions: pick(LIQUIDITY_CONDITIONS, 2.4),
    volatilityStatus: pick(VOLATILITY_STATUSES, 3.2),
    outlook: pick(OUTLOOKS, 4.0),
    generatedBy: "Sports Market OS Intelligence Engine · v1.0 (Simulated)",
  };
}

// ─── Engine status ────────────────────────────────────────────────────────────

function generateEngineStatuses(): AIEngineStatus[] {
  const t = Date.now();
  const latencyWave = (phase: number) => Math.round(8 + Math.abs(Math.sin(t / 10000 + phase)) * 28);

  return [
    {
      id: "eng-001",
      name: "Narrator Engine",
      status: "simulated",
      latencyMs: latencyWave(0),
      lastRun: ts(),
      mode: AI_MODE,
      description: "Institutional narrative generation — LLM routing ready",
    },
    {
      id: "eng-002",
      name: "Liquidity Engine",
      status: "simulated",
      latencyMs: latencyWave(0.5),
      lastRun: ts(),
      mode: AI_MODE,
      description: "Order book depth and flow analysis engine",
    },
    {
      id: "eng-003",
      name: "Volatility Engine",
      status: "simulated",
      latencyMs: latencyWave(1.0),
      lastRun: ts(),
      mode: AI_MODE,
      description: "IV compression and expansion detection engine",
    },
    {
      id: "eng-004",
      name: "Behavioural Engine",
      status: "simulated",
      latencyMs: latencyWave(1.5),
      lastRun: ts(),
      mode: AI_MODE,
      description: "Market psychology and crowd/sharp divergence analysis",
    },
    {
      id: "eng-005",
      name: "Opportunity Engine",
      status: "simulated",
      latencyMs: latencyWave(2.0),
      lastRun: ts(),
      mode: AI_MODE,
      description: "Market intelligence opportunity detection — analytics only",
    },
    {
      id: "eng-006",
      name: "Regime Engine",
      status: "simulated",
      latencyMs: latencyWave(2.5),
      lastRun: ts(),
      mode: AI_MODE,
      description: "Global market regime classification engine",
    },
  ];
}

// ─── Router functions ─────────────────────────────────────────────────────────

export function routeNarrative() {
  return { narrative: generateNarrative(), mode: AI_MODE, timestamp: ts() };
}

export function routeLiquidity() {
  return { insight: generateLiquidityInsight(), mode: AI_MODE, timestamp: ts() };
}

export function routeVolatility() {
  return { insight: generateVolatilityInsight(), mode: AI_MODE, timestamp: ts() };
}

export function routeOpportunities() {
  const opportunities = generateOpportunities();
  return { opportunities, mode: AI_MODE, timestamp: ts(), count: opportunities.length };
}

export function routeBehaviour() {
  return { signal: generateBehaviourSignal(), mode: AI_MODE, timestamp: ts() };
}

export function routeRegime() {
  return { regime: generateRegimeState(), mode: AI_MODE, timestamp: ts() };
}

export function routeBrief() {
  return { brief: generateBrief(), mode: AI_MODE, timestamp: ts() };
}

export function routeEngines() {
  return { engines: generateEngineStatuses(), mode: AI_MODE, timestamp: ts() };
}

export function routeAll(): AIIntelligencePayload {
  return {
    narrative: generateNarrative(),
    liquidity: generateLiquidityInsight(),
    volatility: generateVolatilityInsight(),
    opportunities: generateOpportunities(),
    behaviour: generateBehaviourSignal(),
    regime: generateRegimeState(),
    brief: generateBrief(),
    engines: generateEngineStatuses(),
    mode: AI_MODE,
    timestamp: ts(),
  };
}
