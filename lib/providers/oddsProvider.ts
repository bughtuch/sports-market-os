/**
 * OddsProvider — multi-mode adapter for sports market pricing intelligence.
 *
 * Modes:
 *   simulation — MockProvider data only (no external calls)
 *   hybrid     — live odds merged with simulation (default with API key)
 *   live       — live odds only, simulation fallback on full failure
 *
 * Mode is determined automatically:
 *   - No API key                              → simulation
 *   - Key present + NEXT_PUBLIC_ODDS_MODE=live → live
 *   - Key present, no ODDS_MODE set           → hybrid
 *
 * Env vars:
 *   THE_ODDS_API_KEY       Primary key for The Odds API
 *   ODDS_API_KEY           Fallback key for The Odds API
 *   NEXT_PUBLIC_ODDS_MODE  "simulation" | "hybrid" | "live"
 *
 * Fallback guarantee:
 *   Any failure in live fetch returns simulation data.
 *   Terminal never crashes due to odds provider outage.
 *
 * Compliance:
 *   Read-only market intelligence only. No bet placement, no order routing.
 */

import type { IProvider, OddsSnapshot, DataMode } from "./types";
import { MockProvider } from "./mockProvider";
import { fetchOddsApiSnapshots, getOddsMode, getOddsApiKey } from "./odds/theOddsApiProvider";

const mock = new MockProvider();

// Re-export for use in providerRouter and provider status
export { getOddsMode, getOddsApiKey };

// ─── Result type ──────────────────────────────────────────────────────────────

export interface OddsProviderResult {
  snapshots: OddsSnapshot[];
  mode: DataMode;
  /** True if live fetch was attempted and succeeded (fully or partially) */
  liveSuccess: boolean;
  /** Set if live fetch was attempted but fell back to simulation */
  fallbackReason?: string;
}

// ─── Primary entry point ──────────────────────────────────────────────────────

export async function getOddsWithMode(): Promise<OddsProviderResult> {
  const mode = getOddsMode();

  if (mode === "simulation") {
    const snapshots = await mock.getOddsSnapshots();
    return { snapshots, mode, liveSuccess: false };
  }

  // Attempt live fetch (hybrid or live mode)
  const liveSnapshots = await fetchOddsApiSnapshots();

  if (liveSnapshots && liveSnapshots.length > 0) {
    if (mode === "hybrid") {
      const simSnapshots = await mock.getOddsSnapshots();
      const merged = [...liveSnapshots, ...simSnapshots].slice(0, 10);
      return { snapshots: merged, mode: "hybrid", liveSuccess: true };
    }
    return { snapshots: liveSnapshots, mode: "live", liveSuccess: true };
  }

  // Live failed — fall back to simulation
  const simSnapshots = await mock.getOddsSnapshots();
  return {
    snapshots: simSnapshots,
    mode: "simulation",
    liveSuccess: false,
    fallbackReason: "Live odds fetch failed — using simulation data",
  };
}

// ─── Legacy helpers (kept for backward compat) ────────────────────────────────

export async function getOddsSnapshots(): Promise<OddsSnapshot[]> {
  const result = await getOddsWithMode();
  return result.snapshots;
}

export async function getOddsFromProvider(provider: IProvider): Promise<OddsSnapshot[]> {
  return provider.getOddsSnapshots();
}
