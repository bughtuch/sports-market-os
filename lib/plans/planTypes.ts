// ─── Plan identifiers ─────────────────────────────────────────────────────────

export type PlanId = "free" | "partner" | "api";

// ─── Feature identifiers ──────────────────────────────────────────────────────

export type FeatureId =
  // Free tier
  | "live_market_pulse"
  | "ai_narratives"
  | "creator_exports"
  | "watchlists"
  | "market_pages"
  | "seo_hubs"
  | "news_catalysts"
  | "public_terminal"
  // Partner tier
  | "creator_distribution"
  | "partner_analytics"
  | "broadcast_infrastructure"
  | "branded_exports"
  | "priority_signal_routing"
  | "partner_profile"
  | "advanced_volatility_analytics"
  | "export_queue_history"
  | "creator_analytics"
  // API tier
  | "api_endpoints"
  | "structured_data_feed"
  | "ai_feed_access"
  | "provider_integrations"
  | "higher_refresh_limits"
  | "deep_liquidity_scans"
  | "ai_confidence_history"
  // Future (placeholder)
  | "websocket_access"
  | "enterprise_endpoints"
  | "referral_commissions";

// ─── Plan feature display record ──────────────────────────────────────────────

export interface PlanFeatureEntry {
  label: string;
  included: boolean;
  badge?: "soon";
}

// ─── Plan definition ──────────────────────────────────────────────────────────

export interface PlanDefinition {
  id: PlanId;
  name: string;
  monthlyPrice: number | null; // null = free
  annualPrice: number | null;
  tagline: string;
  features: PlanFeatureEntry[];
  accentColor: string;
  accentBorder: string;
  accentBg: string;
  ctaLabel: string;
  ctaHref: string;
  recommended?: boolean;
}

// ─── Usage metrics (future Stripe metering) ───────────────────────────────────

export interface PlanUsage {
  apiCallsUsed: number;
  apiCallsLimit: number | null; // null = unlimited
  exportsGenerated: number;
  watchlistsSaved: number;
  aiScansConsumed: number;
}
