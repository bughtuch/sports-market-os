/**
 * onboardingRecommendations.ts — Generates personalised recommendations
 * based on completed user onboarding preferences.
 *
 * Used post-onboarding to surface relevant watchlists, markets, alerts,
 * and creator workflows. Pure functions — no side effects.
 */

import type { UserPreferences, SportSelection, IntelligenceFocus } from "./onboardingTypes";
import { SPORT_STARTER_WATCHLISTS } from "./onboardingConfig";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WatchlistSeed {
  name:        string;
  sport:       SportSelection;
  description: string;
  markets:     string[];
}

export interface MarketRecommendation {
  name:     string;
  sport:    SportSelection;
  reason:   string;
  priority: "high" | "medium" | "low";
}

export interface AlertRecommendation {
  label:    string;
  category: string;
  reason:   string;
}

export interface CreatorWorkflow {
  name:        string;
  platforms:   string[];
  description: string;
}

export interface OnboardingRecommendations {
  watchlistSeeds:      WatchlistSeed[];
  marketSuggestions:   MarketRecommendation[];
  alertSuggestions:    AlertRecommendation[];
  creatorWorkflows:    CreatorWorkflow[];
  intelligenceHints:   string[];
}

// ─── Market seed pools per sport ─────────────────────────────────────────────

const SPORT_MARKETS: Record<SportSelection, string[]> = {
  "Horse Racing":       ["Ascot 2.40 — Win", "Cheltenham 3.15 — Win", "Goodwood 4.00 — Each Way"],
  "Tennis":             ["Djokovic vs Alcaraz — Match", "Swiatek vs Sabalenka — Set Betting"],
  "NBA":                ["Warriors vs Lakers — Spread", "NBA Eastern Conference — Totals"],
  "NFL":                ["Chiefs vs Bills — Total", "Eagles vs Cowboys — Spread"],
  "UFC":                ["UFC 300 — Main Event", "UFC 300 — Co-Main Event"],
  "Football":           ["Man City vs Arsenal — Asian Handicap", "El Clasico — Match Result"],
  "Prediction Markets": ["US Election — Winner", "Fed Rate Decision — Contract"],
};

// ─── Intelligence hints per focus ────────────────────────────────────────────

const FOCUS_HINTS: Record<IntelligenceFocus, string> = {
  "volatility":         "IV spikes often precede 4–8% price moves. Check Volatility section in your daily brief.",
  "liquidity":          "Queue depth below 30% signals thin markets — approach with caution.",
  "exchange-flow":      "Sharp-side rotation is most detectable 90–120 minutes pre-event.",
  "ai-narratives":      "AI regime assessments update every 4 hours. Morning brief has the highest signal density.",
  "creator-signals":    "Export your top signals daily to build audience trust. Consistent cadence outperforms viral bursts.",
  "queue-health":       "Betfair queue health degrades fastest in the 10 minutes before race-off — monitor closely.",
  "market-regimes":     "Regime changes often cluster — a shift in one market predicts adjacent market moves.",
  "prediction-markets": "Polymarket consensus drifts from Kalshi most during breaking-news windows.",
};

// ─── Watchlist seed generator ─────────────────────────────────────────────────

export function generateWatchlistSeeds(prefs: UserPreferences): WatchlistSeed[] {
  return prefs.favorite_sports.map((sport) => ({
    name:        SPORT_STARTER_WATCHLISTS[sport],
    sport,
    description: `Starter watchlist for ${sport} — tracking key markets and sharp-side signals.`,
    markets:     SPORT_MARKETS[sport],
  }));
}

// ─── Market recommendations ───────────────────────────────────────────────────

