/**
 * Referral utility functions — pure, no side effects.
 *
 * All functions are safe to call on server or client.
 * No external dependencies — Supabase calls are in partnerTracking.ts.
 */

import type { ReferralCapture } from "./partnerTypes";

// ─── Constants ────────────────────────────────────────────────────────────────

export const REFERRAL_STORAGE_KEY = "sportsmarketos_ref";
export const BASE_URL = "https://sportsmarketos.com";
export const REF_PARAM = "ref";

// ─── Code generation ──────────────────────────────────────────────────────────

/**
 * Generates a deterministic partner code from a seed string (typically user ID).
 * Format: 8 uppercase alphanumeric characters.
 * Deterministic — same seed always produces same code.
 */
export function generatePartnerCode(seed: string): string {
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid ambiguity
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  let code = "";
  let n = Math.abs(hash);
  for (let i = 0; i < 8; i++) {
    code += CHARS[n % CHARS.length];
    n = Math.floor(n / CHARS.length) + seed.charCodeAt(i % seed.length);
  }
  return code;
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

/** Builds a full referral URL: https://sportsmarketos.com?ref=CODE */
export function buildReferralUrl(partnerCode: string): string {
  return `${BASE_URL}?${REF_PARAM}=${encodeURIComponent(partnerCode)}`;
}

/** Extracts the short referral suffix for display: sportsmarketos.com?ref=CODE */
export function buildReferralDisplay(partnerCode: string): string {
  return `sportsmarketos.com?ref=${partnerCode}`;
}

/**
 * Parses a referral code from a URL search string.
 * Returns null if no valid code found.
 */
export function parseReferralCode(search: string): string | null {
  try {
    const params = new URLSearchParams(search);
    const code = params.get(REF_PARAM);
    if (!code) return null;
    // Basic validation: 1–32 alphanumeric chars
    if (!/^[A-Z0-9a-z_-]{1,32}$/.test(code)) return null;
    return code.toUpperCase();
  } catch {
    return null;
  }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

/** Reads stored referral capture from localStorage. Returns null if not found / unavailable. */
export function getStoredReferral(): ReferralCapture | null {
  try {
    const raw = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReferralCapture;
  } catch {
    return null;
  }
}

/** Stores a referral capture in localStorage. Silently ignores errors. */
export function storeReferral(capture: ReferralCapture): void {
  try {
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(capture));
  } catch {
    // localStorage unavailable — no-op
  }
}

/** Clears stored referral from localStorage. */
export function clearStoredReferral(): void {
  try {
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
  } catch {
    // no-op
  }
}

// ─── Display helpers ──────────────────────────────────────────────────────────

/** Formats a metric number for display: 1234567 → "1.2M", 12345 → "12.3K" */
export function formatMetricValue(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
