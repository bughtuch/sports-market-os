/**
 * MockExchangeAdapter — realistic simulated exchange microstructure data.
 *
 * Provides read-only intelligence for all supported sports.
 * Uses time-based variation to simulate live feed behaviour.
 *
 * Compliance:
 *   Read-only market intelligence. No execution, no custody of funds.
 */

import type { ExchangeAdapter, ExchangeMarket, ExchangeOrderBook, ExchangeLiquiditySnapshot, ExchangeFlowSnapshot, ExchangeProviderStatus } from "./types";
import {
  calculateSpread,
  calculateMidpoint,
  calculateQueueHealth,
  calculateSpreadQuality,
  calculateLiquidityDepthScore,
  calculateFlowImbalance,
  calculateFlowPressure,
  calculateVolatilityEstimate,
  ts,
} from "./exchangeNormalizer";
import type { SportType } from "../providers/types";

// ─── Variation helpers ────────────────────────────────────────────────────────

function wave(phase: number, amplitude: number): number {
  return Math.sin(Date.now() / 18000 + phase) * amplitude;
}

function nudge(base: number, phase: number, variance: number): number {
  return Math.round((base + wave(phase, variance)) * 1000) / 1000;
}

function nudgeInt(base: number, phase: number, variance: number): number {
  return Math.round(base + wave(phase, variance));
}

// ─── Base market definitions ──────────────────────────────────────────────────

interface BaseMockMarket {
  marketId: string;
  marketName: string;
  sport: SportType;
  exchange: "betfair" | "prophetx" | "kalshi" | "mock";
  baseBack: number;
  baseLay: number;
  baseVolume: number;
  baseLiquidity: number;
  baseQueueHealth: number;
  currency: "GBP" | "USD";
  phase: number;
}

const BASE_MARKETS: BaseMockMarket[] = [
  {
    marketId: "BF-HR-001",
    marketName: "Ascot 14:30 — Coral Eclipse",
    sport: "Horse Racing",
    exchange: "betfair",
    baseBack: 2.10, baseLay: 2.12,
    baseVolume: 142800,  baseLiquidity: 72, baseQueueHealth: 85,
    currency: "GBP", phase: 0.1,
  },
  {
    marketId: "BF-HR-002",
    marketName: "Cheltenham 3:15 — Champion Hurdle",
    sport: "Horse Racing",
    exchange: "betfair",
    baseBack: 3.40, baseLay: 3.45,
    baseVolume: 89200, baseLiquidity: 58, baseQueueHealth: 74,
    currency: "GBP", phase: 0.7,
  },
  {
    marketId: "BF-TN-001",
    marketName: "Djokovic vs Alcaraz — Wimbledon QF",
    sport: "Tennis",
    exchange: "betfair",
    baseBack: 1.85, baseLay: 1.87,
    baseVolume: 256400, baseLiquidity: 84, baseQueueHealth: 91,
    currency: "GBP", phase: 1.3,
  },
  {
    marketId: "BF-FB-001",
    marketName: "Arsenal vs Chelsea — Premier League",
    sport: "Football",
    exchange: "betfair",
    baseBack: 2.05, baseLay: 2.08,
    baseVolume: 892100, baseLiquidity: 95, baseQueueHealth: 96,
    currency: "GBP", phase: 1.9,
  },
  {
    marketId: "PX-NBA-001",
    marketName: "Lakers vs Warriors — NBA Playoffs",
    sport: "NBA",
    exchange: "prophetx",
    baseBack: 1.95, baseLay: 1.98,
    baseVolume: 234500, baseLiquidity: 78, baseQueueHealth: 82,
    currency: "USD", phase: 2.5,
  },
  {
    marketId: "PX-NFL-001",
    marketName: "Chiefs vs Eagles — NFL Season",
    sport: "NFL",
    exchange: "prophetx",
    baseBack: 1.72, baseLay: 1.75,
    baseVolume: 412300, baseLiquidity: 88, baseQueueHealth: 89,
    currency: "USD", phase: 3.1,
  },
  {
    marketId: "BF-UFC-001",
    marketName: "Poirier vs Holloway — UFC Main Event",
    sport: "UFC",
    exchange: "betfair",
    baseBack: 2.20, baseLay: 2.24,
    baseVolume: 67400, baseLiquidity: 62, baseQueueHealth: 71,
    currency: "GBP", phase: 3.7,
  },
  {
    marketId: "KL-PM-001",
    marketName: "2026 US Election — Republican",
    sport: "Prediction Markets",
    exchange: "kalshi",
    baseBack: 1.82, baseLay: 1.84,
    baseVolume: 1240000, baseLiquidity: 97, baseQueueHealth: 98,
    currency: "USD", phase: 4.3,
  },
];

