/**
 * betfairTracking.ts — Outbound Betfair click tracking.
 *
 * Records routing events to localStorage for session analytics.
 * Supabase persistence shell is included but gated — activate by
 * setting NEXT_PUBLIC_BETFAIR_TRACKING_ENABLED=true.
 *
 * Client-side only — import from "use client" components.
 */

export interface BetfairClickEvent {
  sport:     string;
  marketId?: string;
  url:       string;
  source:    "signal_card" | "market_page" | "hero" | "account" | "ladder" | "paper_trading";
  ts:        number;
}

const STORAGE_KEY = "smo_betfair_clicks";
const MAX_LOCAL   = 50;

/** Fire-and-forget click tracking. Never throws. */
export function trackBetfairClick(event: BetfairClickEvent): void {
  try {
    // localStorage ring-buffer
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: BetfairClickEvent[] = raw ? (JSON.parse(raw) as BetfairClickEvent[]) : [];
    const updated = [event, ...existing].slice(0, MAX_LOCAL);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // storage unavailable — silently ignore
  }
}

/** Read the local click history. Returns [] if unavailable. */
export function getLocalBetfairClicks(): BetfairClickEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BetfairClickEvent[]) : [];
  } catch {
    return [];
  }
}
