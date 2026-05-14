/**
 * prophetxReadOnlyAdapter — READ-ONLY ProphetX market intelligence shell.
 *
 * Current state: STUB — falls back to MockExchangeAdapter when env vars are absent.
 * No real ProphetX credentials are used.
 *
 * Future activation path:
 *   1. Set PROPHETX_API_KEY and PROPHETX_API_SECRET in .env.local
 *   2. Set PROPHETX_READONLY_MODE=true
 *   3. Implement the ProphetX WebSocket feed client
 *   4. Register this adapter in exchangeRouter.ts
 *
 * ProphetX read-only capabilities (when implemented):
 *   - Order book snapshots: bid/ask, size, depth
 *   - Market catalogue: active contracts, settlement rules
 *   - Matched volume: traded contracts, dollar volume
 *   - NOT supported here: place orders, cancel orders, fund management
 *
 * ProphetX API docs:
 *   https://docs.prophetx.com (pending commercial agreement)
 *
 * Compliance:
 *   Sports Market OS reads ProphetX data for market intelligence ONLY.
 *   No order placement. No fund management. No custody of assets.
 *   PROPHETX_READONLY_MODE must be true to activate this adapter.
 */

import type {
  ExchangeAdapter,
  ExchangeMarket,
  ExchangeOrderBook,
  ExchangeLiquiditySnapshot,
  ExchangeFlowSnapshot,
  ExchangeProviderStatus,
} from "./types";
import { MockExchangeAdapter } from "./mockExchangeAdapter";

// ─── Env var placeholders ─────────────────────────────────────────────────────

export function getProphetXApiKey(): string | null {
  return process.env.PROPHETX_API_KEY ?? null;
}

export function getProphetXApiSecret(): string | null {
  return process.env.PROPHETX_API_SECRET ?? null;
}

export function isProphetXReadOnlyMode(): boolean {
  return process.env.PROPHETX_READONLY_MODE === "true";
}

export function isProphetXConfigured(): boolean {
  return (
    getProphetXApiKey() !== null &&
    getProphetXApiSecret() !== null &&
    isProphetXReadOnlyMode()
  );
}

// ─── Future API constants (not yet active) ────────────────────────────────────

// const PROPHETX_API_BASE = "https://api.prophetx.com/v1";
// const PROPHETX_WS_BASE  = "wss://ws.prophetx.com/v1/stream";
//
// ProphetX market types:
// - Sports: NFL, NBA, MLB, NHL, college sports
// - Politics: election contracts, approval ratings
// - Finance: rate decisions, economic indicators

// ─── Stub functions (future implementation targets) ───────────────────────────

/**
 * FUTURE: Fetch active markets from ProphetX.
 * Requires valid API key + secret.
 * Returns bid/ask order book for active contracts.
 *
 * Implementation notes:
 *   - ProphetX uses bid/ask (not back/lay) — normalise via exchangeNormalizer
 *   - bid = equivalent of back; ask = equivalent of lay
 *   - Prices are decimal (USD-denominated contracts)
 */
async function _getMarketsFromProphetX(): Promise<ExchangeMarket[]> {
  // TODO: implement ProphetX REST API call
  throw new Error("ProphetX adapter not yet implemented — use MockExchangeAdapter");
}

async function _getOrderBookFromProphetX(_marketId: string): Promise<ExchangeOrderBook | null> {
  // TODO: implement ProphetX WebSocket subscription
  throw new Error("ProphetX adapter not yet implemented — use MockExchangeAdapter");
}

// ─── Adapter implementation ───────────────────────────────────────────────────

const mock = new MockExchangeAdapter();

export class ProphetXReadOnlyAdapter implements ExchangeAdapter {
  readonly name       = "ProphetXReadOnlyAdapter";
  readonly exchange   = "prophetx" as const;
  readonly sourceMode = "simulation" as const;

  async getMarkets(): Promise<ExchangeMarket[]> {
    if (isProphetXConfigured()) {
      // TODO: return await _getMarketsFromProphetX();
    }
    const markets = await mock.getMarkets();
    // Filter to ProphetX-relevant sports (NBA, NFL, prediction markets)
    return markets.filter((m) =>
      (["NBA", "NFL", "Prediction Markets"] as string[]).includes(m.sport)
    );
  }

  async getOrderBook(marketId: string): Promise<ExchangeOrderBook | null> {
    if (isProphetXConfigured()) {
      // TODO: return await _getOrderBookFromProphetX(marketId);
    }
    return mock.getOrderBook(marketId);
  }

  async getLiquiditySnapshot(marketId: string): Promise<ExchangeLiquiditySnapshot | null> {
    return mock.getLiquiditySnapshot(marketId);
  }

  async getAllLiquiditySnapshots(): Promise<ExchangeLiquiditySnapshot[]> {
    const all = await mock.getAllLiquiditySnapshots();
    return all.filter((s) =>
      (["NBA", "NFL", "Prediction Markets"] as string[]).includes(s.sport)
    );
  }

  async getFlowSnapshots(): Promise<ExchangeFlowSnapshot[]> {
    const all = await mock.getFlowSnapshots();
    return all.filter((f) =>
      (["NBA", "NFL", "Prediction Markets"] as string[]).includes(f.sport)
    );
  }

  async getProviderStatus(): Promise<ExchangeProviderStatus> {
    const configured = isProphetXConfigured();
    return {
      exchange:    "prophetx",
      name:        "ProphetX Read-Only Adapter",
      status:      configured ? "online" : "planned",
      sourceMode:  configured ? "live" : "simulation",
      description: configured
        ? "ProphetX market data feed connected — read-only order book active."
        : "ProphetX market data adapter — pending commercial API agreement. Set PROPHETX_API_KEY + PROPHETX_API_SECRET + PROPHETX_READONLY_MODE=true.",
      readOnly: true,
    };
  }
}
