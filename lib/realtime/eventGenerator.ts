import type { FeedEvent, FeedEventType, FeedSeverity } from "./feedTypes";

// ─── Template pool ────────────────────────────────────────────────────────────

interface EventTemplate {
  type: FeedEventType;
  severity: FeedSeverity;
  sport: string;
  market: string;
  source: string;
  confidence: number;
  message: string;
}

const TEMPLATES: EventTemplate[] = [
  // signal_created
  { type: "signal_created",         severity: "high",     sport: "Horse Racing",      market: "Ascot 2:40",            source: "Signal Engine",    confidence: 87, message: "Sharp money signal generated — Ascot 2:40 queue deteriorating" },
  { type: "signal_created",         severity: "medium",   sport: "Tennis",             market: "Djokovic vs Alcaraz",   source: "Signal Engine",    confidence: 74, message: "Volume/price divergence signal detected — Wimbledon SF" },
  { type: "signal_created",         severity: "medium",   sport: "NBA",                market: "Warriors vs Lakers",    source: "Signal Engine",    confidence: 81, message: "AI market thesis generated — NBA spread structural value" },
  { type: "signal_created",         severity: "high",     sport: "UFC",                market: "Poirier vs Gaethje",    source: "Signal Engine",    confidence: 65, message: "Informed money signal — UFC lightweight underdog compressing" },
  // signal_updated
  { type: "signal_updated",         severity: "medium",   sport: "NFL",                market: "Chiefs vs Bills",       source: "Signal Engine",    confidence: 69, message: "Signal updated — IV compression deepening in NFL totals" },
  { type: "signal_updated",         severity: "high",     sport: "Horse Racing",       market: "Ascot 2:40",            source: "Signal Engine",    confidence: 89, message: "Signal escalated — sharp volume accelerating into race-off" },
  // volatility_spike
  { type: "volatility_spike",       severity: "critical", sport: "Horse Racing",       market: "Cheltenham 3:15",       source: "Volatility Engine",confidence: 92, message: "Volatility spike — bilateral queue thinning confirmed critical" },
  { type: "volatility_spike",       severity: "high",     sport: "Tennis",             market: "Djokovic vs Alcaraz",   source: "Volatility Engine",confidence: 78, message: "IV expansion triggered — volume/price divergence resolved" },
  { type: "volatility_spike",       severity: "medium",   sport: "NFL",                market: "Chiefs vs Bills",       source: "Volatility Engine",confidence: 69, message: "IV compression broken — NFL totals expansion event imminent" },
  { type: "volatility_spike",       severity: "high",     sport: "UFC",                market: "Poirier vs Gaethje",    source: "Volatility Engine",confidence: 72, message: "Volatility accelerating — UFC market at 91st percentile IV" },
  // liquidity_shift
  { type: "liquidity_shift",        severity: "high",     sport: "Horse Racing",       market: "Ascot 2:40",            source: "Liquidity Engine", confidence: 87, message: "Liquidity shift — lay depth falling below 8th percentile" },
  { type: "liquidity_shift",        severity: "critical", sport: "Horse Racing",       market: "Cheltenham 3:15",       source: "Liquidity Engine", confidence: 92, message: "Liquidity critical — bilateral withdrawal, both sides thinning" },
  { type: "liquidity_shift",        severity: "medium",   sport: "Football",           market: "Man City vs Arsenal",   source: "Liquidity Engine", confidence: 72, message: "Liquidity rotation — Asian handicap → match result flow" },
  { type: "liquidity_shift",        severity: "medium",   sport: "Prediction Markets", market: "US Election Contract",  source: "Liquidity Engine", confidence: 78, message: "Liquidity surge — election contract 89% above 30-day average" },
  // news_catalyst
  { type: "news_catalyst",          severity: "high",     sport: "UFC",                market: "Poirier vs Gaethje",    source: "News Engine",      confidence: 65, message: "News catalyst — weight-cut rumour entering UFC market" },
  { type: "news_catalyst",          severity: "medium",   sport: "NBA",                market: "Warriors vs Lakers",    source: "News Engine",      confidence: 81, message: "Catalyst: pace regression aligned with AI model projection" },
  { type: "news_catalyst",          severity: "low",      sport: "Football",           market: "Man City vs Arsenal",   source: "News Engine",      confidence: 72, message: "Catalyst: team sheet confirms pre-match model formation" },
  { type: "news_catalyst",          severity: "medium",   sport: "Prediction Markets", market: "US Election Contract",  source: "News Engine",      confidence: 78, message: "Catalyst: polling consensus divergence widening to 6.8pts" },
  // regime_change
  { type: "regime_change",          severity: "high",     sport: "Global",             market: "All Markets",           source: "Regime Engine",    confidence: 82, message: "Regime transition — stable → volatile across sports" },
  { type: "regime_change",          severity: "medium",   sport: "Global",             market: "All Markets",           source: "Regime Engine",    confidence: 75, message: "Regime update — compression deepening in football markets" },
  { type: "regime_change",          severity: "low",      sport: "Global",             market: "All Markets",           source: "Regime Engine",    confidence: 68, message: "Regime cycling — rotational phase active in exchange flows" },
  // anomaly_detected
  { type: "anomaly_detected",       severity: "critical", sport: "Horse Racing",       market: "Cheltenham 3:15",       source: "Anomaly Engine",   confidence: 94, message: "Anomaly — bilateral queue thinning with no news trigger" },
  { type: "anomaly_detected",       severity: "high",     sport: "Prediction Markets", market: "US Election Contract",  source: "Anomaly Engine",   confidence: 78, message: "Anomaly — contract price 6.8pts above polling consensus" },
  { type: "anomaly_detected",       severity: "medium",   sport: "NFL",                market: "Chiefs vs Bills",       source: "Anomaly Engine",   confidence: 69, message: "Anomaly — 3hr IV compression without identifiable trigger" },
  { type: "anomaly_detected",       severity: "high",     sport: "UFC",                market: "Poirier vs Gaethje",    source: "Anomaly Engine",   confidence: 65, message: "Anomaly — price moving without matching public volume" },
  // creator_share
  { type: "creator_share",          severity: "low",      sport: "Horse Racing",       market: "Ascot 2:40",            source: "Creator Engine",   confidence: 87, message: "Creator export — Ascot sharp money signal share card ready" },
  { type: "creator_share",          severity: "low",      sport: "Tennis",             market: "Djokovic vs Alcaraz",   source: "Creator Engine",   confidence: 74, message: "Creator export — Wimbledon volatility expansion card ready" },
  // ai_brief_generated
  { type: "ai_brief_generated",     severity: "low",      sport: "Global",             market: "All Markets",           source: "Brief Engine",     confidence: 82, message: "AI intelligence brief generated — regime update included" },
  { type: "ai_brief_generated",     severity: "medium",   sport: "Global",             market: "All Markets",           source: "Brief Engine",     confidence: 79, message: "AI brief escalated — critical market conditions detected" },
  // provider_status_change
  { type: "provider_status_change", severity: "low",      sport: "Global",             market: "Betfair",               source: "Provider Monitor", confidence: 98, message: "Provider sync — Betfair feed nominal, latency 14ms" },
  { type: "provider_status_change", severity: "medium",   sport: "Global",             market: "Polymarket",            source: "Provider Monitor", confidence: 91, message: "Provider alert — Polymarket API latency elevated 340ms" },
  { type: "provider_status_change", severity: "low",      sport: "Global",             market: "Smarkets",              source: "Provider Monitor", confidence: 97, message: "Provider confirmed online — Smarkets feed nominal" },
];

// ─── Unique ID generator ──────────────────────────────────────────────────────

let _counter = 0;

function uid(): string {
  return `evt-${Date.now().toString(36)}-${(_counter++).toString(36)}`;
}

// ─── Pseudo-random pick (deterministic per tick) ──────────────────────────────

function pick<T>(arr: T[], phase: number): T {
  return arr[Math.abs(Math.floor(phase)) % arr.length];
}

// ─── Event factory ────────────────────────────────────────────────────────────

export function generateEvent(tick: number): FeedEvent {
  // Use a golden-ratio-spaced phase so events don't repeat in short cycles
  const phase = tick * 7 + Math.floor(Math.sin(tick / 3.7) * 11 + 11);
  const template = pick(TEMPLATES, phase);

  // Add a small random confidence drift so events don't feel identical
  const confDrift = Math.round((Math.random() - 0.5) * 8);
  const confidence = Math.max(50, Math.min(99, template.confidence + confDrift));

  return {
    id: uid(),
    type: template.type,
    severity: template.severity,
    sport: template.sport,
    market: template.market,
    source: template.source,
    confidence,
    message: template.message,
    timestamp: Date.now(),
  };
}
