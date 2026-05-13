import type {
  IProvider,
  MarketSignal,
  NewsItem,
  OddsSnapshot,
  MarketPulseItem,
  ProviderStatus,
  SportType,
  Direction,
} from "./types";

// ─── Variation helpers ────────────────────────────────────────────────────────
// Uses time-based seeds to vary values slightly per request — simulates live feed.

function wave(phase: number, amplitude: number): number {
  return Math.sin(Date.now() / 15000 + phase) * amplitude;
}

function nudge(base: number, phase: number, variance: number): number {
  return Math.round((base + wave(phase, variance)) * 10) / 10;
}

function nudgeInt(base: number, phase: number, variance: number): number {
  return Math.round(base + wave(phase, variance));
}

function pct(base: number, phase: number, variance: number): string {
  const v = nudge(base, phase, variance);
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
}

function spark(base: number[], phase: number): number[] {
  return base.map((v, i) => nudge(v, phase + i * 0.3, 2));
}

function ts(offsetMinutes: number): string {
  const d = new Date(Date.now() - offsetMinutes * 60_000);
  return `${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")}:${d.getUTCSeconds().toString().padStart(2, "0")}`;
}

// ─── Signal templates ─────────────────────────────────────────────────────────

const BASE_SIGNALS: Omit<MarketSignal, "sparkData" | "timestamp" | "confidence" | "aiScore">[] = [
  {
    id: "sig-001",
    sport: "Horse Racing",
    title: "Sharp Money Detected — Ascot 2.40",
    description:
      "Significant unmatched liability appearing on the lay side of the 2.40 at Ascot. Queue structure deteriorating. Pattern consistent with informed positioning ahead of a move.",
    tag: "Premium",
    type: "Sharp Money",
    movement: "+34.2%",
    direction: "up",
    exchange: "Betfair",
    insight: "Liquidity absorption rate 2.4× above baseline. Informed positioning signature.",
  },
  {
    id: "sig-002",
    sport: "Tennis",
    title: "Liquidity Imbalance — Djokovic vs Alcaraz",
    description:
      "Exchange volume diverging from in-play price movement. Matched volume 34% above 20-day average with price compression suggesting imminent volatility expansion.",
    tag: "Free",
    type: "Liquidity Imbalance",
    movement: "+18.4%",
    direction: "up",
    exchange: "Smarkets",
    insight: "Three consecutive compression cycles. Breakout probability elevated.",
  },
  {
    id: "sig-003",
    sport: "NBA",
    title: "AI Market Thesis — Warriors vs Lakers",
    description:
      "Model detects spread value on the under side based on pace-of-play regression and defensive scheme data. Sharp-side consensus aligning with AI projection.",
    tag: "Premium",
    type: "AI Market Thesis",
    movement: "−6.1%",
    direction: "down",
    exchange: "FanDuel",
    insight: "Pace-adjusted DRTG divergence +6.8pts. Under-side structural edge confirmed.",
  },
  {
    id: "sig-004",
    sport: "NFL",
    title: "Volatility Compression — Chiefs vs Bills",
    description:
      "Implied volatility contracting sharply across the totals market. Three consecutive hours of compression without a triggering event — historically precedes a significant move.",
    tag: "Free",
    type: "Volatility Watch",
    movement: "+4.7%",
    direction: "up",
    exchange: "DraftKings",
    insight: "IV compression -18.4% from session open. Pre-break pattern identified.",
  },
  {
    id: "sig-005",
    sport: "Horse Racing",
    title: "Queue Health Warning — Cheltenham 3.15",
    description:
      "Betfair queue depth falling below threshold. Liquidity thinning on both sides simultaneously. Not consistent with normal pre-race withdrawal. Monitor for stewards decision.",
    tag: "API",
    type: "Queue Health",
    movement: "−12.1%",
    direction: "down",
    exchange: "Betfair",
    insight: "Queue depth -67% vs 5-race rolling average. Structural anomaly detected.",
  },
  {
    id: "sig-006",
    sport: "Prediction Markets",
    title: "Creator Signal — US Election Market",
    description:
      "AI-generated share card ready. Volume surge detected in the US presidential market. Contract pricing diverging from polling consensus by 6.8 points.",
    tag: "Creator",
    type: "Creator Signal",
    movement: "+89.2%",
    direction: "up",
    exchange: "Polymarket",
    insight: "Polling delta -6.8pts. Informed capital entry pattern confirmed.",
  },
  {
    id: "sig-007",
    sport: "UFC",
    title: "Market News Catalyst — Poirier vs Gaethje",
    description:
      "Weight-cut rumour entering the market. Underdog price shortening without matching public volume. Consistent with informed money responding to non-public information.",
    tag: "Free",
    type: "News Catalyst",
    movement: "+22.8%",
    direction: "up",
    exchange: "Betfair",
    insight: "Public handle -12% from expectation. Late sharp signature confirmed.",
  },
  {
    id: "sig-008",
    sport: "Football",
    title: "Exchange Flow Shift — Premier League Markets",
    description:
      "Cross-market liquidity rotating from Asian handicap into match result markets. Flow pattern matches institutional rebalancing rather than retail activity.",
    tag: "Premium",
    type: "Exchange Flow",
    movement: "+8.3%",
    direction: "up",
    exchange: "Pinnacle",
    insight: "AHC-to-MR flow ratio +34%. Smart money repositioning confirmed.",
  },
];

