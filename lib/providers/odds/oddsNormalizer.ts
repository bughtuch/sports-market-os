/**
 * oddsNormalizer — converts raw odds API payloads to internal OddsSnapshot format.
 *
 * All conversion functions are pure / side-effect free.
 * Decimal odds are the internal standard — all other formats convert to decimal first.
 *
 * Compliance:
 *   All calculations are for market intelligence only.
 *   No bet placement, no order routing, no profit guarantee.
 */

import type { OddsSnapshot, SportType, Direction, DataMode } from "../types";

// ─── Price conversion ──────────────────────────────────────────────────────────

/** Convert decimal odds to implied probability (%). Two decimal places. */
export function decimalToImpliedProbability(decimal: number): number {
  if (decimal <= 1) return 0;
  return Math.round((1 / decimal) * 10000) / 100;
}

/** Convert American (moneyline) odds to decimal. */
export function americanToDecimal(american: number): number {
  if (american > 0) return Math.round((american / 100 + 1) * 100) / 100;
  if (american < 0) return Math.round((100 / Math.abs(american) + 1) * 100) / 100;
  return 1;
}

// ─── Movement ─────────────────────────────────────────────────────────────────

export function calculateMovement(
  opening: number,
  current: number
): { movementPct: number; direction: Direction } {
  if (opening <= 0) return { movementPct: 0, direction: "flat" };
  const pct = ((current - opening) / opening) * 100;
  const movementPct = Math.round(pct * 10) / 10;
  const direction: Direction = pct > 0.1 ? "up" : pct < -0.1 ? "down" : "flat";
  return { movementPct, direction };
}

// ─── Volatility ───────────────────────────────────────────────────────────────

/** Returns a 0–100 volatility score based on price movement magnitude. */
export function calculateVolatilityScore(opening: number, current: number): number {
  if (opening <= 0) return 0;
  const absPct = Math.abs(((current - opening) / opening) * 100);
  return Math.min(Math.round(absPct * 5), 100);
}

// ─── Synthetic opening price ──────────────────────────────────────────────────

/**
 * Generates a deterministic synthetic opening price from the current price.
 * Used when historical opening prices are not available from the live provider.
 * The variance is derived from the seed string — stable across requests.
 * Range: ±8% of current price.
 */
export function syntheticOpeningPrice(current: number, seed: string): number {
  const code = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const variancePct = ((code % 16) - 8) / 100; // −8% to +8%
  const opening = current / (1 + variancePct);
  return Math.round(opening * 100) / 100;
}

// ─── Timestamp ────────────────────────────────────────────────────────────────

export function formatOddsTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    const h = d.getUTCHours().toString().padStart(2, "0");
    const m = d.getUTCMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  } catch {
    return "--:--";
  }
}

// ─── Raw outcome shape ────────────────────────────────────────────────────────

export interface RawOddsOutcome {
  id: string;
  sport: SportType;
  market: string;
  selection: string;
  currentPrice: number;
  source: string;
  timestamp: string;
  sourceUrl?: string;
  providerMode: DataMode;
}

// ─── Normalizer ───────────────────────────────────────────────────────────────

export function normalizeProviderOdds(raw: RawOddsOutcome, index: number): OddsSnapshot {
  const openingPrice = syntheticOpeningPrice(raw.currentPrice, raw.id + raw.selection);
  const impliedProbability = decimalToImpliedProbability(raw.currentPrice);
  const openingProb = decimalToImpliedProbability(openingPrice);
  const probChange = Math.round((impliedProbability - openingProb) * 10) / 10;
  const { movementPct, direction } = calculateMovement(openingPrice, raw.currentPrice);
  const volatility = calculateVolatilityScore(openingPrice, raw.currentPrice);

  return {
    id: `odds-${raw.id}-${index}`,
    sport: raw.sport,
    market: raw.market,
    selection: raw.selection,
    openingPrice,
    currentPrice: raw.currentPrice,
    impliedProbability,
    probChange,
    movementPct,
    direction,
    source: raw.source,
    timestamp: raw.timestamp.includes("T")
      ? formatOddsTimestamp(raw.timestamp)
      : raw.timestamp,
    volatility,
    sourceUrl: raw.sourceUrl,
    providerMode: raw.providerMode,
  };
}
