import type { AIVolatilityInsight, VolatilityRegime } from "./types";

// ─── Variation helpers ────────────────────────────────────────────────────────

function wave(phase: number): number {
  return Math.sin(Date.now() / 22000 + phase);
}

function pick<T>(arr: readonly T[], phase: number): T {
  const idx = Math.abs(Math.floor(((wave(phase) + 1) / 2) * arr.length)) % arr.length;
  return arr[idx] as T;
}

function ts(): string {
  return new Date().toISOString();
}

// ─── Template data ────────────────────────────────────────────────────────────

const REGIMES: VolatilityRegime[] = [
  "compression", "expansion", "stable", "compression",
  "anomaly", "acceleration", "exhaustion", "compression",
];

const SUMMARIES: Record<VolatilityRegime, string> = {
  compression:
    "Implied volatility contracting across multiple markets. Historical pattern suggests imminent expansion event. Compression entering fourth consecutive cycle — pre-breakout configuration forming.",
  expansion:
    "Volatility expanding at accelerated rate. Cross-market correlation breakdown detected. Multiple simultaneous signals contributing to elevated implied volatility across monitored sectors.",
  anomaly:
    "Anomalous volatility signature detected. Divergence from 30-day statistical baseline exceeds 3.2σ. Non-standard price discovery in progress — structural analysis confidence elevated.",
  acceleration:
    "Volatility acceleration phase active. Rate of IV expansion exceeding pre-crisis baseline by 2.1×. Structural triggers identified across three market sectors simultaneously.",
  exhaustion:
    "Volatility exhaustion pattern emerging. Extended expansion phase showing deceleration signals consistent with mean reversion. Structural pressure easing after sustained directional move.",
  stable:
    "Volatility within normal distribution bounds. No structural triggers detected. System monitoring for pre-expansion compression patterns across all active market sectors.",
};

const AFFECTED_SPORTS_POOL: string[][] = [
  ["Horse Racing", "Tennis", "NBA"],
  ["NFL", "Football", "UFC"],
  ["Prediction Markets", "NBA", "Horse Racing"],
  ["Tennis", "Football"],
  ["UFC", "Horse Racing", "NFL"],
  ["NBA", "NFL", "Football"],
];

// ─── Engine function ──────────────────────────────────────────────────────────

export function generateVolatilityInsight(): AIVolatilityInsight {
  const t = Date.now();
  const regimeIdx = Math.abs(Math.floor(((wave(0) + 1) / 2) * REGIMES.length)) % REGIMES.length;
  const regime = REGIMES[regimeIdx] as VolatilityRegime;
  const projBase = Math.abs(wave(1.5)) * 8.4;
  const anomBase = 24 + wave(2.1) * 18;

  return {
    id: `vol-${t}`,
    timestamp: ts(),
    regime,
    projectedMovement: Math.round(projBase * 10) / 10,
    anomalyScore: Math.round(Math.max(5, Math.min(98, anomBase + 30))),
    confidence: Math.round(Math.max(55, Math.min(94, 72 + wave(0.8) * 16))),
    summary: SUMMARIES[regime],
    affectedSports: pick(AFFECTED_SPORTS_POOL, 1.3),
  };
}