export function generateMarketRecommendations(prefs: UserPreferences): MarketRecommendation[] {
  const recs: MarketRecommendation[] = [];
  const primarySport = prefs.favorite_sports[0];

  prefs.favorite_sports.forEach((sport, idx) => {
    const markets = SPORT_MARKETS[sport];
    markets.slice(0, 2).forEach((market) => {
      recs.push({
        name:     market,
        sport,
        reason:   idx === 0 ? "Your primary sport" : `Matches your ${sport} selection`,
        priority: idx === 0 ? "high" : "medium",
      });
    });
  });

  if (prefs.intelligence_focus.includes("volatility") && primarySport) {
    recs.push({
      name:     SPORT_MARKETS[primarySport][0],
      sport:    primarySport,
      reason:   "High volatility profile — matches your volatility focus",
      priority: "high",
    });
  }

  // Deduplicate by name
  const seen = new Set<string>();
  return recs.filter((r) => {
    if (seen.has(r.name)) return false;
    seen.add(r.name);
    return true;
  });
}

// ─── Alert recommendations ────────────────────────────────────────────────────

export function generateAlertRecommendations(prefs: UserPreferences): AlertRecommendation[] {
  const recs: AlertRecommendation[] = [];

  if (prefs.intelligence_focus.includes("volatility") || prefs.favorite_sports.includes("Horse Racing")) {
    recs.push({ label: "Volatility Spikes", category: "volatility-spike", reason: "Matches your volatility focus or Horse Racing selection." });
  }
  if (prefs.intelligence_focus.includes("liquidity") || prefs.intelligence_focus.includes("queue-health")) {
    recs.push({ label: "Liquidity Anomalies", category: "liquidity-anomalies", reason: "Matches your liquidity or queue-health focus." });
  }
  if (prefs.intelligence_focus.includes("exchange-flow")) {
    recs.push({ label: "Exchange Flow Shifts", category: "exchange-flow", reason: "Matches your exchange flow focus." });
  }
  if (prefs.intelligence_focus.includes("ai-narratives") || prefs.intelligence_focus.includes("market-regimes")) {
    recs.push({ label: "AI Confidence", category: "ai-confidence", reason: "Matches your AI intelligence focus." });
  }

  recs.push({ label: "Daily Brief", category: "daily-brief", reason: "Recommended for all users — keeps you on top of market shifts." });

  return recs;
}

// ─── Creator workflow recommendations ────────────────────────────────────────

export function generateCreatorWorkflows(prefs: UserPreferences): CreatorWorkflow[] {
  if (!prefs.creator_mode || prefs.export_preferences.length === 0) return [];

  const workflows: CreatorWorkflow[] = [];

  if (prefs.export_preferences.includes("x-twitter") || prefs.export_preferences.includes("telegram")) {
    workflows.push({
      name:        "Pre-Event Signal Drop",
      platforms:   prefs.export_preferences.filter((p) => ["x-twitter", "telegram"].includes(p)),
      description: "Export the top 3 signals 90 minutes before major events. Drives highest engagement.",
    });
  }
  if (prefs.export_preferences.includes("shorts") || prefs.export_preferences.includes("instagram")) {
    workflows.push({
      name:        "Morning Brief Clip",
      platforms:   prefs.export_preferences.filter((p) => ["shorts", "instagram"].includes(p)),
      description: "Convert the morning AI brief into a 60-second vertical video script. Consistent daily output.",
    });
  }
  if (prefs.export_preferences.includes("discord") || prefs.export_preferences.includes("reddit")) {
    workflows.push({
      name:        "Deep Market Analysis Post",
      platforms:   prefs.export_preferences.filter((p) => ["discord", "reddit"].includes(p)),
      description: "Post long-form exchange flow analysis with IV data and regime context.",
    });
  }

  return workflows;
}

// ─── Intelligence hints ───────────────────────────────────────────────────────

export function generateIntelligenceHints(prefs: UserPreferences): string[] {
  return prefs.intelligence_focus.map((focus) => FOCUS_HINTS[focus]).filter(Boolean);
}

// ─── Master builder ───────────────────────────────────────────────────────────

export function buildOnboardingRecommendations(prefs: UserPreferences): OnboardingRecommendations {
  return {
    watchlistSeeds:    generateWatchlistSeeds(prefs),
    marketSuggestions: generateMarketRecommendations(prefs),
    alertSuggestions:  generateAlertRecommendations(prefs),
    creatorWorkflows:  generateCreatorWorkflows(prefs),
    intelligenceHints: generateIntelligenceHints(prefs),
  };
}
