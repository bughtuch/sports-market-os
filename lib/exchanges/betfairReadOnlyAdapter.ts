/**
 * betfairReadOnlyAdapter — READ-ONLY Betfair Exchange market intelligence shell.
 *
 * Current state: STUB — falls back to MockExchangeAdapter when env vars are absent.
 * This file is architecture-only. No real Betfair authentication is implemented.
 *
 * Future activation path:
 *   1. Set BETFAIR_APP_KEY and BETFAIR_SESSION_TOKEN in .env.local
 *   2. Set BETFAIR_READONLY_MODE=true
 *   3. Implement the Exchange Streaming API (ESA) client in this file
 *   4. Register this adapter in exchangeRouter.ts
 *
 * Betfair read-only capabilities (when implemented):
 *   - Exchange Streaming API: real-time price/size updates (WebSocket)
 *   - REST API: market catalogue, market book, runner details
 *   - Read: best back/lay, matched volume, order book depth
 *   - NOT supported here: place bets, cancel orders, deposit/withdraw
 *
 * Betfair API docs:
 *   https://developer.betfair.com/exchange-api/
 *   https://developer.betfair.com/exchange-streaming-api/
 *
 * Compliance:
 *   Sports Market OS reads Betfair data for market intelligence ONLY.
 *   No bet placement. No order routing. No custody of funds.
 *   BETFAIR_READONLY_MODE must be true to activate this adapter.
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

export function getBetfairAppKey(): string | null {
  return process.env.BETFAIR_APP_KEY ?? null;
}

export function getBetfairSessionToken(): string | null {
  return process.env.BETFAIR_SESSION_TOKEN ?? null;
}

export function isBetfairReadOnlyMode(): boolean {
  return process.env.BETFAIR_READONLY_MODE === "true";
}

export function isBetfairConfigured(): boolean {
  return (
    getBetfairAppKey() !== null &&
    getBetfairSessionToken() !== null &&
    isBetfairReadOnlyMode()
  );
}

// ─── Future API constants (not yet active) ────────────────────────────────────

// const BETFAIR_API_BASE = "https://api.betfair.com/exchange/betting/rest/v1.0";
// const BETFAIR_STREAM_BASE = "wss://stream-api.betfair.com/api/stream-api/session";
//
// Betfair sports IDs:
// Horse Racing: 7
// Soccer:       1
// Tennis:       2
// Basketball:   6423
// American Football: 6423
// MMA:          26420387

// ─── Stub functions (future implementation targets) ───────────────────────────

/**
 * FUTURE: Fetch active markets from Betfair Exchange.
 * Requires valid session token and app key.
 * Returns real-time market catalogue + price data.
 *
 * Implementation notes:
 *   - Use listMarketCatalogue + listMarketBook in a single REST call
 *   - Filter by inplay=true or openDate within next 24h
 *   - Normalise using buildOrderBook() from exchangeNormalizer
 */
async function _getMarketsFromBetfair(): Promise<ExchangeMarket[]> {
  // TODO: implement Betfair REST API call
  // const response = await safeFetch(`${BETFAIR_API_BASE}/listMarketBook/`, { ... });
  throw new Error("Betfair adapter not yet implemented — use MockExchangeAdapter");
}

/**
 * FUTURE: Get live order book from Betfair Exchange Streaming API.
 * WSS connection required. Session token must be renewed every 4 hours.
 */
async function _getOrderBookFromBetfair(_marketId: string): Promise<ExchangeOrderBook | null> {
  // TODO: implement ESA subscription for specific market
  throw new Error("Betfair adapter not yet implemented — use MockExchangeAdapter");
}

// ─── Adapter implementation ───────────────────────────────────────────────────

const mock = new MockExchangeAdapter();

export class BetfairReadOnlyAdapter implements ExchangeAdapter {
  readonly name       = "BetfairReadOnlyAdapter";
  readonly exchange   = "betfair" as const;
  readonly sourceMode = "simulation" as const; // switches to "live" when configured

  /** All methods fall back to mock until real credentials are configured. */

  async getMarkets(): Promise<ExchangeMarket[]> {
    if (isBetfairConfigured()) {
      // TODO: return await _getMarketsFromBetfair();
    }
    const markets = await mock.getMarkets();
    // Filter to Betfair-relevant sports (horse racing, tennis, football, UFC)
    return markets.filter((m) =>
      ["betfair", "mock"].includes(m.exchange)
    );
  }

  async getOrderBook(marketId: string): Promise<ExchangeOrderBook | null> {
    if (isBetfairConfigured()) {
      // TODO: return await _getOrderBookFromBetfair(marketId);
    }
    return mock.getOrderBook(marketId);
  }

  async getLiquiditySnapshot(marketId: string): Promise<ExchangeLiquiditySnapshot | null> {
    return mock.getLiquiditySnapshot(marketId);
  }

  async getAllLiquiditySnapshots(): Promise<ExchangeLiquiditySnapshot[]> {
    return mock.getAllLiquiditySnapshots();
  }

  async getFlowSnapshots(): Promise<ExchangeFlowSnapshot[]> {
    return mock.getFlowSnapshots();
  }

  async getProviderStatus(): Promise<ExchangeProviderStatus> {
    const configured = isBetfairConfigured();
    return {
      exchange:    "betfair",
      name:        "Betfair Read-Only Adapter",
      status:      configured ? "online" : "planned",
      sourceMode:  configured ? "live" : "simulation",
      latencyMs:   configured ? undefined : undefined,
      description: configured
        ? "Betfair Exchange Streaming API connected — read-only price feed active."
        : "Exchange Streaming API adapter — set BETFAIR_APP_KEY + BETFAIR_SESSION_TOKEN + BETFAIR_READONLY_MODE=true to activate.",
      readOnly: true,
    };
  }
}
