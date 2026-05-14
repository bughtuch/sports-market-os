/**
 * ExchangeRouter — routes exchange data requests to the active adapter.
 *
 * Adapter selection:
 *   - If BETFAIR env vars present → BetfairReadOnlyAdapter (falls back to mock)
 *   - If PROPHETX env vars present → ProphetXReadOnlyAdapter (falls back to mock)
 *   - Default → MockExchangeAdapter
 *
 * All adapters are read-only. No execution logic exists in this router.
 *
 * Compliance:
 *   Exchange data is displayed for market intelligence only.
 *   Sports Market OS does not execute trades, place wagers, or custody funds.
 */

import type {
  ExchangeMarketsResponse,
  ExchangeOrderBookResponse,
  ExchangeLiquidityResponse,
  ExchangeFlowResponse,
  ExchangeStatusResponse,
  ExchangeResponseMeta,
  ExchangeSourceMode,
} from "./types";
import { MockExchangeAdapter } from "./mockExchangeAdapter";
import { BetfairReadOnlyAdapter, isBetfairConfigured } from "./betfairReadOnlyAdapter";
import { ProphetXReadOnlyAdapter, isProphetXConfigured } from "./prophetxReadOnlyAdapter";

// ─── Adapter selection ────────────────────────────────────────────────────────

const mock     = new MockExchangeAdapter();
const betfair  = new BetfairReadOnlyAdapter();
const prophetx = new ProphetXReadOnlyAdapter();

function getSourceMode(): ExchangeSourceMode {
  if (isBetfairConfigured() || isProphetXConfigured()) return "live";
  return "simulation";
}

function getProviderName(): string {
  const parts: string[] = [];
  if (isBetfairConfigured()) parts.push("Betfair");
  if (isProphetXConfigured()) parts.push("ProphetX");
  return parts.length > 0 ? parts.join(" + ") : "MockExchangeAdapter";
}

function makeMeta(count: number): ExchangeResponseMeta {
  return {
    sourceMode:  getSourceMode(),
    provider:    getProviderName(),
    timestamp:   new Date().toISOString(),
    count,
    readOnly:    true,
  };
}

// ─── Route functions ──────────────────────────────────────────────────────────

export async function routeExchangeMarkets(): Promise<ExchangeMarketsResponse> {
  // Merge all adapter markets for a combined view
  const [mockMarkets, betfairMarkets, prophetxMarkets] = await Promise.all([
    mock.getMarkets(),
    isBetfairConfigured() ? betfair.getMarkets() : Promise.resolve([]),
    isProphetXConfigured() ? prophetx.getMarkets() : Promise.resolve([]),
  ]);

  // When live adapters are active, live data takes precedence; simulation pads the rest
  const markets = isBetfairConfigured() || isProphetXConfigured()
    ? [...betfairMarkets, ...prophetxMarkets]
    : mockMarkets;

  return { markets, meta: makeMeta(markets.length) };
}

export async function routeExchangeOrderBook(
  marketId?: string
): Promise<ExchangeOrderBookResponse> {
  const targetId = marketId ?? "BF-HR-001";
  const adapter = isBetfairConfigured() ? betfair : mock;
  const orderBook = await adapter.getOrderBook(targetId);
  return { orderBook, meta: makeMeta(orderBook ? 1 : 0) };
}

export async function routeExchangeLiquidity(): Promise<ExchangeLiquidityResponse> {
  const [mockSnaps, betfairSnaps, prophetxSnaps] = await Promise.all([
    mock.getAllLiquiditySnapshots(),
    isBetfairConfigured() ? betfair.getAllLiquiditySnapshots() : Promise.resolve([]),
    isProphetXConfigured() ? prophetx.getAllLiquiditySnapshots() : Promise.resolve([]),
  ]);

  const snapshots = isBetfairConfigured() || isProphetXConfigured()
    ? [...betfairSnaps, ...prophetxSnaps]
    : mockSnaps;

  return { snapshots, meta: makeMeta(snapshots.length) };
}

export async function routeExchangeFlow(): Promise<ExchangeFlowResponse> {
  const flows = await mock.getFlowSnapshots();
  return { flows, meta: makeMeta(flows.length) };
}

export async function routeExchangeStatus(): Promise<ExchangeStatusResponse> {
  const [mockStatus, betfairStatus, prophetxStatus] = await Promise.all([
    mock.getProviderStatus(),
    betfair.getProviderStatus(),
    prophetx.getProviderStatus(),
  ]);

  const providers = [mockStatus, betfairStatus, prophetxStatus];
  return { providers, meta: makeMeta(providers.length) };
}