const BASE_SPARKS: Record<string, number[]> = {
  "sig-001": [28, 31, 35, 32, 39, 37, 43, 41, 48, 46, 52, 58],
  "sig-002": [40, 42, 38, 45, 41, 50, 47, 55, 52, 60, 57, 66],
  "sig-003": [60, 58, 62, 55, 59, 52, 56, 49, 53, 47, 50, 44],
  "sig-004": [50, 52, 48, 54, 50, 56, 52, 58, 54, 60, 56, 62],
  "sig-005": [70, 68, 72, 65, 69, 62, 66, 59, 63, 56, 60, 54],
  "sig-006": [15, 18, 22, 19, 26, 23, 30, 27, 35, 32, 40, 46],
  "sig-007": [20, 22, 25, 24, 28, 27, 32, 31, 36, 35, 40, 45],
  "sig-008": [30, 33, 31, 36, 34, 38, 36, 41, 39, 44, 42, 48],
};

const BASE_CONFIDENCE = [87, 74, 81, 69, 92, 78, 65, 72];

// ─── News templates ───────────────────────────────────────────────────────────

const BASE_NEWS: Omit<NewsItem, "id" | "timestamp">[] = [
  {
    sport: "Horse Racing",
    headline: "Going change reported at Ascot — Heavy (Soft in places)",
    source: "Racing Post",
    sourceType: "wire",
    severity: "high",
    linkedMarket: "Ascot 2.40 · Betfair",
    catalystType: "Going Change",
    impact: "Significantly disadvantages runners with Soft Ground preference — market repricing expected.",
  },
  {
    sport: "Tennis",
    headline: "Alcaraz retires from practice session — physio called",
    source: "ATP Tour",
    sourceType: "official",
    severity: "critical",
    linkedMarket: "Djokovic vs Alcaraz · Smarkets",
    catalystType: "Injury Concern",
    impact: "Price lengthening anticipated. Betfair suspension likely if confirmed.",
  },
  {
    sport: "NBA",
    headline: "Steph Curry listed as questionable — knee management",
    source: "ESPN",
    sourceType: "wire",
    severity: "high",
    linkedMarket: "Warriors vs Lakers · FanDuel",
    catalystType: "Injury Report",
    impact: "Spread and totals both moving. Sharp-side targeting the under.",
  },
  {
    sport: "NFL",
    headline: "Storm front approaching Kansas City — 25mph gusts forecast",
    source: "Weather Model",
    sourceType: "model",
    severity: "medium",
    linkedMarket: "Chiefs vs Bills Total · DraftKings",
    catalystType: "Weather Impact",
    impact: "Totals markets typically compress 2-4pts in high-wind conditions.",
  },
  {
    sport: "UFC",
    headline: "Poirier weight-cut update — 1.2lbs over at 8hr check",
    source: "MMA Fighting",
    sourceType: "social",
    severity: "high",
    linkedMarket: "Poirier vs Gaethje · Betfair",
    catalystType: "Weight-Cut",
    impact: "Underdog shortening. Market pricing in reduced performance risk for Gaethje.",
  },
  {
    sport: "Football",
    headline: "Haaland confirmed in Man City starting lineup — pre-match",
    source: "Sky Sports",
    sourceType: "official",
    severity: "medium",
    linkedMarket: "Premier League Markets · Pinnacle",
    catalystType: "Lineup Confirmation",
    impact: "Match result markets reacting. Asian handicap flow rotating to city side.",
  },
  {
    sport: "Prediction Markets",
    headline: "New national poll released — 3pt swing vs prior week",
    source: "Polymarket Intelligence",
    sourceType: "model",
    severity: "high",
    linkedMarket: "US Election Contract · Polymarket",
    catalystType: "Polling Data",
    impact: "Contract pricing diverging from polling consensus by 6.8 points. Volume surge imminent.",
  },
];

