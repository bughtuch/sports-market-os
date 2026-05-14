/**
 * GET /api/email/templates?type=<type>
 * Returns a rendered HTML preview for a given email type.
 * Used by /email-preview (dev/testing page, noindexed).
 */

import { NextResponse } from "next/server";
import {
  renderDailyBriefEmail,
  renderAlertEmail,
  renderWelcomeEmail,
  renderOnboardingCompleteEmail,
  renderSystemStatusWarningEmail,
  renderCreatorExportReadyEmail,
  renderEmailTestEmail,
} from "@/lib/email/emailRenderer";

export const dynamic = "force-dynamic";

const PREVIEW_DATA = {
  "email-test": () => renderEmailTestEmail("preview@sportsmarketos.com"),

  "daily-brief": () => renderDailyBriefEmail({
    briefType:        "Morning",
    title:            "Morning Intelligence Brief",
    subtitle:         "Sports Market OS · Market Intelligence",
    aiRegimeSummary:  "High-Volatility Trending — Horse Racing leading. Betfair book compression elevated.",
    topSignalTitles:  ["Ascot 2.40 σ=2.8", "Goodwood 3.15 σ=1.6"],
    catalysts:        ["Trainer switch confirmed — Ascot 2.40", "Heavy going forecast — Goodwood"],
    volatilityNote:   "Horse Racing elevated. σ=2.3 above 30-day mean.",
    exchangeFlowNote: "Betfair Exchange dominant at 72% of total flow.",
    watchlistNote:    "4 watched markets have active signals.",
    generatedAt:      new Date().toISOString(),
  }),

  "alert": () => renderAlertEmail({
    alertType:   "Volatility Spike",
    title:       "Volatility Spike — Champions League Final",
    body:        "Implied volatility crossed 2.8σ — unusual pre-match price movement detected. Rule threshold: 2.5σ.",
    severity:    "high",
    sport:       "Football",
    market:      "Champions League Final",
    triggeredAt: new Date().toISOString(),
  }),

  "welcome": () => renderWelcomeEmail("user@example.com"),

  "onboarding-complete": () => renderOnboardingCompleteEmail("user@example.com", [
    "Horse Racing", "Football", "Tennis",
  ]),

  "system-status-warning": () => renderSystemStatusWarningEmail(61, [
    "Betfair Exchange", "Betdaq",
  ]),

  "creator-export-ready": () => renderCreatorExportReadyEmail("Substack"),
} as const;

type PreviewType = keyof typeof PREVIEW_DATA;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") ?? "welcome") as PreviewType;

  if (!(type in PREVIEW_DATA)) {
    return NextResponse.json(
      { error: `Unknown template type. Available: ${Object.keys(PREVIEW_DATA).join(", ")}` },
      { status: 400 },
    );
  }

  const { subject, html } = PREVIEW_DATA[type]();

  const format = searchParams.get("format") ?? "json";
  if (format === "html") {
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return NextResponse.json({ type, subject, html, availableTypes: Object.keys(PREVIEW_DATA) });
}