// ─── Builder helpers ──────────────────────────────────────────────────────────

function buildMarket(b: BaseMockMarket): ExchangeMarket {
  const bestBack = nudge(b.baseBack, b.phase, 0.02);
  const bestLay  = nudge(b.baseLay,  b.phase + 0.5, 0.02);
  const spread    = calculateSpread(bestBack, bestLay);
  const midpoint  = calculateMidpoint(bestBack, bestLay);

  return {
    marketId:       b.marketId,
    marketName:     b.marketName,
    sport:          b.sport,
    exchange:       b.exchange,
    status:         "active",
    timestamp:      ts(0),
    bestBack,
    bestLay,
    spread,
    matchedVolume:  nudgeInt(b.baseVolume, b.phase + 1, b.baseVolume * 0.02),
    liquidityDepth: Math.min(nudgeInt(b.baseLiquidity, b.phase + 2, 3), 100),
    queueHealth:    Math.min(nudgeInt(b.baseQueueHealth, b.phase + 3, 2), 100),
    volatilityScore: Math.min(Math.round(calculateVolatilityEstimate(spread, midpoint)), 100),
    sourceMode:     "simulation",
    currency:       b.currency,
  };
}

function buildOrderBook(b: BaseMockMarket): ExchangeOrderBook {
  const bestBack = nudge(b.baseBack, b.phase, 0.02);
  const bestLay  = nudge(b.baseLay,  b.phase + 0.5, 0.02);

  // 3 lay levels + 3 back levels
  const baseLaySizes  = [890, 1240, 560];
  const baseBackSizes = [2100, 890, 420];

  const layLevels = baseLaySizes.map((s, i) => ({
    price: Math.round((bestLay + i * 0.02) * 1000) / 1000,
    size:  nudgeInt(s, b.phase + i, s * 0.08),
  }));
  const backLevels = baseBackSizes.map((s, i) => ({
    price: Math.round((bestBack - i * 0.02) * 1000) / 1000,
    size:  nudgeInt(s, b.phase + i + 1, s * 0.08),
  }));

  const totalLaySize  = layLevels.reduce((a, l) => a + l.size, 0);
  const totalBackSize = backLevels.reduce((a, l) => a + l.size, 0);
  const totalSize     = totalLaySize + totalBackSize;

  return {
    marketId:    b.marketId,
    marketName:  b.marketName,
    sport:       b.sport,
    exchange:    b.exchange,
    timestamp:   ts(0),
    bestBack,
    bestLay,
    spread:      calculateSpread(bestBack, bestLay),
    midpoint:    calculateMidpoint(bestBack, bestLay),
    levels: [
      ...layLevels.map((l) => ({
        price: l.price,
        size:  l.size,
        side:  "lay" as const,
        depthPct: Math.round((l.size / totalSize) * 100),
      })),
      ...backLevels.map((l) => ({
        price: l.price,
        size:  l.size,
        side:  "back" as const,
        depthPct: Math.round((l.size / totalSize) * 100),
      })),
    ],
    sourceMode: "simulation",
  };
}

