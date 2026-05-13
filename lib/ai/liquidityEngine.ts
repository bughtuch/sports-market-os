import type { AILiquidityInsight } from "./types";

// ─── Variation helpers ────────────────────────────────────────────────────────

function wave(phase: number): number {
  return Math.sin(Date.now() / 20000 + phase);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function pick<T>(arr: readonly T[], phase: number): T {
  const idx = Math.abs(Math.floor(((wave(phase) + 1) / 2) * arr.length)) % arr.length;
  return arr[idx] as T;
}

function ts(): string {
  return new Date().toISOString();
}

// ─── Template data ────────────────────────────────────────────────────────────

const INTERPRETATIONS = [
  "Significant buy-side accumulation detected across primary exchange order books. Queue depth asymmetry indicates institutional positioning rather than retail activity. Structural imbalance forming.",
  "Liquidity thinning on both sides simultaneously — not consistent with normal pre-event withdrawal. Structural bid withdrawal pattern detected. Queue health below threshold.",
  "Late money signature entering with elevated velocity. Unmatched liability growing on lay side. Queue health deteriorating — pattern consistent with informed pre-event entry.",
  "Cross-exchange liquidity rotating from secondary to primary contracts. Flow divergence exceeds 2.8σ from 20-day baseline. Structural imbalance confirms directional positioning.",
  "Order book depth recovering after sharp withdrawal event. Re-entry pattern suggests institutional reloading rather than directional exhaustion. Buy-side re-accumulation in progress.",
  "Buy/sell imbalance widening beyond normal distribution. Matched volume confirming directional intent. Spoof risk elevated on ask side — structural analysis observation.",
  "Liquidity quality index declining. Thin order book creating elevated price impact risk. Exchange flow compression detected across three markets simultaneously.",
  "Queue health stabilising after deterioration event. Institutional flow signature present. Crowd-side positions unwinding against structural resistance.",
] as const;

// ─── Engine function ──────────────────────────────────────────────────────────

export function generateLiquidityInsight(): AILiquidityInsight {
  const t = Date.now();
  const buyBase = 52 + Math.sin(t / 12000) * 18;
  const queueBase = 68 + Math.sin(t / 15000 + 1.0) * 22;
  const spoofBase = 28 + Math.sin(t / 18000 + 2.0) * 20;
  const qualityBase = 64 + Math.sin(t / 22000 + 0.5) * 18;
  const pressure = wave(0.3);

  return {
    id: `liq-${t}`,
    timestamp: ts(),
    interpretation: pick(INTERPRETATIONS, 0.7),
    confidence: clamp(Math.round(68 + wave(1.2) * 14), 52, 94),
    structuralPressure: pressure > 0.3 ? "bullish" : pressure < -0.3 ? "bearish" : "neutral",
    spoofRisk: clamp(Math.round(spoofBase), 8, 78),
    liquidityQuality: clamp(Math.round(qualityBase), 34, 92),
    buyImbalance: clamp(Math.round(buyBase), 30, 72),
    sellImbalance: clamp(Math.round(100 - buyBase), 28, 70),
    queueHealth: clamp(Math.round(queueBase), 24, 96),
    lateMoney: wave(2.1) > 0.4,
    flowDivergence: wave(3.4) > 0.2,
  };
}
