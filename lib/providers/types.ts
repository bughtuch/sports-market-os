// ─── Core domain types ───────────────────────────────────────────────────────

export type SportType =
  | "Horse Racing"
  | "Tennis"
  | "NBA"
  | "NFL"
  | "UFC"
  | "Football"
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