function buildLiquidity(b: BaseMockMarket, idx: number): ExchangeLiquiditySnapshot {
  const bestBack = nudge(b.baseBack, b.phase, 0.02);
  const bestLay  = nudge(b.baseLay,  b.phase + 0.5, 0.02);
  const spread   = calculateSpread(bestBack, bestLay);
  const midpoint = calculateMidpoint(bestBack, bestLay);

  const laySize  = nudgeInt(2690, b.phase + 0.3, 150);
  const backSize = nudgeInt(3410, b.phase + 0.8, 180);
  const matchedVolume = nudgeInt(b.baseVolume, b.phase + 1, b.baseVolume * 0.02);

  const queueHealth    = calculateQueueHealth(laySize, backSize, matchedVolume);
  const depthImbalance = calculateFlowImbalance(laySize, backSize);

  return {
    id:           `liq-${b.marketId}-${idx}`,
    marketId:     b.marketId,
    marketName:   b.marketName,
    sport:        b.sport,
    exchange:     b.exchange,
    timestamp:    ts(0),
    matchedVolume,
    currency:     b.currency,
    liquidityDepth: calculateLiquidityDepthScore(laySize + backSize),
    queueHealth,
    spread,
    spreadQuality: calculateSpreadQuality(spread, midpoint),
    depthImbalance,
    flowPressure:  calculateFlowPressure(depthImbalance, queueHealth),
    latencyMs:    nudgeInt(12, b.phase, 4),
    status:       "active",
    sourceMode:   "simulation",
  };
}

// ─── Flow snapshots ───────────────────────────────────────────────────────────

const BASE_FLOWS = [
  { id: "flow-001", sport: "Horse Racing" as SportType, market: "Ascot 14:30", from: "betfair" as const, to: "smarkets" as const,   flowType: "sharp" as const,         volume: 28400, dir: "up"   as const, phase: 0.2 },
  { id: "flow-002", sport: "Tennis"       as SportType, market: "Djokovic vs Alcaraz", from: "betfair" as const, to: "betdaq" as const,    flowType: "institutional" as const, volume: 45200, dir: "down" as const, phase: 1.1 },
  { id: "flow-003", sport: "Football"     as SportType, market: "Arsenal vs Chelsea",  from: "pinnacle" as const, to: "betfair" as const,  flowType: "rotation" as const,     volume: 128400, dir: "up"  as const, phase: 1.8 },
  { id: "flow-004", sport: "NBA"          as SportType, market: "Lakers vs Warriors",  from: "prophetx" as const, to: "betfair" as const,  flowType: "sharp" as const,        volume: 67800,  dir: "up"  as const, phase: 2.4 },
  { id: "flow-005", sport: "NFL"          as SportType, market: "Chiefs vs Eagles",    from: "prophetx" as const, to: "pinnacle" as const, flowType: "retail" as const,       volume: 34200,  dir: "flat" as const, phase: 3.0 },
] as const;

// ─── Adapter implementation ───────────────────────────────────────────────────

export class MockExchangeAdapter implements ExchangeAdapter {
  readonly name        = "MockExchangeAdapter";
  readonly exchange    = "mock" as const;
  readonly sourceMode  = "simulation" as const;

  async getMarkets(): Promise<ExchangeMarket[]> {
    return BASE_MARKETS.map(buildMarket);
  }

  async getOrderBook(marketId: string): Promise<ExchangeOrderBook | null> {
    const base = BASE_MARKETS.find((m) => m.marketId === marketId);
    if (!base) return buildOrderBook(BASE_MARKETS[0]);
    return buildOrderBook(base);
  }

  async getLiquiditySnapshot(marketId: string): Promise<ExchangeLiquiditySnapshot | null> {
    const base = BASE_MARKETS.find((m) => m.marketId === marketId);
    if (!base) return null;
    return buildLiquidity(base, 0);
  }

  async getAllLiquiditySnapshots(): Promise<ExchangeLiquiditySnapshot[]> {
    return BASE_MARKETS.map((b, i) => buildLiquidity(b, i));
  }

  async getFlowSnapshots(): Promise<ExchangeFlowSnapshot[]> {
    return BASE_FLOWS.map((f) => ({
      id:           f.id,
      sport:        f.sport,
      market:       f.market,
      fromExchange: f.from,
      toExchange:   f.to,
      flowType:     f.flowType,
      volumeUSD:    nudgeInt(f.volume, f.phase, f.volume * 0.03),
      timestamp:    ts(nudgeInt(1, f.phase, 1)),
      direction:    f.dir,
      sourceMode:   "simulation",
    }));
  }

  async getProviderStatus(): Promise<ExchangeProviderStatus> {
    return {
      exchange:    "mock",
      name:        "Mock Exchange Adapter",
      status:      "online",
      sourceMode:  "simulation",
      latencyMs:   nudgeInt(12, 0, 3),
      description: "Simulated exchange microstructure data — realistic order book and liquidity intelligence.",
      readOnly:    true,
    };
  }
}
