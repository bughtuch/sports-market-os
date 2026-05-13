/**
 * ExchangeProvider — adapter interface for sports exchange data.
 *
 * Currently delegates to MockProvider.
 * Future integrations: Betfair Exchange Streaming API, Smarkets API, ProphetX.
 *
 * To add a real provider:
 *   1. Implement IProvider with the exchange API client
 *   2. Handle auth (OAuth for Betfair, API key for others)
 *   3. Map exchange-native order book format to ExchangeFlow
 *   4. Register in providerRouter.ts
 *
 * Compliance note:
 *   This adapter reads exchange data (prices, volume, queue depth) only.
 *   Sports Market OS does NOT place bets, route orders, or hold exchange accounts.
 */

import type { IProvider, ExchangeFlow, MarketSignal } from "./types";
import { MockProvider } from "./mockProvider";

const mock = new MockProvider();

export async function getSignals(): Promise<MarketSignal[]> {
  return mock.getSignals();
}

export async function getSignalsFromProvider(provider: IProvider): Promise<MarketSignal[]> {
  return provider.getSignals();
}

// Placeholder — will return real exchange flow when Betfair adapter is live
export async function getExchangeFlow(): Promise<ExchangeFlow[]> {
  return [];
}