// ─── Odds templates ───────────────────────────────────────────────────────────

type OddsBase = Omit<OddsSnapshot, "id" | "timestamp" | "currentPrice" | "impliedProbability" | "probChange" | "movementPct" | "volatility">;

const BASE_ODDS: OddsBase[] = [
  { sport: "Horse Racing", market: "Ascot 2.40", selection: "Desert Crown", openingPrice: 3.4, direction: "up", source: "Betfair" },
  { sport: "Tennis", market: "Djokovic vs Alcaraz · Match", selection: "Alcaraz", openingPrice: 1.72, direction: "down", source: "Smarkets" },
  { sport: "NBA", market: "Warriors vs Lakers · Spread", selection: "Under 224.5", openingPrice: 1.91, direction: "up", source: "FanDuel" },
  { sport: "NFL", market: "Chiefs vs Bills · Total", selection: "Under 47.5", openingPrice: 1.87, direction: "up", source: "DraftKings" },
  { sport: "UFC", market: "Poirier vs Gaethje · ML", selection: "Gaethje", openingPrice: 2.10, direction: "down", source: "Betfair" },
  { sport: "Football", market: "Man City vs Arsenal · AHC", selection: "Man City −1", openingPrice: 1.95, direction: "up", source: "Pinnacle" },
  { sport: "Prediction Markets", market: "US Presidential · Contract", selection: "Candidate A", openingPrice: 1.62, direction: "up", source: "Polymarket" },
];

// ─── Pulse templates ──────────────────────────────────────────────────────────

const BASE_PULSE = [
  { title: "Hottest Market", sport: "Horse Racing" as SportType, baseValue: "Ascot 14:30", accentColor: "text-amber-400", accentBg: "bg-amber-400/10", accentBorder: "border-amber-400/20", baseChange: 34.2, dir: "up" as Direction, spark: [28, 31, 35, 32, 39, 37, 43, 41, 48, 46, 52, 58] },
  { title: "Largest Volatility Spike", sport: "Tennis" as SportType, baseValue: "IV +2.8σ", accentColor: "text-emerald-400", accentBg: "bg-emerald-400/10", accentBorder: "border-emerald-400/20", baseChange: 18.4, dir: "up" as Direction, spark: [40, 42, 38, 45, 41, 50, 47, 55, 52, 60, 57, 66] },
  { title: "Sharpest Movement", sport: "NBA" as SportType, baseValue: "−4.2pts", accentColor: "text-blue-400", accentBg: "bg-blue-400/10", accentBorder: "border-blue-400/20", baseChange: -6.1, dir: "down" as Direction, spark: [60, 58, 62, 55, 59, 52, 56, 49, 53, 47, 50, 44] },
  { title: "Most Active Sport", sport: "Football" as SportType, baseValue: "64 markets", accentColor: "text-zinc-300", accentBg: "bg-zinc-300/10", accentBorder: "border-zinc-300/20", baseChange: 12, dir: "up" as Direction, spark: [30, 33, 36, 34, 38, 37, 41, 39, 44, 42, 47, 50] },
  { title: "Largest Liquidity Shift", sport: "Prediction Markets" as SportType, baseValue: "$2.4M moved", accentColor: "text-purple-400", accentBg: "bg-purple-400/10", accentBorder: "border-purple-400/20", baseChange: 89.2, dir: "up" as Direction, spark: [15, 18, 22, 19, 26, 23, 30, 27, 35, 32, 40, 46] },
  { title: "Fastest Rising Market", sport: "UFC" as SportType, baseValue: "Poirier ML", accentColor: "text-orange-400", accentBg: "bg-orange-400/10", accentBorder: "border-orange-400/20", baseChange: 22.8, dir: "up" as Direction, spark: [20, 22, 25, 24, 28, 27, 32, 31, 36, 35, 40, 45] },
];

// ─── Provider statuses ────────────────────────────────────────────────────────

