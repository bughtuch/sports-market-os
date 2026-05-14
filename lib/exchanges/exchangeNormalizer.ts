/**
 * exchangeNormalizer — converts raw exchange payloads into internal types.
 *
 * Supports Betfair back/lay, ProphetX bid/ask, and generic order book formats.
 * All functions are pure / side-effect free.
 *
 * Compliance:
 *   All calculations are for market intelligence only.
 *   No bet placement, no order routing, no profit guarantee.
 */

import type { ExchangePriceLevel, ExchangeOrderBook, ExchangeName, ExchangeSourceMode } from "./types";
import type { SportType } from "../providers/types";

// ─── Price ────────────────────────────────────────────────────────────────────

export function calculateSpread(bestBack: number, bestLay: number): number {
  return Math.round((bestLay - bestBack) * 1000) / 1000;
}

export function calculateMidpoint(bestBack: number, bestLay: number): number {
  return Math.round(((bestBack + bestLay) / 2) * 1000) / 1000;
}

export function decimalToImpliedProbability(decimal: number): number {
  if (decimal <= 1) return 0;
  return Math.round((1 / decimal) * 10000) / 100;
}

// ─── Scores ───────────────────────────────────────────────────────────────────

/**
 * Queue health: 0–100.
 * High score = balanced depth + high matched volume.
 */
export function calculateQueueHealth(
  totalLaySize: number,
  totalBackSize: number,
  matchedVolume: number
): number {
  const balance =
    Math.min(totalLaySize, totalBackSize) /
    Math.max(totalLaySize, totalBackSize, 1);
  const volumeScore = Math.min(matchedVolume / 50000, 1);
  return Math.round((balance * 0.55 + volumeScore * 0.45) * 100);
}

/** Spread quality: 0–100 (100 = perfectly tight). */
export function calculateSpreadQuality(spread: number, midpoint: number): number {
  if (midpoint <= 0) return 0;
  const spreadPct = (spread / midpoint) * 100;
  return Math.max(0, Math.round(100 - spreadPct * 25));
}

/** Liquidity depth score from total order book size. */
export function calculateLiquidityDepthScore(totalSize: number): number {
  return Math.min(Math.round(totalSize / 400), 100);
}

/**
 * Depth imbalance: –100 (back-heavy) to +100 (lay-heavy).
 * Zero = perfectly balanced.
 */
export function calculateFlowImbalance(
  totalLaySize: number,
  totalBackSize: number
): number {
  const total = totalLaySize + totalBackSize;
  if (total === 0) return 0;
  return Math.round(((totalLaySize - totalBackSize) / total) * 100);
}

/** Volatility estimate from spread relative to midpoint. */
export function calculateVolatilityEstimate(spread: number, midpoint: number): number {
  if (midpoint <= 0) return 0;
  const spreadPct = (spread / midpoint) * 100;
  return Math.min(Math.round(spreadPct * 18), 100);
}

/** Flow pressure: 0–100 derived from imbalance magnitude and queue health. */
export function calculateFlowPressure(
  depthImbalance: number,
  queueHealth: number
): number {
  const absImbalance = Math.abs(depthImbalance);
  return Math.round((absImbalance * 0.6 + (100 - queueHealth) * 0.4));
}

// ─── Order book builder ───────────────────────────────────────────────────────

/**
 * Build ExchangeOrderBook from raw price levels (Betfair back/lay format).
 * `layLevels` are prices above best back; `backLevels` are prices at/below best back.
 */
export function buildOrderBook(
  marketId: string,
  marketName: string,
  sport: SportType,
  exchange: ExchangeName,
  timestamp: string,
  layLevels: Array<{ price: number; size: number }>,
  backLevels: Array<{ price: number; size: number }>,
  sourceMode: ExchangeSourceMode
): ExchangeOrderBook {
  const totalSize = [
    ...layLevels.map((l) => l.size),
    ...backLevels.map((l) => l.size),
  ].reduce((a, b) => a + b, 0);

  const levels: ExchangePriceLevel[] = [
    ...layLevels.map((l) => ({
      price: l.price,
      size: l.size,
      side: "lay" as const,
      depthPct: Math.round((l.size / totalSize) * 100),
    })),
    ...backLevels.map((l) => ({
      price: l.price,
      size: l.size,
      side: "back" as const,
      depthPct: Math.round((l.size / totalSize) * 100),
    })),
  ];

  const bestLay = layLevels[0]?.price ?? 0;
  const bestBack = backLevels[0]?.price ?? 0;

  return {
    marketId,
    marketName,
    sport,
    exchange,
    timestamp,
    bestBack,
    bestLay,
    spread: calculateSpread(bestBack, bestLay),
    midpoint: calculateMidpoint(bestBack, bestLay),
    levels,
    sourceMode,
  };
}

// ─── Timestamp ────────────────────────────────────────────────────────────────

export function ts(offsetMinutes = 0): string {
  const d = new Date(Date.now() - offsetMinutes * 60_000);
  return `${d.getUTCHours().toString().padStart(2, "0")}:${d
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}`;
}
