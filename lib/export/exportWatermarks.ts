/**
 * Watermark builders — Sprint 19.
 *
 * Every export includes:
 * - sportsmarketos.com (or ?ref=CODE if partner)
 * - timestamp
 * - "Market intelligence only" compliance note
 *
 * All subtle and premium — never aggressive.
 */

/**
 * Returns the watermark URL string for a given partner code.
 * Plain domain if no code.
 */
export function buildWatermarkUrl(partnerCode?: string): string {
  if (partnerCode) return `sportsmarketos.com?ref=${partnerCode}`;
  return "sportsmarketos.com";
}

/** URL shown in export watermarks. */
export const WATERMARK_URL = "SportsMarketOS.com";

/** CTA tagline shown alongside the URL. */
export const WATERMARK_CTA = "free intelligence, no signup";

/** @deprecated Use WATERMARK_URL + WATERMARK_CTA instead. Kept for any legacy references. */
export const COMPLIANCE_LINE = "SportsMarketOS.com · free intelligence, no signup";

/** Formats a timestamp for export display. */
export function exportTimestamp(iso?: string): string {
  try {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return new Date().toLocaleDateString();
  }
}
