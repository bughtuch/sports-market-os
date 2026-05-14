/**
 * notificationTemplates.ts — Template engine for notification content.
 *
 * Each template returns subject, title, body, and shortBody suitable
 * for different delivery channels (email subject vs push title vs in-app body).
 * All content is market intelligence only — not financial advice.
 */

import type { NotificationType, NotificationSeverity } from "./notificationTypes";

export interface NotificationTemplate {
  subject:   string;   // Email subject line
  title:     string;   // Push / in-app title
  body:      string;   // Full body (email, telegram)
  shortBody: string;   // Short body (push, in-app preview)
  severity:  NotificationSeverity;
}

// ─── Template context ─────────────────────────────────────────────────────────

export interface TemplateContext {
  sport?:      string;
  market?:     string;
  value?:      number | string;
  threshold?:  number | string;
  regime?:     string;
  brief_type?: string;
  platform?:   string;
}

// ─── Template builders ────────────────────────────────────────────────────────

const TEMPLATES: Record<NotificationType, (ctx: TemplateContext) => NotificationTemplate> = {
  "volatility-spike": (ctx) => ({
    subject:   `Volatility Alert — ${ctx.sport ?? "Market"}`,
    title:     `Volatility Spike${ctx.market ? ` — ${ctx.market}` : ""}`,
    body:      `Implied volatility crossed +${ctx.value ?? "2.0"}σ threshold${ctx.market ? ` on ${ctx.market}` : ""}${ctx.sport ? ` (${ctx.sport})` : ""}. Monitor for price movement. Not financial advice.`,
    shortBody: `IV +${ctx.value ?? "2.0"}σ${ctx.market ? ` on ${ctx.market}` : ""}`,
    severity:  "high",
  }),

  "liquidity-anomaly": (ctx) => ({
    subject:   `Liquidity Warning — ${ctx.sport ?? "Market"}`,
    title:     `Liquidity Anomaly${ctx.market ? ` — ${ctx.market}` : ""}`,
    body:      `Thin liquidity detected${ctx.market ? ` on ${ctx.market}` : ""}. Depth: ${ctx.value ?? "below threshold"}. Approach with caution. Market intelligence only.`,
    shortBody: `Thin liquidity${ctx.market ? ` on ${ctx.market}` : ""}`,
    severity:  "warning",
  }),

  "catalyst-detected": (ctx) => ({
    subject:   `Catalyst Alert — ${ctx.sport ?? "Market"}`,
    title:     `Catalyst Detected${ctx.sport ? ` — ${ctx.sport}` : ""}`,
    body:      `High-severity news catalyst detected${ctx.market ? ` for ${ctx.market}` : ""}${ctx.sport ? ` (${ctx.sport})` : ""}. Monitor for price impact. Not financial advice.`,
    shortBody: `Catalyst event${ctx.sport ? ` in ${ctx.sport}` : ""}`,
    severity:  "high",
  }),

  "daily-brief-ready": (ctx) => ({
    subject:   `Your ${ctx.brief_type ?? "Daily"} Intelligence Brief`,
    title:     `${ctx.brief_type ?? "Daily"} Brief Ready`,
    body:      `Your personalised ${ctx.brief_type?.toLowerCase() ?? "daily"} intelligence brief is ready. Market signals, regime analysis, and watchlist summary. Market intelligence only.`,
    shortBody: `${ctx.brief_type ?? "Daily"} brief ready — tap to view`,
    severity:  "info",
  }),

  "queue-deterioration": (ctx) => ({
    subject:   `Queue Health Warning — ${ctx.market ?? ctx.sport ?? "Market"}`,
    title:     `Queue Deterioration${ctx.market ? ` — ${ctx.market}` : ""}`,
    body:      `Betfair queue depth falling${ctx.market ? ` on ${ctx.market}` : ""}. Health: ${ctx.value ?? "below threshold"}. Not consistent with normal pre-event withdrawal. Market intelligence only.`,
    shortBody: `Queue health${ctx.value ? ` at ${ctx.value}` : " deteriorating"}${ctx.market ? ` on ${ctx.market}` : ""}`,
    severity:  "warning",
  }),

  "ai-regime-shift": (ctx) => ({
    subject:   `Regime Change — ${ctx.sport ?? "Market"}`,
    title:     `AI Regime Shift${ctx.sport ? ` — ${ctx.sport}` : ""}`,
    body:      `AI regime classification changed${ctx.sport ? ` for ${ctx.sport}` : ""}${ctx.regime ? `. New regime: ${ctx.regime}` : ""}. Reassess monitored markets. Market intelligence only.`,
    shortBody: `Regime changed${ctx.regime ? ` → ${ctx.regime}` : ""}${ctx.sport ? ` (${ctx.sport})` : ""}`,
    severity:  "info",
  }),

  "creator-export-ready": (ctx) => ({
    subject:   `Your Export Is Ready`,
    title:     `Export Ready${ctx.platform ? ` — ${ctx.platform}` : ""}`,
    body:      `Your market intelligence export is ready for distribution${ctx.platform ? ` on ${ctx.platform}` : ""}. Content includes compliance watermarks. Market intelligence only.`,
    shortBody: `Export ready${ctx.platform ? ` for ${ctx.platform}` : ""}`,
    severity:  "info",
  }),

  "watchlist-anomaly": (ctx) => ({
    subject:   `Watchlist Movement — ${ctx.market ?? ctx.sport ?? "Market"}`,
    title:     `Watchlist Anomaly${ctx.market ? ` — ${ctx.market}` : ""}`,
    body:      `Significant movement detected on watchlisted market${ctx.market ? ` ${ctx.market}` : ""}${ctx.value ? ` (${ctx.value}% move)` : ""}. Market intelligence only.`,
    shortBody: `Watchlist: ${ctx.market ?? "market"} moving${ctx.value ? ` ${ctx.value}%` : ""}`,
    severity:  "warning",
  }),

  "exchange-flow-shift": (ctx) => ({
    subject:   `Exchange Flow Rotation — ${ctx.sport ?? "Market"}`,
    title:     `Flow Shift${ctx.sport ? ` — ${ctx.sport}` : ""}`,
    body:      `Institutional flow rotation detected${ctx.sport ? ` in ${ctx.sport}` : ""}${ctx.value ? `. ${ctx.value}th percentile flow event.` : "."} Market intelligence only.`,
    shortBody: `Flow rotation${ctx.sport ? ` in ${ctx.sport}` : ""}${ctx.value ? ` — ${ctx.value}th pct` : ""}`,
    severity:  "warning",
  }),

  "alert-rule-triggered": (ctx) => ({
    subject:   `Alert Rule Triggered — ${ctx.market ?? ctx.sport ?? "Market"}`,
    title:     `Rule Triggered${ctx.market ? ` — ${ctx.market}` : ""}`,
    body:      `One of your persistent alert rules fired${ctx.market ? ` on ${ctx.market}` : ""}${ctx.sport ? ` (${ctx.sport})` : ""}. View in Alert Center. Market intelligence only.`,
    shortBody: `Alert rule fired${ctx.market ? ` on ${ctx.market}` : ""}`,
    severity:  "warning",
  }),
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function buildTemplate(
  type: NotificationType,
  ctx: TemplateContext = {},
): NotificationTemplate {
  const builder = TEMPLATES[type];
  return builder(ctx);
}

export function getTemplatePreview(type: NotificationType): NotificationTemplate {
  return buildTemplate(type, {
    sport:  "Horse Racing",
    market: "Ascot 2.40",
    value:  "2.8",
  });
}
