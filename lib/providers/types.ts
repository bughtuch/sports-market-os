// ─── Core domain types ───────────────────────────────────────────────────────

export type SportType =
  | "Horse Racing"
  | "Tennis"
  | "NBA"
  | "NFL"
  | "NHL"
  | "MLB"
  | "UFC"
  | "Football"
  | "Golf"
  | "Formula 1"
  | "Prediction Markets";

export type SignalTag = "Free" | "Premium" | "Creator" | "API";
export type Direction = "up" | "down" | "flat";
export type DataMode = "simulation" | "hybrid" | "live";
export type ProviderStatusType = "online" | "simulated" | "planned" | "degraded";
export type CatalystSeverity = "low" | "medium" | "high" | "critical";
export type NewsSourceType = "wire" | "exchange" | "social" | "official" | "model";

// ─── Market Signal ────────────────────────────────────────────────────────────

export interface MarketSignal {
  id: string;
  sport: SportType;
  timestamp: string;
  title: string;
  description: string;
  confidence: number;
  tag: SignalTag;
  type: string;
  movement: string;
  direction: Direction;
  aiScore: number;
  exchange: string;
  sparkData: number[];
  insight?: string;
  // Sprint 3N — signal actions
  source?: string;
  event_id?: string;
  event_title?: string;
  signal_type?: string;
  narrative?: string;
  polymarketSlug?: string;
}

// ─── Market Event ─────────────────────────────────────────────────────────────

export interface MarketEvent {
  id: string;
  sport: SportType;
  title: string;
  exchange: string;
  timestamp: string;
  direction: Direction;
  volatilityScore: number;
  liquidityScore: number;
}

// ─── News Item ────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: string;
  sport: SportType;
  headline: string;
  source: string;
  sourceType: NewsSourceType;
  timestamp: string;
  severity: CatalystSeverity;
  linkedMarket: string;
  catalystType: string;
  impact: string;
  /** External source URL — present on live/hybrid items, absent on simulation */
  url?: string;
}

// ─── Odds Snapshot ────────────────────────────────────────────────────────────

export interface OddsSnapshot {
  id: string;
  sport: SportType;
  market: string;
  selection: string;
  openingPrice: number;
  currentPrice: number;
  impliedProbability: number;
  probChange: number;
  movementPct: number;
  direction: Direction;
  source: string;
  timestamp: string;
  volatility: number;
  /** External source URL — present on live/hybrid items */
  sourceUrl?: string;
  /** Data mode this snapshot was fetched under */
  providerMode?: DataMode;
}

// ─── Exchange Flow ────────────────────────────────────────────────────────────

export interface ExchangeFlow {
  id: string;
  sport: SportType;
  market: string;
  fromExchange: string;
  toExchange: string;
  flowType: "rotation" | "sharp" | "retail" | "institutional";
  volumeUSD: number;
  timestamp: string;
  direction: Direction;
}

// ─── Market Pulse ─────────────────────────────────────────────────────────────

export interface MarketPulseItem {
  title: string;
  sport: SportType;
  value: string;
  change: string;
  direction: Direction;
  sparkData: number[];
  timestamp: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}

// ─── Provider Status ──────────────────────────────────────────────────────────

export interface ProviderStatus {
  id: string;
  name: string;
  status: ProviderStatusType;
  latencyMs?: number;
  lastUpdate?: string;
  description: string;
  category: "intelligence" | "exchange" | "odds" | "news" | "ai";
}

// ─── API Response shapes ──────────────────────────────────────────────────────

export interface SignalsResponse {
  signals: MarketSignal[];
  meta: ResponseMeta;
}

export interface NewsResponse {
  items: NewsItem[];
  meta: ResponseMeta;
}

export interface OddsResponse {
  snapshots: OddsSnapshot[];
  meta: ResponseMeta;
}

export interface MarketPulseResponse {
  items: MarketPulseItem[];
  meta: ResponseMeta;
}

export interface ProviderStatusResponse {
  providers: ProviderStatus[];
  systemMode: DataMode;
  timestamp: string;
}

export interface ResponseMeta {
  mode: DataMode;
  provider: string;
  timestamp: string;
  count: number;
}

// ─── Signal Engine types (Sprint 3A) ─────────────────────────────────────────

export type SignalType =
  | 'volume_surge'
  | 'open_interest_shift'
  | 'queue_thinning'
  | 'spread_compression'
  | 'spread_widening'
  | 'whale_concentration'
  | 'sharp_flow'
  | 'price_divergence'
  | 'cross_source_divergence'
  | 'line_move'
  | 'catalyst_detected';

export type Sport =
  | 'horse_racing'
  | 'tennis'
  | 'nba'
  | 'nfl'
  | 'ufc'
  | 'football'
  | 'mlb'
  | 'nhl'
  | 'golf'
  | 'f1';

export type DataSource =
  | 'polymarket'
  | 'the_odds_api'
  | 'betfair'
  | 'mock';

export interface NormalizedMarketEvent {
  event_id: string;
  external_id: string;
  source: DataSource;
  sport: Sport;
  /** Polymarket event slug — populated by Gamma adapter, used for deeplinks */
  event_slug?: string;
  market_type: string;
  event_title: string;
  commence_time: string;
  is_live: boolean;
  is_resolved: boolean;
  current_prices: Array<{
    selection: string;
    /** Polymarket: 0-1 probability. Odds API: decimal odds. */
    price: number;
    volume_24h?: number;
    open_interest?: number;
  }>;
  orderbook?: {
    bids: Array<{ price: number; size: number }>;
    asks: Array<{ price: number; size: number }>;
    /** 0-100, adapter-computed */
    depth_score?: number;
  };
  price_history?: Array<{
    timestamp: string;
    selection: string;
    price: number;
  }>;
  /** Original provider payload for debugging */
  raw: unknown;
  /** ISO 8601 when this snapshot was captured */
  snapshot_at: string;
}

export interface GeneratedSignal {
  /** UUID */
  id: string;
  generated_at: string;
  sport: Sport;
  market_type: string;
  source: DataSource;
  event_id: string;
  event_title: string;
  signal_type: SignalType;
  predicted_direction: 'up' | 'down' | 'over' | 'under' | 'narrow' | 'widen';
  predicted_magnitude?: number;
  /** 0-100 */
  confidence: number;
  decay_window_minutes: number;
  /** null in 3A — filled by AI Narrator in 3B */
  narrative?: string | null;
  historical_analog?: {
    event: string;
    date: string;
    outcome: string;
    time_to_resolution_minutes: number;
  } | null;
  /** Snapshot data that triggered the signal */
  raw_inputs: unknown;
  is_published: boolean;
}

// ─── Provider interface ───────────────────────────────────────────────────────

export interface IProvider {
  name: string;
  mode: DataMode;
  getSignals(): Promise<MarketSignal[]>;
  getNews(): Promise<NewsItem[]>;
  getOddsSnapshots(): Promise<OddsSnapshot[]>;
  getMarketPulse(): Promise<MarketPulseItem[]>;
  getProviderStatuses(): Promise<ProviderStatus[]>;
}
