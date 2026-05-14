/**
 * ProviderRouter — routes all data requests to the active provider.
 *
 * Active provider is determined by environment variable:
 *   NEXT_PUBLIC_DATA_MODE = "simulation" | "hybrid" | "live"
 *
 * Current sprint: always returns MockProvider (simulation mode).
 * Future: switch on env var to return real provider adapters.
 */

import type {
  IProvider,
  DataMode,
  MarketSignal,
  NewsItem,
  OddsSnapshot,
  MarketPulseItem,
  ProviderStatus,
  ResponseMeta,
  SignalsResponse,
  NewsResponse,
  OddsResponse,
  MarketPulseResponse,
  ProviderStatusResponse,
} from "./types";
import { MockProvider } from "./mockProvider";
import { getNewsWithMode } from "./newsProvider";

// ─── Active provider selection ────────────────────────────────────────────────

function getActiveProvider(): IProvider {
  const mode = process.env.NEXT_PUBLIC_DATA_MODE as DataMode | undefined;
  // Future: if (mode === "live") return new BetfairProvider();
  // Future: if (mode === "hybrid") return new HybridProvider();
  void mode; // suppress unused warning until real providers exist
  return new MockProvider();
}

function makeMeta(provider: IProvider, count: number): ResponseMeta {
  return {
    mode: provider.mode,
    provider: provider.name,
    timestamp: new Date().toISOString(),
    count,
  };
}

// ─── Router functions ─────────────────────────────────────────────────────────

export async function routeSignals(): Promise<SignalsResponse> {
  const provider = getActiveProvider();
  const signals = await provider.getSignals();
  return { signals, meta: makeMeta(provider, signals.length) };
}

export async function routeNews(): Promise<NewsResponse> {
  const result = await getNewsWithMode();
  const meta: ResponseMeta = {
    mode: result.mode,
    provider: result.liveSuccess ? "NewsAPI.org" : "MockProvider",
    timestamp: new Date().toISOString(),
    count: result.items.length,
  };
  return { items: result.items, meta };
}

export async function routeOdds(): Promise<OddsResponse> {
  const provider = getActiveProvider();
  const snapshots = await provider.getOddsSnapshots();
  return { snapshots, meta: makeMeta(provider, snapshots.length) };
}

export async function routeMarketPulse(): Promise<MarketPulseResponse> {
  const provider = getActiveProvider();
  const items = await provider.getMarketPulse();
  return { items, meta: makeMeta(provider, items.length) };
}

export async function routeProviderStatus(): Promise<ProviderStatusResponse> {
  const provider = getActiveProvider();
  const providers = await provider.getProviderStatuses();
  return {
    providers,
    systemMode: provider.mode,
    timestamp: new Date().toISOString(),
  };
}
