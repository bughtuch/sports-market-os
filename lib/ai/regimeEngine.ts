import type { AIRegimeState, MarketRegime } from "./types";

// ─── Variation helpers ────────────────────────────────────────────────────────

function wave(phase: number): number {
  return Math.sin(Date.now() / 32000 + phase);
}

function ts(): string {
  return new Date().toISOString();
}

// ─── Template data ────────────────────────────────────────────────────────────

const REGIMES: MarketRegime[] = [
  "volatile", "compression", "stable", "rotational",
  "expansion", "compression", "illiquid", "volatile",
];

const REGIME_COMMENTARIES: Record<MarketRegime, string> = {
  stable:
    "Global market structure operating within normal parameters. Volatility and liquidity metrics within historical bounds. No systemic stress signals detected across monitored exchanges.",
  volatile:
    "Elevated volatility regime active across monitored sectors. Multiple simultaneous catalyst events driving above-normal price movement and order flow. AI monitoring heightened.",
  expansion:
    "Market expansion phase — increasing participation and volume across primary contracts. Structural indicators suggest continuation with no significant exhaustion signals present.",
  compression:
    "Global compression regime. Markets tightening across multiple asset classes and exchange platforms. Historical precedent suggests significant directional event approaching.",
  panic:
    "Panic regime detected across monitored markets. Crowd positions unwinding rapidly with structural dislocations forming. Extreme-condition indicators active across exchange network.",
  rotational:
    "Cross-sector rotation in progress. Capital moving between market categories rather than expanding or contracting overall. Tactical institutional repositioning detected.",
  illiquid:
    "Liquidity deterioration across exchange network. Thin order books creating elevated price impact risk. Structural withdrawal pattern consistent with informed pre-catalyst activity.",
};

const TRIGGER_POOLS: Record<MarketRegime, string[]> = {
  stable: ["Normal price discovery", "Balanced order flow", "No structural anomalies"],
  volatile: ["Multiple catalyst events", "Cross-market correlation spike", "Above-baseline volume"],
  expansion: ["Volume acceleration", "Increasing market participation", "Structural breakout pattern"],
  compression: ["IV contraction", "Liquidity withdrawal", "Pre-catalyst informed positioning"],
  panic: ["Rapid position unwinding", "Structural dislocation", "Elevated volatility premium"],
  rotational: ["Cross-sector capital flows", "Institutional rebalancing", "Tactical repositioning"],
  illiquid: ["Exchange withdrawal", "Queue depth deterioration", "Informed pre-event withdrawal"],
};

// ─── Engine function ──────────────────────────────────────────────────────────

export function generateRegimeState(): AIRegimeState {
  const t = Date.now();
  const regimeIdx = Math.abs(Math.floor(((wave(0) + 1) / 2) * REGIMES.length)) % REGIMES.length;
  const regime = REGIMES[regimeIdx] as MarketRegime;

  return {
    id: `reg-${t}`,
    timestamp: ts(),
    regime,
    confidence: Math.round(Math.max(52, Math.min(94, 72 + wave(1.4) * 18))),
    commentary: REGIME_COMMENTARIES[regime],
    triggerFactors: TRIGGER_POOLS[regime] ?? [],
  };
}
