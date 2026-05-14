/**
 * alertEvaluation.ts — Simulated alert rule evaluation engine.
 *
 * Evaluates persisted alert rules against a simulated market state snapshot.
 * In production: replace mock market state with live provider data from
 * Betfair, Odds API, and ProphetX feeds. Evaluation logic stays the same.
 *
 * All evaluation is read-only — no side effects, no mutations.
 */

import type { PersistentAlertRule, TriggeredAlert, PersistentAlertType } from "./persistentAlertTypes";

// ─── Simulated market state ───────────────────────────────────────────────────

interface MarketSnapshot {
  slug:          string;
  sport:         string;
  volatilityZ:   number;   // σ above baseline
  queueHealth:   number;   // 0–1 (1 = full depth)
  liquidityDepth:number;   // 0–1
  aiConfidence:  number;   // 0–100
  flowPercentile:number;   // 0–100
  regimeChanged: boolean;
  catalystDetected: boolean;
}

// Pool of mock market snapshots — varied to produce realistic evaluation results
const MARKET_POOL: MarketSnapshot[] = [
  { slug: "ascot-2-40",           sport: "Horse Racing",       volatilityZ: 2.9, queueHealth: 0.22, liquidityDepth: 0.45, aiConfidence: 88, flowPercentile: 76, regimeChanged: false, catalystDetected: false },
  { slug: "cheltenham-3-15",      sport: "Horse Racing",       volatilityZ: 1.1, queueHealth: 0.28, liquidityDepth: 0.60, aiConfidence: 71, flowPercentile: 55, regimeChanged: false, catalystDetected: false },
  { slug: "djokovic-vs-alcaraz",  sport: "Tennis",             volatilityZ: 0.8, queueHealth: 0.74, liquidityDepth: 0.82, aiConfidence: 87, flowPercentile: 63, regimeChanged: false, catalystDetected: false },
  { slug: "chiefs-vs-bills",      sport: "NFL",                volatilityZ: 1.4, queueHealth: 0.85, liquidityDepth: 0.90, aiConfidence: 74, flowPercentile: 82, regimeChanged: true,  catalystDetected: false },
  { slug: "warriors-vs-lakers",   sport: "NBA",                volatilityZ: 0.6, queueHealth: 0.91, liquidityDepth: 0.88, aiConfidence: 69, flowPercentile: 49, regimeChanged: true,  catalystDetected: false },
  { slug: "poirier-vs-gaethje",   sport: "UFC",                volatilityZ: 1.7, queueHealth: 0.78, liquidityDepth: 0.55, aiConfidence: 79, flowPercentile: 61, regimeChanged: false, catalystDetected: true  },
  { slug: "man-city-vs-arsenal",  sport: "Football",           volatilityZ: 0.9, queueHealth: 0.88, liquidityDepth: 0.95, aiConfidence: 66, flowPercentile: 91, regimeChanged: false, catalystDetected: false },
  { slug: "us-election-market",   sport: "Prediction Markets", volatilityZ: 1.2, queueHealth: 0.95, liquidityDepth: 0.98, aiConfidence: 82, flowPercentile: 88, regimeChanged: true,  catalystDetected: true  },
];

// ─── Rule evaluator ───────────────────────────────────────────────────────────

export interface EvaluationResult {
  ruleId:     string;
  triggered:  boolean;
  market?:    MarketSnapshot;
  reason?:    string;
}

function evaluateRule(rule: PersistentAlertRule, market: MarketSnapshot): boolean {
  const threshold = rule.threshold;

  switch (rule.alert_type as PersistentAlertType) {
    case "volatility-spike":
      return market.volatilityZ >= (threshold ?? 2.0);
    case "queue-deterioration":
      return market.queueHealth  <= (threshold ?? 0.3);
    case "liquidity-anomaly":
      return market.liquidityDepth <= (threshold ?? 0.4);
    case "ai-confidence":
      return market.aiConfidence >= (threshold ?? 80);
    case "exchange-flow-shift":
      return market.flowPercentile >= (threshold ?? 80);
    case "catalyst-detected":
      return market.catalystDetected;
    case "market-regime-change":
      return market.regimeChanged;
    default:
      return false;
  }
}

