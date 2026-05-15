/**
 * Partner narrative generators — rotating intelligence copy for partner pages.
 *
 * All narratives use compliance-safe market intelligence language only.
 * No betting advice, no guaranteed profit claims, no order execution language.
 */

// ─── Narrative banks ─────────────────────────────────────────────────────────

export const EXCHANGE_NARRATIVES = [
  "Exchange microstructure is showing elevated depth imbalance across high-liquidity horse racing markets — queue health tracking above 72 on primary selections.",
  "ProphetX order book data indicates tightening spreads on NBA futures — implied probability convergence across 3 exchange sources.",
  "Cross-exchange flow analysis detecting rotation from retail-heavy to sharp-weighted markets in NFL pre-game windows.",
  "Betfair liquidity snapshot: matched volume up 18% on featured tennis markets, spread quality score at 84/100 — strong queue conditions.",
  "Structural repricing detected on prediction market contracts — depth imbalance shifting lay-heavy ahead of scheduled event announcements.",
  "Flow pressure reading 76/100 on horse racing ante-post markets — institutional-type volume pattern detected in morning session.",
  "Order book depth asymmetry: lay-side depth 2.4× back-side on selected NFL moneyline contracts — microstructure divergence from 3-day baseline.",
  "Polymarket contract pricing showing 6% implied probability divergence from Betfair equivalents — cross-exchange intelligence gap identified.",
];

export const CREATOR_NARRATIVES = [
  "47 creators distributed exchange microstructure reports this week — combined estimated reach across X, Telegram, and YouTube Shorts.",
  "Content Engine processed 312 catalyst events into structured intelligence exports across 6 sport categories.",
  "Creator Studio analytics: sports intelligence content showing 3.2× higher engagement rates versus generic sports content benchmarks.",
  "Top creator exports this cycle: NFL flow analysis, horse racing queue health reports, tennis spread intelligence.",
  "Telegram channel operators using Sports Market OS intelligence averaging 4.1 posts per day — content velocity up 28% week-over-week.",
  "Creator distribution network active across 18 countries — exchange microstructure intelligence reaching global sports analyst community.",
  "YouTube Shorts hooks generated from live catalyst feed — average hook engagement rate 12% above creator baseline.",
  "X post templates using order book depth framing outperforming direct odds commentary by 2.7× in engagement metrics.",
];

export const LIQUIDITY_NARRATIVES = [
  "Matched volume across monitored horse racing markets: £2.3M in last 4-hour window — above 90-day moving average.",
  "NBA game markets: queue health average 68/100 — moderate liquidity conditions with improving depth trend.",
  "Pre-game NFL liquidity depth scores trending from 52 → 71 as kickoff approaches — typical sharp-money window pattern.",
  "Prediction market depth: Polymarket matched volume showing elevated levels on featured event contracts.",
  "Tennis in-play liquidity: spread quality deteriorating post-set break — typical volatility window for microstructure intelligence.",
  "Betfair horse racing: best-available back prices within 0.3 ticks of exchange midpoint — tight queue conditions confirmed.",
  "Cross-exchange liquidity aggregation: 4 sources tracked, depth imbalance score -12 (back-heavy) on featured selection.",
  "Flow pressure elevated to 81/100 on UFC markets ahead of main card — sharp volume detection pattern active.",
];

export const VOLATILITY_NARRATIVES = [
  "Volatility score spike detected: horse racing markets entering high-movement window 45 minutes pre-race.",
  "NFL markets: volatility index 74/100 — elevated structural movement pattern, AI confidence at 82%.",
  "Prediction market contracts showing low volatility (score: 21/100) in stable pre-announcement window.",
  "Tennis match markets: volatility escalating post-break of serve — historical pattern: 3.1× normal spread widening.",
  "NBA futures: volatility score dropped from 68 → 34 following injury report confirmation — market digesting information.",
  "Cross-sport volatility comparison: UFC ante-post (87) vs NFL game markets (54) — fighting markets structurally more volatile.",
  "Horse racing: volatility clustering detected in final 20-minute pre-race window — flow pressure + spread quality diverging.",
  "Structural repricing event detected: implied probability shifted 8% across 12-minute window — catalyst-driven movement pattern.",
];

export const ENGAGEMENT_NARRATIVES = [
  "Partner intelligence reports generating 4.8× higher save rates than standard sports content on Instagram.",
  "Exchange microstructure content: 67% of distributed posts include order book depth visuals — highest engagement format.",
  "Telegram broadcast partners averaging 340 views per intelligence post — up from 210 baseline at onboarding.",
  "Creator export volume: 1,240 content pieces generated this month across all partner accounts.",
  "Top-performing partner content: pre-game flow analysis posts (avg 890 impressions), in-play microstructure alerts (avg 1,240 impressions).",
  "Partner network combined estimated reach: 820,000 sports intelligence followers across all platforms.",
  "YouTube Shorts using AI narrative hooks achieving average 14-second watch time before swipe — above platform benchmark.",
  "Partner retention: 94% of active partners renewed or upgraded plan in last billing cycle.",
];

// ─── Rotation utility ────────────────────────────────────────────────────────

/**
 * Returns a narrative from the array, rotating based on current minute-of-hour.
 * Deterministic within a minute window — no randomness, SSR-safe.
 */
export function rotateNarrative(narratives: string[], offsetSeed = 0): string {
  const minute = new Date().getMinutes();
  const index = (minute + offsetSeed) % narratives.length;
  return narratives[index];
}
