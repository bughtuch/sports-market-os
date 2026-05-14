/**
 * emailRenderer.ts — HTML email builder with Bloomberg-terminal aesthetic.
 *
 * All emails use inline styles, table-based layout, and monospace typography
 * compatible with all major email clients. Black/white palette.
 * No external CSS, no JavaScript, no images.
 */

import { getAppUrl } from "./resendClient";

// ─── Base layout ──────────────────────────────────────────────────────────────

function baseLayout(content: string, subject: string): string {
  const appUrl = getAppUrl();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="color-scheme" content="dark">
<title>${escHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:'Courier New',Courier,monospace;-webkit-text-size-adjust:100%;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#000000;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="padding-bottom:20px;border-bottom:1px solid #27272a;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <span style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.08em;font-family:'Courier New',Courier,monospace;">SPORTS MARKET OS</span>
                  <span style="color:#52525b;font-size:11px;font-family:'Courier New',Courier,monospace;"> · INTELLIGENCE TERMINAL</span>
                </td>
                <td align="right">
                  <span style="color:#3f3f46;font-size:9px;font-family:'Courier New',Courier,monospace;letter-spacing:0.06em;">MARKET INTELLIGENCE</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding-top:28px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:32px;border-top:1px solid #18181b;margin-top:32px;">
            <p style="color:#3f3f46;font-size:9px;font-family:'Courier New',Courier,monospace;margin:0 0 4px;line-height:1.6;">
              Market intelligence only &middot; Not financial advice &middot; Not investment or betting advice.
            </p>
            <p style="color:#3f3f46;font-size:9px;font-family:'Courier New',Courier,monospace;margin:0 0 4px;line-height:1.6;">
              Sports Market OS &middot; support@sportsmarketos.com
            </p>
            <p style="color:#3f3f46;font-size:9px;font-family:'Courier New',Courier,monospace;margin:0;line-height:1.6;">
              <a href="${appUrl}/notification-settings" style="color:#52525b;text-decoration:underline;">Manage notification preferences</a>
              &nbsp;&middot;&nbsp;
              <a href="${appUrl}/notification-settings" style="color:#52525b;text-decoration:underline;">Unsubscribe</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sectionLabel(label: string): string {
  return `<p style="color:#52525b;font-size:9px;font-family:'Courier New',Courier,monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 10px;border-bottom:1px solid #18181b;padding-bottom:6px;">${escHtml(label)}</p>`;
}

function chip(text: string, color = "#3f3f46"): string {
  return `<span style="display:inline-block;background-color:#09090b;border:1px solid #27272a;color:${color};font-size:9px;font-family:'Courier New',Courier,monospace;padding:2px 8px;margin:2px 2px 2px 0;">${escHtml(text)}</span>`;
}

function severityColor(severity: string): string {
  if (severity === "critical") return "#f87171";
  if (severity === "high")     return "#fb923c";
  if (severity === "warning")  return "#fbbf24";
  return "#60a5fa";
}

// ─── Email template renderers ─────────────────────────────────────────────────

export interface DailyBriefEmailData {
  briefType:        string;
  title:            string;
  subtitle:         string;
  aiRegimeSummary:  string;
  topSignalTitles:  string[];
  catalysts:        string[];
  volatilityNote:   string;
  exchangeFlowNote: string;
  watchlistNote:    string;
  generatedAt:      string;
}

export function renderDailyBriefEmail(data: DailyBriefEmailData): { subject: string; html: string } {
  const subject = `${data.briefType} — Sports Market OS Intelligence Brief`;
  const appUrl  = getAppUrl();

  const content = `
    <p style="color:#52525b;font-size:9px;font-family:'Courier New',Courier,monospace;margin:0 0 4px;letter-spacing:0.06em;text-transform:uppercase;">${escHtml(data.briefType)}</p>
    <h1 style="color:#ffffff;font-size:18px;font-family:'Courier New',Courier,monospace;font-weight:700;margin:0 0 6px;line-height:1.3;">${escHtml(data.title)}</h1>
    <p style="color:#71717a;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0 0 28px;line-height:1.5;">${escHtml(data.subtitle)}</p>

    <!-- AI Regime -->
    <div style="margin-bottom:24px;">
      ${sectionLabel("AI Regime Assessment")}
      <p style="color:#a1a1aa;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0;line-height:1.7;">${escHtml(data.aiRegimeSummary)}</p>
    </div>

    <!-- Top Signals -->
    <div style="margin-bottom:24px;">
      ${sectionLabel("Top Signals")}
      ${data.topSignalTitles.map((s, i) =>
        `<p style="color:#e4e4e7;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0 0 6px;line-height:1.5;">
          <span style="color:#52525b;">${i + 1}.</span> ${escHtml(s)}
        </p>`
      ).join("")}
    </div>

    <!-- Catalysts -->
    ${data.catalysts.length > 0 ? `
    <div style="margin-bottom:24px;">
      ${sectionLabel("Catalyst Events")}
      <div style="margin-top:2px;">
        ${data.catalysts.map(c => chip(c, "#fbbf24")).join(" ")}
      </div>
    </div>` : ""}

    <!-- Volatility -->
    <div style="margin-bottom:24px;">
      ${sectionLabel("Volatility")}
      <p style="color:#a1a1aa;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0;line-height:1.7;">${escHtml(data.volatilityNote)}</p>
    </div>

    <!-- Exchange Flow -->
    <div style="margin-bottom:24px;">
      ${sectionLabel("Exchange Flow")}
      <p style="color:#a1a1aa;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0;line-height:1.7;">${escHtml(data.exchangeFlowNote)}</p>
    </div>

    <!-- Watchlist -->
    <div style="margin-bottom:28px;">
      ${sectionLabel("Watchlist")}
      <p style="color:#a1a1aa;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0;line-height:1.7;">${escHtml(data.watchlistNote)}</p>
    </div>

    <!-- CTA -->
    <div style="margin-bottom:8px;">
      <a href="${appUrl}/terminal" style="display:inline-block;background-color:#ffffff;color:#000000;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;padding:10px 24px;text-decoration:none;letter-spacing:0.04em;">→ Open Terminal</a>
      &nbsp;&nbsp;
      <a href="${appUrl}/daily-brief" style="display:inline-block;background-color:#09090b;border:1px solid #27272a;color:#a1a1aa;font-family:'Courier New',Courier,monospace;font-size:11px;padding:10px 24px;text-decoration:none;">Full Brief</a>
    </div>
    <p style="color:#3f3f46;font-size:9px;font-family:'Courier New',Courier,monospace;margin:12px 0 0;">Generated: ${escHtml(new Date(data.generatedAt).toUTCString())}</p>
  `;

  return { subject, html: baseLayout(content, subject) };
}

export interface AlertEmailData {
  alertType:   string;
  title:       string;
  body:        string;
  severity:    string;
  sport?:      string;
  market?:     string;
  triggeredAt: string;
}

export function renderAlertEmail(data: AlertEmailData): { subject: string; html: string } {
  const subject  = `${data.severity.toUpperCase()}: ${data.title} — Sports Market OS`;
  const appUrl   = getAppUrl();
  const sevColor = severityColor(data.severity);

  const content = `
    <div style="border-left:3px solid ${sevColor};padding-left:14px;margin-bottom:24px;">
      <p style="color:${sevColor};font-size:9px;font-family:'Courier New',Courier,monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 6px;">${escHtml(data.severity)} · ${escHtml(data.alertType)}</p>
      <h1 style="color:#ffffff;font-size:16px;font-family:'Courier New',Courier,monospace;font-weight:700;margin:0 0 10px;line-height:1.3;">${escHtml(data.title)}</h1>
      <p style="color:#a1a1aa;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0;line-height:1.7;">${escHtml(data.body)}</p>
    </div>

    ${(data.sport || data.market) ? `
    <div style="margin-bottom:20px;">
      ${data.sport  ? chip(data.sport,  "#71717a") : ""}
      ${data.market ? chip(data.market, "#71717a") : ""}
    </div>` : ""}

    <div style="margin-bottom:8px;">
      <a href="${appUrl}/alerts" style="display:inline-block;background-color:#ffffff;color:#000000;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;padding:10px 24px;text-decoration:none;letter-spacing:0.04em;">→ View in Alert Center</a>
    </div>
    <p style="color:#3f3f46;font-size:9px;font-family:'Courier New',Courier,monospace;margin:12px 0 0;">Triggered: ${escHtml(new Date(data.triggeredAt).toUTCString())}</p>
  `;

  return { subject, html: baseLayout(content, subject) };
}

export function renderWelcomeEmail(email: string): { subject: string; html: string } {
  const subject = "Welcome to Sports Market OS";
  const appUrl  = getAppUrl();

  const content = `
    <h1 style="color:#ffffff;font-size:20px;font-family:'Courier New',Courier,monospace;font-weight:700;margin:0 0 6px;">Welcome to Sports Market OS</h1>
    <p style="color:#71717a;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0 0 28px;line-height:1.5;">Your intelligence terminal is active.</p>

    <div style="margin-bottom:24px;">
      ${sectionLabel("What you have access to")}
      ${[
        "Live market intelligence across 7 sports verticals",
        "AI regime assessment and narrative generation",
        "Volatility, liquidity, and exchange flow signals",
        "Daily brief — morning, midday, and overnight",
        "Persistent alert rules with threshold monitoring",
        "Creator export templates for 6 distribution platforms",
      ].map(item =>
        `<p style="color:#a1a1aa;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0 0 6px;line-height:1.5;">· ${escHtml(item)}</p>`
      ).join("")}
    </div>

    <div style="margin-bottom:28px;">
      ${sectionLabel("Get started")}
      <p style="color:#71717a;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0 0 8px;line-height:1.5;">
        Complete your setup to personalise your intelligence feed for your sports and focus areas.
      </p>
    </div>

    <div style="margin-bottom:8px;">
      <a href="${appUrl}/onboarding" style="display:inline-block;background-color:#ffffff;color:#000000;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;padding:10px 24px;text-decoration:none;letter-spacing:0.04em;">→ Complete Setup</a>
      &nbsp;&nbsp;
      <a href="${appUrl}/terminal" style="display:inline-block;background-color:#09090b;border:1px solid #27272a;color:#a1a1aa;font-family:'Courier New',Courier,monospace;font-size:11px;padding:10px 24px;text-decoration:none;">Open Terminal</a>
    </div>
    <p style="color:#3f3f46;font-size:9px;font-family:'Courier New',Courier,monospace;margin:12px 0 0;">Signed in as: ${escHtml(email)}</p>
  `;

  return { subject, html: baseLayout(content, subject) };
}

export function renderOnboardingCompleteEmail(
  email: string,
  sports: string[],
): { subject: string; html: string } {
  const subject = "Intelligence Terminal Configured — Sports Market OS";
  const appUrl  = getAppUrl();

  const content = `
    <p style="color:#52525b;font-size:9px;font-family:'Courier New',Courier,monospace;margin:0 0 4px;letter-spacing:0.06em;text-transform:uppercase;">Setup Complete</p>
    <h1 style="color:#ffffff;font-size:18px;font-family:'Courier New',Courier,monospace;font-weight:700;margin:0 0 6px;line-height:1.3;">Intelligence Terminal Configured</h1>
    <p style="color:#71717a;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0 0 28px;line-height:1.5;">Your personalised market intelligence is ready.</p>

    ${sports.length > 0 ? `
    <div style="margin-bottom:24px;">
      ${sectionLabel("Markets Configured")}
      <div style="margin-top:2px;">
        ${sports.map(s => chip(s, "#a1a1aa")).join(" ")}
      </div>
    </div>` : ""}

    <div style="margin-bottom:28px;">
      ${sectionLabel("What's active")}
      ${[
        "Daily intelligence brief — personalised to your markets",
        "Alert rules — threshold monitoring across your sports",
        "Watchlists — seeded for each selected market",
      ].map(item =>
        `<p style="color:#a1a1aa;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0 0 6px;line-height:1.5;"><span style="color:#34d399;">✓</span> ${escHtml(item)}</p>`
      ).join("")}
    </div>

    <div style="margin-bottom:8px;">
      <a href="${appUrl}/terminal" style="display:inline-block;background-color:#ffffff;color:#000000;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;padding:10px 24px;text-decoration:none;letter-spacing:0.04em;">→ Open Terminal</a>
    </div>
  `;

  return { subject, html: baseLayout(content, subject) };
}

export function renderSystemStatusWarningEmail(
  healthScore: number,
  degradedProviders: string[],
): { subject: string; html: string } {
  const subject = `System Alert: Health Score ${healthScore}% — Sports Market OS`;
  const appUrl  = getAppUrl();

  const content = `
    <div style="border-left:3px solid #fbbf24;padding-left:14px;margin-bottom:24px;">
      <p style="color:#fbbf24;font-size:9px;font-family:'Courier New',Courier,monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 6px;">SYSTEM WARNING</p>
      <h1 style="color:#ffffff;font-size:16px;font-family:'Courier New',Courier,monospace;font-weight:700;margin:0 0 10px;line-height:1.3;">Provider Health Degraded</h1>
      <p style="color:#a1a1aa;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0;line-height:1.7;">System health score: <span style="color:#fbbf24;font-weight:700;">${healthScore}%</span>. One or more intelligence providers are operating in degraded or fallback mode.</p>
    </div>

    ${degradedProviders.length > 0 ? `
    <div style="margin-bottom:24px;">
      ${sectionLabel("Affected Providers")}
      ${degradedProviders.map(p => chip(p, "#fbbf24")).join(" ")}
    </div>` : ""}

    <div style="margin-bottom:8px;">
      <a href="${appUrl}/system-status" style="display:inline-block;background-color:#ffffff;color:#000000;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;padding:10px 24px;text-decoration:none;letter-spacing:0.04em;">→ View System Status</a>
    </div>
  `;

  return { subject, html: baseLayout(content, subject) };
}

export function renderCreatorExportReadyEmail(
  platform: string,
): { subject: string; html: string } {
  const subject = `Export Ready — ${platform} — Sports Market OS`;
  const appUrl  = getAppUrl();

  const content = `
    <p style="color:#52525b;font-size:9px;font-family:'Courier New',Courier,monospace;margin:0 0 4px;letter-spacing:0.06em;text-transform:uppercase;">Creator Export</p>
    <h1 style="color:#ffffff;font-size:18px;font-family:'Courier New',Courier,monospace;font-weight:700;margin:0 0 6px;line-height:1.3;">Your Export Is Ready</h1>
    <p style="color:#71717a;font-size:11px;font-family:'Courier New',Courier,monospace;margin:0 0 28px;line-height:1.5;">
      Market intelligence export prepared for <span style="color:#c084fc;">${escHtml(platform)}</span>.
      Content includes compliance watermarks.
    </p>

    <div style="margin-bottom:8px;">
      <a href="${appUrl}/creator-studio" style="display:inline-block;background-color:#ffffff;color:#000000;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;padding:10px 24px;text-decoration:none;letter-spacing:0.04em;">→ Open Creator Studio</a>
    </div>
    <p style="color:#3f3f46;font-size:9px;font-family:'Courier New',Courier,monospace;margin:12px 0 0;">Market intelligence only · Not financial advice</p>
  `;

  return { subject, html: baseLayout(content, subject) };
}
