import type { AIMarketNarrative, AISeverity } from "./types";

// ─── Variation helpers ────────────────────────────────────────────────────────

function wave(phase: number): number {
  return Math.sin(Date.now() / 25000 + phase);
}

function pick<T>(arr: readonly T[], phase: number): T {
  const idx = Math.abs(Math.floor(((wave(phase) + 1) / 2) * arr.length)) % arr.length;
  return arr[idx] as T;
}

function ts(): string {
  return new Date().toISOString();
}

// ─── Template data ────────────────────────────────────────────────────────────

const NARRATIVES = [
  "Liquidity absorption remains elevated despite visible queue deterioration. Cross-market positioning suggests defensive rotation rather than speculative expansion. Structural bid-side pressure building across multiple exchanges — pattern consistent with institutional pre-event staging.",
  "Exchange flow patterns indicate institutional repositioning ahead of key data windows. Matched volume diverging from price movement by 2.3 standard deviations. Historically consistent with pre-catalyst accumulation by informed market participants.",
  "Queue depth compression accelerating across high-volume markets. Late-money signatures present on both sides of the book. Volatility regime transitioning from compression to pre-expansion — multiple structural triggers identified in queue.",
  "Sharp-side consensus forming against prevailing public flow. Lay-side liability building in three simultaneous markets — cross-market correlation elevated to 0.84. Structural divergence from 10-day volume baseline confirms directional intent.",
  "Market microstructure exhibiting informed positioning signature. Bid-ask spread tightening while volume accelerates — not consistent with normal price discovery dynamics. AI confidence threshold exceeded across four monitored instruments.",
  "Liquidity rotating away from peripheral markets toward primary contracts. Institutional flow signature detected across exchange pairs. Crowd-side positioning increasingly misaligned with structural data — divergence at 12-session high.",
  "Volatility compression entering fourth consecutive cycle. Historical precedent suggests imminent expansion event within 2–4 market intervals. Multiple independent indicators converging on identical directional signal.",
  "Cross-market correlation breakdown detected. Three independent signals converging on single directional thesis. Behavioural divergence between retail and institutional layers widening beyond statistical norms.",
] as const;

const REGIME_TAGS = [
  "Defensive Rotation",
  "Pre-Catalyst Positioning",
  "Volatility Compression",
  "Sharp Divergence",
  "Informed Positioning",
  "Liquidity Rotation",
  "Pre-Expansion",
  "Structural Divergence",
] as const;

const SEVERITIES: AISeverity[] = [
  "medium", "high", "medium", "high", "high", "medium", "high", "high",
];

const AFFECTED_MARKETS = [
  ["Ascot 2.40 · Betfair", "Cheltenham 3.15 · Betfair"],
  ["Warriors vs Lakers · FanDuel", "Chiefs vs Bills · DraftKings"],
  ["Djokovic vs Alcaraz · Smarkets", "Poirier vs Gaethje · Betfair"],
  ["Man City vs Arsenal · Pinnacle", "Premier League AHC Markets"],
  ["US Election Contract · Polymarket", "Prediction Market Sector"],
  ["Ascot 2.40 · Betfair", "Man City vs Arsenal · Pinnacle"],
  ["Chiefs vs Bills · DraftKings", "Warriors vs Lakers · FanDuel"],
  ["Djokovic vs Alcaraz · Smarkets", "US Election Contract · Polymarket"],
] as const;

// ─── Engine function ──────────────────────────────────────────────────────────

export function generateNarrative(): AIMarketNarrative {
  const idx = Math.abs(Math.floor(((wave(0) + 1) / 2) * NARRATIVES.length)) % NARRATIVES.length;
  const confidence = Math.round(Math.max(55, Math.min(95, 72 + wave(1.4) * 16)));

  return {
    id: `narr-${Date.now()}`,
    timestamp: ts(),
    narrative: NARRATIVES[idx] as string,
    confidence,
    regimeTag: REGIME_TAGS[idx] as string,
    severity: SEVERITIES[idx] as AISeverity,
    affectedMarkets: [...(AFFECTED_MARKETS[idx] as readonly string[])],
  };
}
