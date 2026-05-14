import type { BriefSection, BriefType } from "./briefTypes";

// ─── Signal titles by sport ───────────────────────────────────────────────────

const SIGNAL_POOL = [
  "Sharp Money Detected — Ascot 2.40",
  "Liquidity Imbalance — Djokovic vs Alcaraz",
  "AI Market Thesis — Warriors vs Lakers",
  "Volatility Compression — Chiefs vs Bills",
  "Queue Health Warning — Cheltenham 3.15",
  "Exchange Flow Shift — Premier League Markets",
  "Market News Catalyst — Poirier vs Gaethje",
  "Regime Change Detected — NBA Totals",
  "Institutional Rotation — Betfair Horse Racing",
  "Probability Drift — US Election Markets",
];

const CATALYST_POOL = [
  "Weight-cut rumour — UFC main event",
  "Weather impact alert — Ascot race card affected",
  "Lineup leak — Premier League fixture disruption",
  "Regulatory update — Exchange margin requirements changed",
  "Injury report — NBA star listed as doubtful",
  "Volume spike — Polymarket US market surge +89%",
  "Stewards inquiry — Cheltenham 3.15 under review",
  "Line move — Sportsbook consensus shifting on Bills spread",
];

// ─── Section builders ─────────────────────────────────────────────────────────

export function buildTopSignalsSection(signals: string[]): BriefSection {
  return {
    type:    "top-signals",
    heading: "Top Signals",
    body:    `${signals.length} high-confidence signals detected across monitored markets.`,
    bullets: signals,
    severity: "info",
  };
}

export function buildCatalystsSection(catalysts: string[]): BriefSection {
  return {
    type:    "catalysts",
    heading: "Active Catalysts",
    body:    "Market-moving events detected in the intelligence feed.",
    bullets: catalysts,
    severity: "warning",
  };
}

export function buildVolatilitySection(note: string, severity: BriefSection["severity"] = "info"): BriefSection {
  return {
    type:     "volatility",
    heading:  "Volatility Analysis",
    body:     note,
    severity,
  };
}

export function buildExchangeFlowSection(note: string): BriefSection {
  return {
    type:    "exchange-flow",
    heading: "Exchange Flow",
    body:    note,
    severity: "info",
  };
}

export function buildAIRegimeSection(summary: string): BriefSection {
  return {
    type:    "ai-regime",
    heading: "AI Regime Assessment",
    body:    summary,
    severity: "info",
  };
}

export function buildWatchlistSection(movement: string): BriefSection {
  return {
    type:    "watchlist-movement",
    heading: "Watchlist Movement",
    body:    movement,
    severity: "info",
  };
}

export function buildSummarySection(type: BriefType): BriefSection {
  const summaries: Record<BriefType, string> = {
    "morning":
      "Markets opening with elevated volatility across Horse Racing and Tennis. " +
      "AI regime assessment: cautiously bullish on exchange flow. Monitor queue health in Betfair pre-race markets.",
    "midday":
      "Midday regime shift detected. Liquidity rotating from Asian handicap into match result markets. " +
      "NFL totals showing compression — precursor pattern to significant line move.",
    "overnight":
      "Overnight exchange activity lower than 30-day average. Three AI signals queued for morning broadcast. " +
      "ProphetX prediction markets showing drift vs polling consensus.",
    "volatility-alert":
      "Implied volatility spike detected across two or more markets simultaneously. " +
      "Pattern consistent with informed positioning or catalyst injection. Heightened monitoring active.",
    "exchange-shift":
      "Cross-exchange liquidity rotation event in progress. Institutional rebalancing signature detected. " +
      "Retail flow diverging from sharp-side consensus — monitor for follow-through.",
  };
  return {
    type:     "summary",
    heading:  "Brief Summary",
    body:     summaries[type],
    severity: "info",
  };
}

// ─── Pool sampling ────────────────────────────────────────────────────────────

export function sampleSignals(count: number): string[] {
  return SIGNAL_POOL.slice(0, count);
}

export function sampleCatalysts(count: number): string[] {
  return CATALYST_POOL.slice(0, count);
}