export const PROVIDER_STATUSES: ProviderStatus[] = [
  { id: "ps-001", name: "Mock Intelligence Engine", status: "online", latencyMs: 12, lastUpdate: ts(0), description: "Primary signal simulation engine — generating mock market intelligence.", category: "intelligence" },
  { id: "ps-002", name: "Sports News Feed", status: "simulated", latencyMs: 45, lastUpdate: ts(1), description: "Simulated wire feed — real integration with AP Sports / Reuters Sport planned.", category: "news" },
  { id: "ps-003", name: "Odds Feed", status: "simulated", latencyMs: 38, lastUpdate: ts(0), description: "Simulated odds movements — real-time odds adapter planned.", category: "odds" },
  { id: "ps-004", name: "Exchange Flow Monitor", status: "simulated", latencyMs: 22, lastUpdate: ts(2), description: "Simulated cross-exchange liquidity flow — Betfair/Pinnacle streaming planned.", category: "exchange" },
  { id: "ps-005", name: "AI Summary Engine", status: "online", latencyMs: 8, lastUpdate: ts(0), description: "AI commentary generation engine — running on mock signal corpus.", category: "ai" },
  { id: "ps-006", name: "Betfair Adapter", status: "planned", description: "Exchange Streaming API adapter — authentication and order-read flow pending.", category: "exchange" },
  { id: "ps-007", name: "ProphetX Adapter", status: "planned", description: "ProphetX market data adapter — pending commercial API agreement.", category: "exchange" },
  { id: "ps-008", name: "Polymarket Feed", status: "planned", description: "Prediction market contract feed — CLOB data adapter in design.", category: "exchange" },
];

// ─── Mock Provider ────────────────────────────────────────────────────────────

export class MockProvider implements IProvider {
  name = "MockProvider";
  mode = "simulation" as const;

  async getSignals(): Promise<MarketSignal[]> {
    return BASE_SIGNALS.map((s, i) => ({
      ...s,
      confidence: nudgeInt(BASE_CONFIDENCE[i], i * 0.7, 3),
      aiScore: nudgeInt(BASE_CONFIDENCE[i], i * 0.9, 4),
      sparkData: spark(BASE_SPARKS[s.id] ?? [40, 45, 42, 48], i),
      timestamp: ts(i * 2 + Math.round(wave(i, 0.5))),
    }));
  }

  async getNews(): Promise<NewsItem[]> {
    return BASE_NEWS.map((n, i) => ({
      ...n,
      id: `news-${String(i + 1).padStart(3, "0")}`,
      timestamp: ts(i * 3 + 1),
    }));
  }

  async getOddsSnapshots(): Promise<OddsSnapshot[]> {
    return BASE_ODDS.map((o, i) => {
      const movement = nudge(o.direction === "up" ? 4.2 : -4.2, i, 1.8);
      const current = nudge(o.openingPrice * (1 + movement / 100), i * 1.1, 0.04);
      const implied = Math.round((1 / current) * 1000) / 10;
      const impliedOpen = Math.round((1 / o.openingPrice) * 1000) / 10;
      return {
        ...o,
        id: `odds-${String(i + 1).padStart(3, "0")}`,
        currentPrice: current,
        impliedProbability: implied,
        probChange: Math.round((implied - impliedOpen) * 10) / 10,
        movementPct: movement,
        volatility: nudge(12 + i * 3, i * 0.6, 4),
        timestamp: ts(i),
      };
    });
  }

  async getMarketPulse(): Promise<MarketPulseItem[]> {
    return BASE_PULSE.map((p, i) => {
      const change = nudge(p.baseChange, i * 0.8, 1.5);
      const sign = change >= 0 ? "+" : "";
      const unit = p.title === "Most Active Sport" ? " since open" : p.baseChange > 50 ? "% flow" : "% vol";
      return {
        title: p.title,
        sport: p.sport,
        value: p.baseValue,
        change: `${sign}${change.toFixed(1)}${unit}`,
        direction: p.dir,
        sparkData: spark(p.spark, i),
        timestamp: ts(i * 3),
        accentColor: p.accentColor,
        accentBg: p.accentBg,
        accentBorder: p.accentBorder,
      };
    });
  }

  async getProviderStatuses(): Promise<ProviderStatus[]> {
    return PROVIDER_STATUSES.map((p) => ({
      ...p,
      lastUpdate: p.status !== "planned" ? ts(0) : undefined,
    }));
  }
}
