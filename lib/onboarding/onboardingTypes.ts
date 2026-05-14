export type SportSelection =
  | "Horse Racing"
  | "Tennis"
  | "NBA"
  | "NFL"
  | "UFC"
  | "Football"
  | "Prediction Markets";

export type IntelligenceFocus =
  | "volatility"
  | "liquidity"
  | "exchange-flow"
  | "ai-narratives"
  | "creator-signals"
  | "queue-health"
  | "market-regimes"
  | "prediction-markets";

export type AlertPreference =
  | "volatility-spikes"
  | "liquidity-anomalies"
  | "catalyst-alerts"
  | "ai-confidence"
  | "exchange-flow"
  | "daily-brief";

export type ExportPlatform =
  | "x-twitter"
  | "telegram"
  | "shorts"
  | "instagram"
  | "discord"
  | "reddit";

export interface UserPreferences {
  user_id?:              string;
  favorite_sports:       SportSelection[];
  intelligence_focus:    IntelligenceFocus[];
  creator_mode:          boolean;
  alert_preferences:     AlertPreference[];
  export_preferences:    ExportPlatform[];
  onboarding_completed:  boolean;
  created_at?:           string;
  updated_at?:           string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  favorite_sports:      [],
  intelligence_focus:   [],
  creator_mode:         false,
  alert_preferences:    [],
  export_preferences:   [],
  onboarding_completed: false,
};

// ─── localStorage keys ────────────────────────────────────────────────────────

export const ONBOARDING_STORAGE_KEY     = "smos_onboarding_completed";
export const PREFERENCES_STORAGE_KEY    = "smos_user_preferences";
export const ONBOARDING_PROGRESS_KEY    = "smos_onboarding_progress";

// ─── Step definitions ─────────────────────────────────────────────────────────

export type OnboardingStepId =
  | "sports"
  | "intelligence"
  | "creator"
  | "alerts"
  | "exports"
  | "complete";

export interface OnboardingStep {
  id:          OnboardingStepId;
  title:       string;
  description: string;
  index:       number;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: "sports",       index: 0, title: "Your Markets",         description: "Select the sports you want to monitor." },
  { id: "intelligence", index: 1, title: "Intelligence Focus",   description: "Choose your intelligence priorities." },
  { id: "creator",      index: 2, title: "Creator Mode",         description: "Are you creating content from market signals?" },
  { id: "alerts",       index: 3, title: "Alert Preferences",    description: "What events do you want to be alerted about?" },
  { id: "exports",      index: 4, title: "Export Platforms",     description: "Where do you distribute intelligence?" },
  { id: "complete",     index: 5, title: "Setup Complete",       description: "Your personalised intelligence is ready." },
];
