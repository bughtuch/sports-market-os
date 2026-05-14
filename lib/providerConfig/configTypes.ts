export type ProviderMode =
  | "live"
  | "hybrid"
  | "simulation"
  | "planned";

export type ProviderOperationalStatus =
  | "operational"
  | "degraded"
  | "fallback-active"
  | "simulated"
  | "hybrid"
  | "live-ready"
  | "planned";

export type ProviderCategory =
  | "news"
  | "odds"
  | "exchange"
  | "ai"
  | "distribution";

// ─── Provider definition (static, no env reads) ───────────────────────────────

export interface EnvVarDefinition {
  name:        string;
  required:    boolean;
  description: string;
  format:      string; // non-sensitive hint only — e.g. "sk_live_..." or "uuid-v4"
}

export interface ProviderDefinition {
  id:              string;
  name:            string;
  category:        ProviderCategory;
  description:     string;
  envVars:         EnvVarDefinition[];
  supportedModes:  ProviderMode[];
  liveCapable:     boolean;
  hybridCapable:   boolean;
  fallbackCapable: boolean;
  readOnly:        boolean; // read-only data access only — never writes/trades
  complianceNote?: string;
  activationOrder: number; // recommended activation sequence
}

// ─── Runtime readiness (env-derived, server-side only) ────────────────────────

export interface EnvVarStatus {
  name:       string;
  configured: boolean; // never expose the actual value
  required:   boolean;
}

export interface ProviderReadinessState {
  id:               string;
  name:             string;
  category:         ProviderCategory;
  definition:       ProviderDefinition;
  currentMode:      ProviderMode;
  operationalStatus: ProviderOperationalStatus;
  readinessScore:   number; // 0–100
  liveReady:        boolean;
  fallbackActive:   boolean;
  envVarStatuses:   EnvVarStatus[];
  missingRequired:  string[]; // env var names only — never values
  missingOptional:  string[];
}

export interface SystemReadinessSummary {
  providers:                ProviderReadinessState[];
  overallReadiness:         number; // 0–100
  liveReadyCount:           number;
  hybridReadyCount:         number;
  simulatedCount:           number;
  plannedCount:             number;
  missingRequirementsCount: number;
  generatedAt:              string;
}

// ─── Labels ───────────────────────────────────────────────────────────────────

export const PROVIDER_CATEGORY_LABELS: Record<ProviderCategory, string> = {
  news:         "News Feed",
  odds:         "Odds / Pricing",
  exchange:     "Exchange Data",
  ai:           "AI Engine",
  distribution: "Distribution",
};

export const OPERATIONAL_STATUS_COLOR: Record<ProviderOperationalStatus, string> = {
  "operational":    "text-emerald-400",
  "live-ready":     "text-emerald-400",
  "hybrid":         "text-blue-400",
  "simulated":      "text-amber-400",
  "fallback-active":"text-amber-500",
  "degraded":       "text-red-400",
  "planned":        "text-zinc-500",
};

export const OPERATIONAL_STATUS_DOT: Record<ProviderOperationalStatus, string> = {
  "operational":    "bg-emerald-400",
  "live-ready":     "bg-emerald-400",
  "hybrid":         "bg-blue-400",
  "simulated":      "bg-amber-400",
  "fallback-active":"bg-amber-500",
  "degraded":       "bg-red-400",
  "planned":        "bg-zinc-700",
};
