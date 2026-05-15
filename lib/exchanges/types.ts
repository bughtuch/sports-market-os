/**
 * Exchange adapter types — read-only market intelligence.
 *
 * Compliance:
 *   Sports Market OS reads exchange data for intelligence purposes only.
 *   No bet placement, no order routing, no custody of funds.
 *   readOnly: true is included in every response.
 */

import type { SportType, Direction } from "../providers/types";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type ExchangeName =
  | "betfair"
  | "prophetx"
  | "smarkets"
  | "betdaq"
  | "polymarket"
  | "pinnacle"
  | "mock";

export type ExchangeStatus = "active" | "suspended" | "closed" | "pending";
export type ExchangeFlowType = "rotation" | "sharp" | "retail" | "institutional";
export type ExchangeSourceMode = "simulation" | "hybrid" | "live";

// ─── Order book ───────────────────────────────────────────────────────────────

export interface ExchangePriceLevel {
  price: number;
  size: number;
  /** "back" / "bid" = you back a selection; "lay" / "ask" = you lay */
  side: "back" | "lay" | "bid" | "ask";
  /** Percentage of total depth this level represents */
  depthPct: number;
}

export interface ExchangeOrderBook {
  marketId: string;
  marketName: string;
  sport: SportType;
  exchange: ExchangeName;
  timestamp: string;
  bestBack: number;
  bestLay: number;
  spread: number;
  midpoint: number;
  levels: ExchangePriceLevel[];
  sourceMode: ExchangeSourceMode;
}

// ─── Liquidity ────────────────────────────────────────────────────────────────

export interface ExchangeLiquiditySnapshot {
  id: string;
  marketId: string;
  marketName: string;
  sport: SportType;
  exchange: ExchangeName;
  timestamp: string;
  /** Total matched volume in native currency */
  matchedVolume: number;
  currency: "GBP" | "USD";
  /** 0–100 overall liquidity depth score */
  liquidityDepth: number;
  /** 0–100 queue health score (balance of back/lay depth) */
  queueHealth: number;
  spread: number;
  /** 0–100 spread quality (higher = tighter spread) */
  spreadQuality: number;
  /** –100 to +100 (positive = lay-heavy; negative = back-heavy) */
  depthImbalance: number;
  /** 0–100 net order flow pressure score */
  flowPressure: number;
  latencyMs: number;
  status: ExchangeStatus;
  sourceMode: ExchangeSourceMode;
}

// ─── Exchange flow ────────────────────────────────────────────────────────────

export interface ExchangeFlowSnapshot {
  id: string;
  sport: SportType;
  market: string;
  fromExchange: ExchangeName;
  toExchange: ExchangeName;
  flowType: ExchangeFlowType;
  volumeUSD: number;
  timestamp: string;
  direction: Direction;
  sourceMode: ExchangeSourceMode;
}

// ─── Exchange market ──────────────────────────────────────────────────────────

export interface ExchangeMarket {
  marketId: string;
  marketName: string;
  sport: SportType;
  exchange: ExchangeName;
  status: ExchangeStatus;
  timestamp: string;
  bestBack: number;
  bestLay: number;
  spread: number;
  matchedVolume: number;
  liquidityDepth: number;
  queueHealth: number;
  volatilityScore: number;
  sourceMode: ExchangeSourceMode;
  currency: "GBP" | "USD";
}

// ─── Provider status ──────────────────────────────────────────────────────────

export interface ExchangeProviderStatus {
  exchange: ExchangeName;
  name: string;
  status: "online" | "simulated" | "planned" | "degraded";
  sourceMode: ExchangeSourceMode;
  latencyMs?: number;
  description: string;
  readOnly: true;
}

// ─── Adapter interface ────────────────────────────────────────────────────────

export interface ExchangeAdapter {
  readonly name: string;
  readonly exchange: ExchangeName;
  readonly sourceMode: ExchangeSourceMode;
  getMarkets(): Promise<ExchangeMarket[]>;
  getOrderBook(marketId: string): Promise<ExchangeOrderBook | null>;
  getLiquiditySnapshot(marketId: string): Promise<ExchangeLiquiditySnapshot | null>;
  getAllLiquiditySnapshots(): Promise<ExchangeLiquiditySnapshot[]>;
  getFlowSnapshots(): Promise<ExchangeFlowSnapshot[]>;
  getProviderStatus(): Promise<ExchangeProviderStatus>;
}

// ─── API response shapes ──────────────────────────────────────────────────────

export interface ExchangeResponseMeta {
  sourceMode: ExchangeSourceMode;
  provider: string;
  timestamp: string;
  count: number;
  /** Always true — Sports Market OS is read-only */
  readOnly: true;
}

export interface ExchangeMarketsResponse {
  markets: ExchangeMarket[];
  meta: ExchangeResponseMeta;
}

export interface ExchangeOrderBookResponse {
  orderBook: ExchangeOrderBook | null;
  meta: ExchangeResponseMeta;
}

export interface ExchangeLiquidityResponse {
  snapshots: ExchangeLiquiditySnapshot[];
  meta: ExchangeResponseMeta;
}

export interface ExchangeFlowResponse {
  flows: ExchangeFlowSnapshot[];
  meta: ExchangeResponseMeta;
}

export interface ExchangeStatusResponse {
  providers: ExchangeProviderStatus[];
  meta: ExchangeResponseMeta;
}