// ─── Scope filter — match rule to relevant markets ────────────────────────────

function getRelevantMarkets(rule: PersistentAlertRule): MarketSnapshot[] {
  let pool = MARKET_POOL;
  if (rule.sport)       pool = pool.filter((m) => m.sport === rule.sport);
  if (rule.market_slug) pool = pool.filter((m) => m.slug === rule.market_slug);
  return pool;
}

// ─── Trigger message builders ─────────────────────────────────────────────────

function buildTriggerMessage(rule: PersistentAlertRule, market: MarketSnapshot): { title: string; message: string } {
  switch (rule.alert_type as PersistentAlertType) {
    case "volatility-spike":
      return {
        title:   `Volatility Spike — ${market.slug}`,
        message: `Implied volatility at +${market.volatilityZ.toFixed(1)}σ on ${market.sport} market ${market.slug}. Threshold: ${rule.threshold ?? 2.0}σ.`,
      };
    case "queue-deterioration":
      return {
        title:   `Queue Deterioration — ${market.slug}`,
        message: `Queue health at ${(market.queueHealth * 100).toFixed(0)}% on ${market.slug}. Below ${((rule.threshold ?? 0.3) * 100).toFixed(0)}% threshold.`,
      };
    case "liquidity-anomaly":
      return {
        title:   `Liquidity Anomaly — ${market.slug}`,
        message: `Liquidity depth at ${(market.liquidityDepth * 100).toFixed(0)}% on ${market.slug}. Thin market conditions detected.`,
      };
    case "ai-confidence":
      return {
        title:   `High-Confidence AI Signal — ${market.sport}`,
        message: `AI confidence at ${market.aiConfidence}% on ${market.slug}. Exceeds ${rule.threshold ?? 80}% threshold.`,
      };
    case "exchange-flow-shift":
      return {
        title:   `Exchange Flow Shift — ${market.sport}`,
        message: `Flow percentile at ${market.flowPercentile}th on ${market.slug}. Institutional rotation above ${rule.threshold ?? 80}th percentile threshold.`,
      };
    case "catalyst-detected":
      return {
        title:   `Catalyst Detected — ${market.sport}`,
        message: `High-severity catalyst event detected for ${market.slug}. Monitor for price movement.`,
      };
    case "market-regime-change":
      return {
        title:   `Regime Change — ${market.sport}`,
        message: `AI regime classification changed on ${market.slug}. Previous regime no longer valid — reassess positions.`,
      };
    default:
      return { title: "Alert triggered", message: `Rule ${rule.id} fired on ${market.slug}.` };
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function evaluateAlertRules(rules: PersistentAlertRule[]): EvaluationResult[] {
  const results: EvaluationResult[] = [];

  for (const rule of rules) {
    if (!rule.enabled) {
      results.push({ ruleId: rule.id, triggered: false });
      continue;
    }

    const markets = getRelevantMarkets(rule);
    let triggered = false;
    let triggerMarket: MarketSnapshot | undefined;

    for (const market of markets) {
      if (evaluateRule(rule, market)) {
        triggered     = true;
        triggerMarket = market;
        break;
      }
    }

    results.push({
      ruleId:   rule.id,
      triggered,
      market:   triggerMarket,
      reason:   triggered ? `${rule.alert_type} threshold crossed on ${triggerMarket?.slug}` : undefined,
    });
  }

  return results;
}

export function buildTriggeredAlertFromResult(
  rule: PersistentAlertRule,
  result: EvaluationResult,
): Omit<TriggeredAlert, "id" | "triggered_at"> | null {
  if (!result.triggered || !result.market) return null;

  const { title, message } = buildTriggerMessage(rule, result.market);

  return {
    alert_rule_id: rule.id,
    user_id:       rule.user_id,
    market_slug:   result.market.slug,
    sport:         result.market.sport,
    title,
    message,
    severity:      rule.severity,
    metadata:      { alert_type: rule.alert_type, threshold: rule.threshold },
  };
}
