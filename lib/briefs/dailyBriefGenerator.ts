/**
 * dailyBriefGenerator.ts — AI Daily Brief engine.
 *
 * Generates structured intelligence briefs: Morning, Midday, Overnight,
 * Volatility Alert, and Exchange Shift. In production these would be driven
 * by live provider data and scheduled generation. Currently produces rich
 * mock briefs seeded from the current hour to vary output through the day.
 */

import type { BriefType, DailyBrief } from "./briefTypes";
import {
  buildTopSignalsSection,
  buildCatalystsSection,
  buildVolatilitySection,
  buildExchangeFlowSection,
  buildAIRegimeSection,
  buildWatchlistSection,
  buildSummarySection,
  sampleSignals,
  sampleCatalysts,
} from "./briefTemplates";

// ─── Auto-detect brief type from current hour ─────────────────────────────────

function detectBriefType(): BriefType {
  const hour = new Date().getUTCHours();
  if (hour >= 5  && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "midday";
  return "overnight";
}

// ─── Brief content banks ──────────────────────────────────────────────────────

const AI_REGIME_SUMMARIES: Record<BriefType, string> = {
  "morning":
    "AI model regime: CAUTIOUS BULLISH. Exchange microstructure showing accumulation patterns " +
    "in Horse Racing and Tennis pre-match markets. Confidence threshold: 74%. " +
    "Queue health nominal across monitored Betfair markets. Volatility surface elevated — " +
    "implied move pricing in +2.1σ event probability within 3 hours.",
  "midday":
    "AI model regime: NEUTRAL with VOLATILITY BIAS. Three concurrent liquidity imbalance signals " +
    "detected across Football, NBA, and Prediction Markets. Model confidence: 68%. " +
    "Midday regime shift consistent with institutional rebalancing — retail flow diverging. " +
    "Watch NFL totals for compression resolution.",
  "overnight":
    "AI model regime: LOW ACTIVITY. Exchange volumes 34% below 30-day rolling average. " +
    "Overnight model running reduced scan cadence. Three signals pre-staged for morning broadcast. " +
    "Prediction market drift (+6.8 points) from polling consensus in US markets flagged for review.",
  "volatility-alert":
    "AI model regime: ELEVATED ALERT. Simultaneous implied volatility spikes detected across " +
    "two or more sport verticals. Pattern confidence: 81%. Historical base rate for " +
    "follow-through: 73%. Heightened monitoring active. All catalyst feeds on high-priority polling.",
  "exchange-shift":
    "AI model regime: FLOW EVENT. Cross-exchange rotation in progress. Institutional signature " +
    "confirmed — volume distribution inconsistent with retail origin. Model flagging: " +
    "possible sharp-side consensus formation. Retail divergence: +2.4σ from expected ratio.",
};

const EXCHANGE_FLOW_NOTES: Record<BriefType, string> = {
  "morning":
    "Pre-race Betfair volume +28% above 5-day average on Horse Racing. " +
    "Sharp-side rotation detected on Ascot 2.40 — unmatched liability building on lay side. " +
    "Smarkets showing counter-flow on Tennis main markets.",
  "midday":
    "Asian handicap liquidity rotating into match result markets — Football Premier League. " +
    "Cross-exchange arbitrage window: 0.3% on Chiefs vs Bills totals. " +
    "Polymarket event contracts diverging from closing-line consensus — volume surge pattern active.",
  "overnight":
    "Overnight exchange activity muted. Thin liquidity on all UK Horse Racing markets. " +
    "NBA pre-game totals showing minimal institutional movement. " +
    "Asian markets active — Japanese football leagues showing elevated flow vs 7-day avg.",
  "volatility-alert":
    "Simultaneous volume spikes detected: Betfair Horse Racing (+34.2%), Smarkets Tennis (+18.4%). " +
    "Flow pattern does not match scheduled race/match events — catalyst injection suspected. " +
    "Exchange arbitrage spread widening — liquidity fragmenting.",
  "exchange-shift":
    "Confirmed institutional rotation: $2.4M equivalent moved from retail-dominated pools " +
    "into sharp-side exchange books. Flow pattern: 94th percentile for this session window. " +
    "Three exchanges showing correlated movement within 90-second window.",
};

const VOLATILITY_NOTES: Record<BriefType, string> = {
  "morning":
    "Implied volatility elevated heading into the morning session. " +
    "Horse Racing: IV +1.4σ above 20-day average. Tennis pre-match IV compressed — " +
    "potential expansion trigger within 2 hours of first serve. NFL totals: stable.",
  "midday":
    "Volatility compression detected on NFL totals (Chiefs vs Bills, Warriors vs Lakers). " +
    "Three consecutive sessions of compression without resolution — " +
    "historically precedes 4–8% line move. Monitor for catalyst injection.",
  "overnight":
    "Volatility surface quiet. No active compression or spike patterns in monitored markets. " +
    "VIX equivalent for Betfair pre-race markets: 12.3 (below threshold). " +
    "Tennis overnight markets: low volume, unreliable IV readings.",
  "volatility-alert":
    "CRITICAL: IV spike +2.8σ detected on Tennis main event. " +
    "Betfair Horse Racing showing +34.2% queue deterioration simultaneously. " +
    "Multi-market volatility event — not consistent with single-catalyst origin.",
  "exchange-shift":
    "Exchange-driven volatility: spread widening on three Betfair markets post-flow-event. " +
    "Implied probability recalibrating — 6–12% price movement on sharp-side selections. " +
    "Retail books lagging institutional exchange re-pricing by ~40 seconds.",
};

const WATCHLIST_NOTES: Record<BriefType, string> = {
  "morning":
    "Watchlist markets: 2 showing elevated activity (Ascot 2.40, Djokovic vs Alcaraz). " +
    "1 new catalyst event linked to watchlisted market. Queue health: nominal on 4/5 tracked.",
  "midday":
    "Midday watchlist scan: most active market — Chiefs vs Bills (NFL Totals). " +
    "Liquidity shift detected on 2 watchlisted markets. AI regime changed on NBA Totals basket.",
  "overnight":
    "Watchlist quiet overnight. No significant moves on monitored markets. " +
    "3 markets flagged for morning review: Cheltenham 3.15, NBA morning lines, UFC main event.",
  "volatility-alert":
    "Watchlist alert: 2 monitored markets showing queue deterioration above threshold. " +
    "Ascot 2.40 and Tennis main event both crossing volatility spike criteria simultaneously.",
  "exchange-shift":
    "Watchlist flow event: institutional rotation touching 3 monitored markets. " +
    "Most affected: Betfair Horse Racing basket. Recommend watchlist review after session.",
};

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateDailyBrief(type?: BriefType): DailyBrief {
  const briefType = type ?? detectBriefType();
  const now       = new Date().toISOString();

  const titles: Record<BriefType, string> = {
    "morning":          "Morning Intelligence Brief",
    "midday":           "Midday Market Brief",
    "overnight":        "Overnight Scan Brief",
    "volatility-alert": "Volatility Alert Brief",
    "exchange-shift":   "Exchange Shift Brief",
  };

  const subtitles: Record<BriefType, string> = {
    "morning":          "Pre-session overview · markets, catalysts, and regime assessment",
    "midday":           "Midday regime check · flow, volatility, and AI signal summary",
    "overnight":        "Overnight digest · low-activity scan and morning staging",
    "volatility-alert": "Elevated volatility detected across multiple markets",
    "exchange-shift":   "Institutional flow rotation event in progress",
  };

  const signalCount = briefType === "overnight" ? 3 : briefType === "volatility-alert" ? 5 : 4;
  const catalystCount = briefType === "overnight" ? 2 : 4;

  const topSignalTitles = sampleSignals(signalCount);
  const catalysts       = sampleCatalysts(catalystCount);

  const sections = [
    buildSummarySection(briefType),
    buildTopSignalsSection(topSignalTitles),
    buildCatalystsSection(catalysts),
    buildVolatilitySection(
      VOLATILITY_NOTES[briefType],
      briefType === "volatility-alert" ? "critical" : "info",
    ),
    buildExchangeFlowSection(EXCHANGE_FLOW_NOTES[briefType]),
    buildAIRegimeSection(AI_REGIME_SUMMARIES[briefType]),
    buildWatchlistSection(WATCHLIST_NOTES[briefType]),
  ];

  return {
    id:                `brief-${briefType}-${Date.now()}`,
    type:              briefType,
    title:             titles[briefType],
    subtitle:          subtitles[briefType],
    generatedAt:       now,
    sections,
    topSignalTitles,
    catalysts,
    aiRegimeSummary:   AI_REGIME_SUMMARIES[briefType],
    exchangeFlowNote:  EXCHANGE_FLOW_NOTES[briefType],
    volatilityNote:    VOLATILITY_NOTES[briefType],
    watchlistMovement: WATCHLIST_NOTES[briefType],
  };
}
