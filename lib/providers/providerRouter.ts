/**
 * ProviderRouter — routes all data requests to the active provider.
 *
 * Active provider is determined by environment variable:
 *   NEXT_PUBLIC_DATA_MODE = "simulation" | "hybrid" | "live"
 *
 * News and odds routes use their own mode logic (see newsProvider / oddsProvider).
 * Provider status reflects actual modes dynamically.
 */

import type {
  IProvider,
  DataMode,
  ProviderStatusType,
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
import { getNewsMode } from "./newsApiProvider";
import { getOddsWithMode, getOddsMode } from "./oddsProvider";
import { isBetfairConfigured } from "../exchanges/betfairReadOnlyAdapter";
import { isProphetXConfigured } from "../exchanges/prophetxReadOnlyAdapter";

// ─── Active provider selection ────────────────────────────────────────────────

function getActiveProvider(): IProvider {
  const mode = process.env.NEXT_PUBLIC_DATA_MODE as DataMode | undefined;
  // Future: if (mode === "live") return new BetfairProvider();
  // Future: if (mode === "hybrid") return new HybridProvider();
  void mode;
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
  const result = await getOddsWithMode();
  const meta: ResponseMeta = {
    mode: result.mode,
    provider: result.liveSuccess ? "TheOddsAPI" : "MockProvider",
    timestamp: new Date().toISOString(),
    count: result.snapshots.length,
  };
  return { snapshots: result.snapshots, meta };
}

export async function routeMarketPulse(): Promise<MarketPulseResponse> {
  const provider = getActiveProvider();
  const items = await provider.getMarketPulse();
  return { items, meta: makeMeta(provider, items.length) };
}

export async function routeProviderStatus(): Promise<ProviderStatusResponse> {
  const provider = getActiveProvider();
  const providers = await provider.getProviderStatuses();

  const newsMode = getNewsMode();
  const oddsMode = getOddsMode();

  function modeToStatus(mode: DataMode): ProviderStatusType {
    return mode === "simulation" ? "simulated" : "online";
  }

  const betfairLive  = isBetfairConfigured();
  const prophetxLive = isProphetXConfigured();

  const patched: ProviderStatus[] = providers.map((p) => {
    if (p.id === "ps-002") {
      return {
        ...p,
        status: modeToStatus(newsMode),
        description:
          newsMode === "simulation"
            ? "Simulated wire feed — add SPORTS_NEWS_API_KEY to activate live data."
            : newsMode === "hybrid"
            ? "Hybrid — live NewsAPI.org data merged with simulation."
            : "Live — NewsAPI.org wire feed active.",
      };
    }
    if (p.id === "ps-003") {
      return {
        ...p,
        status: modeToStatus(oddsMode),
        description:
          oddsMode === "simulation"
            ? "Simulated odds movements — add THE_ODDS_API_KEY to activate live data."
            : oddsMode === "hybrid"
            ? "Hybrid — live odds from The Odds API merged with simulation."
            : "Live — The Odds API active.",
      };
    }
    if (p.id === "ps-006") {
      return {
        ...p,
        status: betfairLive ? "online" : "planned",
        description: betfairLive
          ? "Betfair Exchange Streaming API connected — read-only price feed active."
          : "Exchange Streaming API adapter — set BETFAIR_APP_KEY + BETFAIR_SESSION_TOKEN + BETFAIR_READONLY_MODE=true to activate.",
      };
    }
    if (p.id === "ps-007") {
      return {
        ...p,
        status: prophetxLive ? "online" : "planned",
        description: prophetxLive
          ? "ProphetX market data feed connected — read-only order book active."
          : "ProphetX market data adapter — pending commercial API agreement. Set PROPHETX_API_KEY + PROPHETX_READONLY_MODE=true.",
      };
    }
    return p;
  });

  const partnershipStatuses: ProviderStatus[] = [
    {
      id: "ps-010",
      name: "Creator Network",
      status: "online",
      category: "intelligence",
      description: "47 active creator partners · content export + distribution infrastructure active.",
    },
    {
      id: "ps-011",
      name: "Exchange Adapters",
      status: betfairLive || prophetxLive ? "online" : "simulated",
      category: "exchange",
      description:
        betfairLive || prophetxLive
          ? "Live exchange adapter(s) connected — read-only microstructure data active."
          : "Exchange adapters in simulation mode — mock order book and flow data active.",
    },
    {
      id: "ps-012",
      name: "Content Engine",
      status: "online",
      category: "ai",
      description: "AI narrative generation active · X post, Telegram, and Shorts export formats operational.",
    },
    {
      id: "ps-013",
      name: "API Infrastructure",
      status: "online",
      category: "intelligence",
      description: "5 exchange routes + 3 provider routes active · all responses readOnly: true.",
    },
  ];

  return {
    providers: [...patched, ...partnershipStatuses],
    systemMode: provider.mode,
    timestamp: new Date().toISOString(),
  };
}
