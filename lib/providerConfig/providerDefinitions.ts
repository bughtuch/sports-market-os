/**
 * providerDefinitions.ts — Static provider definitions.
 *
 * Pure data — no environment reads. Safe to import on client or server.
 * Describes what each provider needs, what modes it supports, and compliance context.
 */

import type { ProviderDefinition } from "./configTypes";

export const PROVIDER_DEFINITIONS: ProviderDefinition[] = [
  {
    id:              "news-api",
    name:            "Sports News API",
    category:        "news",
    description:
      "Live sports news wire via NewsAPI.org. Provides catalyst events, headlines, " +
      "and breaking news for Horse Racing, Tennis, Football, NBA, NFL, UFC, and Prediction Markets.",
    envVars: [
      {
        name:        "SPORTS_NEWS_API_KEY",
        required:    true,
        description: "NewsAPI.org API key for sports headlines and catalyst detection.",
        format:      "32-character alphanumeric string",
      },
    ],
    supportedModes:  ["live", "hybrid", "simulation"],
    liveCapable:     true,
    hybridCapable:   true,
    fallbackCapable: true,
    readOnly:        true,
    activationOrder: 1,
    complianceNote:
      "News data is used for catalyst detection and market intelligence only. " +
      "Sports Market OS does not act on news data automatically.",
  },
  {
    id:              "odds-api",
    name:            "Odds API",
    category:        "odds",
    description:
      "Live sports odds and price movements via The Odds API. Provides implied probability, " +
      "opening vs current price, and movement percentage across bookmakers and exchanges.",
    envVars: [
      {
        name:        "THE_ODDS_API_KEY",
        required:    true,
        description: "The Odds API key for live and historical odds data.",
        format:      "32-character alphanumeric string",
      },
    ],
    supportedModes:  ["live", "hybrid", "simulation"],
    liveCapable:     true,
    hybridCapable:   true,
    fallbackCapable: true,
    readOnly:        true,
    activationOrder: 2,
    complianceNote:
      "Odds data is displayed as market intelligence only. No bets are placed or suggested.",
  },
  {
    id:              "betfair-readonly",
    name:            "Betfair Exchange (Read-Only)",
    category:        "exchange",
    description:
      "Betfair Exchange Streaming API for read-only price feed, queue depth, and matched volume. " +
      "Provides microstructure data: sharp vs retail flow, lay/back imbalances, queue health alerts.",
    envVars: [
      {
        name:        "BETFAIR_APP_KEY",
        required:    true,
        description: "Betfair Application Key — issued via My Account → API Access.",
        format:      "alphanumeric app key string",
      },
      {
        name:        "BETFAIR_SESSION_TOKEN",
        required:    true,
        description: "Betfair session token from SSO endpoint. Short-lived — requires refresh logic.",
        format:      "base64 session token",
      },
      {
        name:        "BETFAIR_READONLY_MODE",
        required:    false,
        description: 'Safety flag. Set to "true" to enforce read-only adapter mode.',
        format:      '"true"',
      },
    ],
    supportedModes:  ["live", "simulation"],
    liveCapable:     true,
    hybridCapable:   false,
    fallbackCapable: true,
    readOnly:        true,
    activationOrder: 3,
    complianceNote:
      "Betfair adapter is read-only. Sports Market OS reads prices and queue data only. " +
      "No orders are placed. No account balance is accessed.",
  },
  {
    id:              "prophetx-readonly",
    name:            "ProphetX Exchange (Read-Only)",
    category:        "exchange",
    description:
      "ProphetX prediction market data feed for read-only order book and contract pricing. " +
      "Provides: contract prices, volume, consensus deviation from external polls.",
    envVars: [
      {
        name:        "PROPHETX_API_KEY",
        required:    true,
        description: "ProphetX market data API key. Requires commercial data agreement.",
        format:      "API key string issued by ProphetX",
      },
      {
        name:        "PROPHETX_READONLY_MODE",
        required:    false,
        description: 'Safety flag. Set to "true" to enforce read-only adapter.',
        format:      '"true"',
      },
    ],
    supportedModes:  ["live", "simulation"],
    liveCapable:     true,
    hybridCapable:   false,
    fallbackCapable: true,
    readOnly:        true,
    activationOrder: 4,
    complianceNote:
      "ProphetX adapter is read-only. Prediction market data used for intelligence display only. " +
      "No contracts are purchased or settled.",
  },
  {
    id:              "exchange-flow",
    name:            "Exchange Flow Engine",
    category:        "exchange",
    description:
      "Cross-exchange liquidity rotation and sharp-money flow detection. " +
      "Aggregates data across Betfair, Smarkets, and ProphetX to detect institutional vs retail flow.",
    envVars: [], // Derived from Betfair + ProphetX — no additional env vars needed
    supportedModes:  ["hybrid", "simulation"],
    liveCapable:     false, // activates automatically when Betfair/ProphetX are live
    hybridCapable:   true,
    fallbackCapable: true,
    readOnly:        true,
    activationOrder: 5,
    complianceNote:
      "Flow engine reads published exchange data only. No privileged or non-public data.",
  },
  {
    id:              "ai-engine",
    name:            "AI Brief Engine",
    category:        "ai",
    description:
      "AI-powered market intelligence: regime assessment, narrative generation, daily briefs, " +
      "opportunity scanning, liquidity analysis, volatility intelligence, and behaviour analysis.",
    envVars: [
      {
        name:        "ANTHROPIC_API_KEY",
        required:    true,
        description: "Anthropic API key for Claude model access.",
        format:      "sk-ant-...",
      },
    ],
    supportedModes:  ["live", "simulation"],
    liveCapable:     true,
    hybridCapable:   false,
    fallbackCapable: true,
    readOnly:        true,
    activationOrder: 0, // Activate first — needed for all AI modules
    complianceNote:
      "AI outputs are market intelligence only. No advice, no recommendations, no predictions of outcomes.",
  },
  {
    id:              "export-engine",
    name:            "Export Engine",
    category:        "distribution",
    description:
      "Client-side PNG export via html-to-image. Renders signal cards in multiple layouts and themes. " +
      "No server-side secrets required — runs entirely in the browser.",
    envVars: [], // No env vars — client-side only
    supportedModes:  ["live"],
    liveCapable:     true,
    hybridCapable:   false,
    fallbackCapable: false,
    readOnly:        true,
    activationOrder: 6,
    complianceNote:
      "All exports include compliance watermark: 'Market intelligence only · Not financial advice'.",
  },
  {
    id:              "distribution-engine",
    name:            "Distribution Engine",
    category:        "distribution",
    description:
      "Distribution queue persistence via Supabase with localStorage fallback. " +
      "Tracks posts, export events, partner attribution, and cloud sync state.",
    envVars: [
      {
        name:        "NEXT_PUBLIC_SUPABASE_URL",
        required:    true,
        description: "Supabase project URL for cloud persistence.",
        format:      "https://<project-ref>.supabase.co",
      },
      {
        name:        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        required:    true,
        description: "Supabase anonymous (public) key for authenticated client access.",
        format:      "eyJ... (JWT)",
      },
      {
        name:        "SUPABASE_SERVICE_ROLE_KEY",
        required:    false,
        description: "Supabase service role key for admin API routes. Server-side only.",
        format:      "eyJ... (JWT)",
      },
    ],
    supportedModes:  ["live", "simulation"],
    liveCapable:     true,
    hybridCapable:   false,
    fallbackCapable: true,
    readOnly:        false, // writes distribution_posts and export_events
    activationOrder: 7,
    complianceNote:
      "Distribution is user-initiated only. No automatic posting. Social adapters are mock-only until OAuth sprint.",
  },
];

export function getProviderDefinition(id: string): ProviderDefinition | undefined {
  return PROVIDER_DEFINITIONS.find(p => p.id === id);
}
