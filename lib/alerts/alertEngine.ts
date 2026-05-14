/**
 * alertEngine.ts — Mock alert generation engine.
 *
 * Generates deterministic mock alerts based on market intelligence data.
 * In production: backed by real provider event streams and user rule evaluation.
 * Supports: volatility spikes, queue deterioration, catalyst events,
 * AI confidence thresholds, exchange flow shifts, regime changes, watchlist alerts.
 *
 * Future integrations: email via Resend, push via web-push, Telegram via bot API.
 */

import type { Alert, AlertCategory, AlertSeverity } from "./alertTypes";

function minsAgo(n: number): string {
  return new Date(Date.now() - n * 60_000).toISOString();
}

const MOCK_ALERTS: Alert[] = [
  {
    id:          "alert-001",
    ruleId:      "rule-001",
    category:    "volatility-spike",
    severity:    "critical",
    title:       "Volatility Spike — Ascot 2.40",
    body:        "Implied volatility crossed +2.8σ threshold on Betfair Ascot 2.40. Queue depth deteriorating simultaneously. Pattern consistent with informed pre-race positioning.",
    market:      "Ascot 2.40",
    sport:       "Horse Racing",
    triggeredAt: minsAgo(4),
    dismissed:   false,
    relatedMarkets: ["Cheltenham 3.15", "Ascot 2.40"],
  },
  {
    id:          "alert-002",
    ruleId:      "rule-003",
    category:    "catalyst-event",
    severity:    "warning",
    title:       "Catalyst Detected — UFC Main Event",
    body:        "Weight-cut rumour entering market for Poirier vs Gaethje. Underdog price shortening without matching public volume. Monitor for continuation.",
    market:      "Poirier vs Gaethje",
    sport:       "UFC",
    triggeredAt: minsAgo(12),
    dismissed:   false,
    relatedMarkets: ["Poirier vs Gaethje"],
  },
  {
    id:          "alert-003",
    ruleId:      "rule-004",
    category:    "ai-confidence",
    severity:    "info",
    title:       "High-Confidence Signal — Tennis",
    body:        "AI model confidence at 87% for Liquidity Imbalance signal on Djokovic vs Alcaraz. Exchange volume 34% above 20-day average with price compression.",
    market:      "Djokovic vs Alcaraz",
    sport:       "Tennis",
    triggeredAt: minsAgo(18),
    dismissed:   false,
    relatedMarkets: ["Djokovic vs Alcaraz"],
  },
  {
    id:          "alert-004",
    ruleId:      "rule-005",
    category:    "exchange-flow-shift",
    severity:    "warning",
    title:       "Flow Rotation — Premier League Markets",
    body:        "Cross-exchange liquidity rotating from Asian handicap into match result markets. $2.4M flow detected — 94th percentile for this session window.",
    sport:       "Football",
    triggeredAt: minsAgo(31),
    dismissed:   false,
    relatedMarkets: ["Premier League Batch", "Asian Handicap Markets"],
  },
  {
    id:          "alert-005",
    ruleId:      "rule-006",
    category:    "market-regime-change",
    severity:    "info",
    title:       "Regime Change — NBA Totals",
    body:        "AI regime classification changed from NEUTRAL to VOLATILITY BIAS on NBA Totals basket. Three concurrent compression patterns resolving.",
    sport:       "NBA",
    triggeredAt: minsAgo(47),
    dismissed:   false,
    relatedMarkets: ["Warriors vs Lakers", "Chiefs vs Bills"],
  },
  {
    id:          "alert-006",
    ruleId:      "rule-002",
    category:    "queue-deterioration",
    severity:    "warning",
    title:       "Queue Health Warning — Cheltenham 3.15",
    body:        "Betfair queue depth falling below 30% threshold. Liquidity thinning on both sides simultaneously. Not consistent with normal pre-race withdrawal.",
    market:      "Cheltenham 3.15",
    sport:       "Horse Racing",
    triggeredAt: minsAgo(63),
    dismissed:   false,
    relatedMarkets: ["Cheltenham 3.15"],
  },
  {
    id:          "alert-007",
    ruleId:      "rule-007",
    category:    "watchlist",
    severity:    "info",
    title:       "Watchlist Movement — Prediction Markets",
    body:        "US Election Market contract pricing diverging from polling consensus by 6.8 points. Volume surge +89% above 7-day average.",
    market:      "US Election 2024",
    sport:       "Prediction Markets",
    triggeredAt: minsAgo(94),
    dismissed:   true,
    relatedMarkets: ["US Election Market", "Polymarket"],
  },
];

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateAlerts(): Alert[] {
  return MOCK_ALERTS;
}

export function getActiveAlerts(): Alert[] {
  return MOCK_ALERTS.filter(a => !a.dismissed);
}

export function getAlertsBySeverity(severity: AlertSeverity): Alert[] {
  return MOCK_ALERTS.filter(a => a.severity === severity && !a.dismissed);
}

export function getAlertsByCategory(category: AlertCategory): Alert[] {
  return MOCK_ALERTS.filter(a => a.category === category);
}

export function getAlertStats(): {
  total: number;
  active: number;
  critical: number;
  warning: number;
  info: number;
  dismissed: number;
} {
  const active    = MOCK_ALERTS.filter(a => !a.dismissed);
  const dismissed = MOCK_ALERTS.filter(a => a.dismissed);
  return {
    total:     MOCK_ALERTS.length,
    active:    active.length,
    critical:  active.filter(a => a.severity === "critical").length,
    warning:   active.filter(a => a.severity === "warning").length,
    info:      active.filter(a => a.severity === "info").length,
    dismissed: dismissed.length,
  };
}
