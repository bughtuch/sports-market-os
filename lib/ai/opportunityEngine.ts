import type { AIOpportunity, AISeverity, OpportunityCategory } from "./types";

// ─── Variation helpers ────────────────────────────────────────────────────────

function wave(phase: number): number {
  return Math.sin(Date.now() / 28000 + phase);
}

function ts(): string {
  return new Date().toISOString();
}

// ─── IMPORTANT: All outputs framed as market intelligence, not betting advice ─

const OPPORTUNITY_POOL: Array<{
  title: string;
  explanation: string;
  category: OpportunityCategory;
  severity: AISeverity;
  markets: string[];
}> = [
  {
    title: "High Divergence Event",
    explanation:
      "Price divergence exceeding 2.8σ from cross-market baseline. Structural misalignment between exchange-traded prices and implied probability creating statistical analysis window. Market intelligence observation only.",
    category: "divergence",
    severity: "high",
    markets: ["Ascot 2.40 · Betfair", "Cheltenham 3.15 · Betfair"],
  },
  {
    title: "Liquidity Anomaly Detected",
    explanation:
      "Order book depth falling below 15th percentile of 30-day distribution. Structural thinning consistent with informed withdrawal ahead of catalyst. Market intelligence observation only — no action implied.",
    category: "liquidity",
    severity: "high",
    markets: ["Djokovic vs Alcaraz · Smarkets"],
  },
  {
    title: "Cross-Market Imbalance",
    explanation:
      "Liquidity rotating between Asian handicap and match result markets. Flow pattern diverging from institutional baseline by 34%. Cross-market structural intelligence signal — analytics only.",
    category: "cross_market",
    severity: "medium",
    markets: ["Man City vs Arsenal · Pinnacle", "Premier League AHC"],
  },
  {
    title: "Volatility Expansion Setup",
    explanation:
      "Multiple compression cycles preceding expected expansion event. Three independent volatility indicators converging. Pattern analysis observation — not a directional recommendation.",
    category: "volatility",
    severity: "medium",
    markets: ["Chiefs vs Bills · DraftKings", "Warriors vs Lakers · FanDuel"],
  },
  {
    title: "Structural Flow Shift",
    explanation:
      "Institutional-pattern flow detected entering multiple markets simultaneously. Volume-weighted price impact analysis suggests informed positioning — structural market intelligence observation.",
    category: "structural",
    severity: "medium",
    markets: ["Warriors vs Lakers · FanDuel", "NFL Total Markets"],
  },
  {
    title: "Sharp-Side Consensus Signal",
    explanation:
      "Sharp-side volume concentrating against prevailing public flow direction. Crowd/sharp divergence at 12-session high. Market intelligence signal — no directional advice implied or intended.",
    category: "divergence",
    severity: "high",
    markets: ["Poirier vs Gaethje · Betfair"],
  },
  {
    title: "Prediction Market Divergence",
    explanation:
      "Contract pricing diverging from polling consensus by 6.8 percentage points. Market pricing in information asymmetry. Structural analytics observation — intelligence only.",
    category: "cross_market",
    severity: "medium",
    markets: ["US Election Contract · Polymarket"],
  },
  {
    title: "Queue Health Warning",
    explanation:
      "Exchange queue depth deteriorating across multiple concurrent markets. Not consistent with normal pre-event withdrawal patterns. Liquidity monitoring intelligence alert — analytics only.",
    category: "liquidity",
    severity: "high",
    markets: ["Ascot 2.40 · Betfair", "Horse Racing Sector"],
  },
];

// ─── Engine function ──────────────────────────────────────────────────────────

export function generateOpportunities(): AIOpportunity[] {
  const t = Date.now();
  const startIdx = Math.abs(Math.floor(((wave(0) + 1) / 2) * OPPORTUNITY_POOL.length)) % OPPORTUNITY_POOL.length;
  const count = wave(1.5) > 0 ? 4 : 3;

  return Array.from({ length: count }, (_, i) => {
    const opp = OPPORTUNITY_POOL[(startIdx + i) % OPPORTUNITY_POOL.length]!;
    return {
      id: `opp-${t}-${i}`,
      timestamp: ts(),
      title: opp.title,
      explanation: opp.explanation,
      confidence: Math.round(Math.max(55, Math.min(92, 68 + Math.sin(Date.now() / 20000 + i * 0.8 + 0.3) * 16))),
      severity: opp.severity,
      affectedMarkets: opp.markets,
      category: opp.category,
    };
  });
}
