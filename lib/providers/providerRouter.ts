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
  SportType,
  Direction,
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
  GeneratedSignal,
} from "./types";
import { MockProvider } from "./mockProvider";
import { getNewsWithMode } from "./newsProvider";
import { getNewsMode } from "./newsApiProvider";
import { getOddsWithMode, getOddsMode } from "./oddsProvider";
import { isBetfairConfigured } from "../exchanges/betfairReadOnlyAdapter";
import { isProphetXConfigured } from "../exchanges/prophetxReadOnlyAdapter";
import { fetchPublishedSignals } from "../signals/persistence";

// ─── GeneratedSignal → MarketSignal mapping ───────────────────────────────────

const SPORT_MAP: Record<string, SportType> = {
  horse_racing: "Horse Racing",
  tennis:       "Tennis",
  nba:          "NBA",
  nfl:          "NFL",
  ufc:          "UFC",
  football:     "Football",
  mlb:          "MLB",
  nhl:          "NHL",
  golf:         "Golf",
  f1:           "Formula 1",
};

const DIR_MAP: Record<string, Direction> = {
  up:     "up",
  down:   "down",
  over:   "up",
  under:  "down",
  narrow: "flat",
  widen:  "flat",
};

const SOURCE_LABEL: Record<string, string> = {
  polymarket:   "Polymarket",
  the_odds_api: "The Odds API",
  betfair:      "Betfair",
  mock:         "Simulated",
};

function signalTypeLabel(t: string): string {
  return t.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function sparkFromId(id: string): number[] {
  const seed = id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return Array.from({ length: 7 }, (_, i) =>
    Math.max(10, Math.min(90, Math.round(50 + Math.sin((seed + i * 137) / 13) * 25)))
  );
}

function mapToMarketSignal(s: GeneratedSignal): MarketSignal {
  const ts = new Date(s.generated_at);
  const timestamp = `${ts.getUTCHours().toString().padStart(2, "0")}:${ts.getUTCMinutes().toString().padStart(2, "0")}`;
  const mag = s.predicted_magnitude != null ? Math.round(s.predicted_magnitude) : null;
  const movementSuffix = ["narrow", "widen"].includes(s.predicted_direction) ? "bp" : "%";
  const movement = mag != null ? `${s.predicted_direction} ${mag}${movementSuffix}` : s.predicted_direction;

  // Extract Polymarket event slug from raw_inputs (written by detectors from Sprint 3N)
  const ri = s.raw_inputs as Record<string, unknown> | null | undefined;
  const polymarketSlug = s.source === "polymarket"
    ? (ri?.event_slug as string | undefined)
    : undefined;

  return {
    id: s.id,
    sport: SPORT_MAP[s.sport] ?? "Football",
    timestamp,
    title: s.event_title,
    description: s.narrative?.trim() ||
      `${signalTypeLabel(s.signal_type)} detected. Confidence ${Math.round(s.confidence)}%. Decay window ${s.decay_window_minutes} min.`,
    confidence: Math.round(s.confidence),
    tag: "Free",
    type: signalTypeLabel(s.signal_type),
    movement,
    direction: DIR_MAP[s.predicted_direction] ?? "flat",
    aiScore: Math.round(s.confidence),
    exchange: SOURCE_LABEL[s.source] ?? s.source,
    sparkData: sparkFromId(s.id),
    insight: s.signal_type === "cross_source_divergence"
      ? "Cross-source divergence — markets typically converge."
      : undefined,
    // Sprint 3N — signal actions passthrough
    source:        s.source,
    event_id:      s.event_id,
    event_title:   s.event_title,
    signal_type:   s.signal_type,
    narrative:     s.narrative ?? undefined,
    polymarketSlug,
  };
}

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
  // Live path: read from Supabase signals table
  // Empty state is real — do NOT fall back to mock when the table is empty.
  const generated = await fetchPublishedSignals(8);
  const signals: MarketSignal[] = generated.map(mapToMarketSignal);
  const meta: ResponseMeta = {
    mode: "live",
    provider: "Supabase/signals",
    timestamp: new Date().toISOString(),
    count: signals.length,
  };
  return { signals, meta };
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
