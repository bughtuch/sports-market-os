import type { SportType, Direction } from "@/lib/providers/types";

export type { SportType, Direction };

export type AISeverity = "low" | "medium" | "high" | "critical";

export interface MarketCatalyst {
  id: string;
  headline: string;
  source: string;
  severity: AISeverity;
  timestamp: string;
  impact: string;
}

export interface Market {
  slug: string;
  title: string;
  sport: SportType;
  exchange: string;
  openingPrice: number;
  currentPrice: number;
  direction: Direction;
  movement: string;
  volatility: number;
  liquidity: number;
  confidence: number;
  aiRegime: string;
  aiSeverity: AISeverity;
  description: string;
  aiNarrative: string;
  liquidityNote: string;
  volatilityNote: string;
  behaviouralNote: string;
  keyCatalysts: string[];
  catalysts: MarketCatalyst[];
  relatedSlugs: string[];
  tags: string[];
}

export interface SportHub {
  sport: SportType;
  slug: string;
  title: string;
  subtitle: string;
  seoDescription: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  dotColor: string;
  activeMarkets: number;
  monitoredExchanges: number;
  marketSlugs: string[];
  highlights: string[];
  aiSummary: string;
}
