import type { Market, SportHub } from "./types";

// ─── Markets ──────────────────────────────────────────────────────────────────

const MARKETS: Market[] = [
  {
    slug: "ascot-2-40",
    title: "Ascot 2:40 — Royal Hunt Cup",
    sport: "Horse Racing",
    exchange: "Betfair",
    openingPrice: 4.2,
    currentPrice: 3.1,
    direction: "down",
    movement: "−26.2%",
    volatility: 84,
    liquidity: 72,
    confidence: 87,
    aiRegime: "volatile",
    aiSeverity: "high",
    description:
      "The Ascot 2:40 Royal Hunt Cup is exhibiting significant queue deterioration on the lay side. Unmatched liability patterns are consistent with informed positioning ahead of a structural market move.",
    aiNarrative:
      "Sharp unmatched volume accumulating on the lay side of this market. Queue structure deteriorating at a rate inconsistent with normal pre-race liquidity withdrawal. AI models detect a 78% probability this represents informed positioning rather than retail noise.",
    liquidityNote:
      "Order book depth falling below the 15th percentile for this race class. Late-money concentration on the back side is compressing available lay liquidity.",
    volatilityNote:
      "Implied volatility expanding at 2.1σ above the 20-race rolling average. Compression phase ended 22 minutes ago — expansion phase now confirmed active.",
    behaviouralNote:
      "Crowd and sharp-side positioning has diverged by 34 points over the last 8 minutes. Historically, divergences of this magnitude resolve within 4–6 minutes of race off.",
    keyCatalysts: [
      "Significant unmatched lay liability detected — 3.4× above average",
      "Queue health deteriorating on both sides simultaneously",
      "Sharp-side back volume concentrated in the last 12 minutes",
      "Price movement inconsistent with public-facing news flow",
    ],
    catalysts: [
      {
        id: "cat-asc-001",
        headline: "Unmatched lay liability 3.4× above average",
        source: "Betfair Exchange Feed",
        severity: "high",
        timestamp: "14:32:08",
        impact: "Queue deterioration — informed positioning signal",
      },
      {
        id: "cat-asc-002",
        headline: "Sharp back volume concentration in final 12 minutes",
        source: "AI Flow Analysis",
        severity: "medium",
        timestamp: "14:28:44",
        impact: "Crowd/sharp divergence widening",
      },
    ],
    relatedSlugs: ["cheltenham-3-15"],
    tags: ["sharp-money", "queue-health", "horse-racing", "betfair"],
  },
  {
    slug: "cheltenham-3-15",
    title: "Cheltenham 3:15 — Gold Cup Trial",
    sport: "Horse Racing",
    exchange: "Betfair",
    openingPrice: 5.5,
    currentPrice: 6.8,
    direction: "up",
    movement: "+23.6%",
    volatility: 61,
    liquidity: 48,
    confidence: 92,
    aiRegime: "illiquid",
    aiSeverity: "critical",
    description:
      "Cheltenham 3:15 is showing queue health warnings. Liquidity thinning on both sides simultaneously — a pattern not consistent with normal pre-race withdrawal. Potential stewards' inquiry scenario.",
    aiNarrative:
      "Betfair queue depth is falling below critical threshold. Both back and lay sides losing liquidity at the same rate — this is unusual. In 89% of historical matches, simultaneous bilateral thinning precedes either a non-runner declaration or a stewards' investigation.",
    liquidityNote:
      "Queue depth now at 8th percentile for this race class. Bilateral liquidity withdrawal is the key signal — single-side withdrawal is normal; bilateral is a red flag.",
    volatilityNote:
      "Low implied volatility (IV) despite thin liquidity — price has not moved significantly. This compression in a thin book historically precedes an aggressive price correction when news breaks.",
    behaviouralNote:
      "Market is in a holding pattern. Neither crowd nor sharp side is committing volume. This behavioural stasis in a thinning book is consistent with market participants awaiting an informational trigger.",
    keyCatalysts: [
      "Bilateral queue thinning — both back and lay sides losing depth",
      "Queue depth below critical threshold at 8th percentile",
      "No matching public news event to explain withdrawal",
      "Historical pattern consistent with non-runner or inquiry",
    ],
    catalysts: [
      {
        id: "cat-chel-001",
        headline: "Bilateral queue thinning detected — no news trigger",
        source: "Betfair Queue Monitor",
        severity: "critical",
        timestamp: "14:21:47",
        impact: "Market integrity signal — monitor for official announcement",
      },
    ],
    relatedSlugs: ["ascot-2-40"],
    tags: ["queue-health", "liquidity-warning", "horse-racing", "betfair"],
  },
  {
    slug: "djokovic-vs-alcaraz",
    title: "Djokovic vs Alcaraz — Wimbledon SF",
    sport: "Tennis",
    exchange: "Smarkets",
    openingPrice: 2.1,
    currentPrice: 2.48,
    direction: "up",
    movement: "+18.1%",
    volatility: 71,
    liquidity: 88,
    confidence: 74,
    aiRegime: "expansion",
    aiSeverity: "medium",
    description:
      "Exchange volume is diverging from in-play price movement on the Djokovic–Alcaraz Wimbledon semi-final. Matched volume is 34% above its 20-day average while price is compressing — a structural precursor to volatility expansion.",
    aiNarrative:
      "Volume/price divergence is widening. High matched volume with price compression is a textbook structural signal for imminent volatility expansion. The AI model places a 74% confidence on a significant price movement within the next two games.",
    liquidityNote:
      "Liquidity is high and improving — 88th percentile for this event type. Both sides of the book are well-populated, but the buy/sell imbalance is tilting toward the back side, creating upward price pressure.",
    volatilityNote:
      "Implied volatility is in a compression phase but the structural indicators suggest this is a coiled spring rather than a low-volatility equilibrium. Expansion is the projected next regime.",
    behaviouralNote:
      "Crowd and sharp money are aligned on the same side for the first time in this match. When both converge, the subsequent price movement tends to be larger and faster.",
    keyCatalysts: [
      "Matched volume 34% above 20-day average",
      "Price compression despite elevated volume — structural divergence",
      "Buy/sell imbalance tilting 62/38 toward the back side",
      "Crowd/sharp consensus alignment — rare in this match",
    ],
    catalysts: [
      {
        id: "cat-djok-001",
        headline: "Volume/price divergence widening — compression signal",
        source: "Smarkets Flow Analysis",
        severity: "medium",
        timestamp: "14:29:51",
        impact: "Structural precursor to volatility expansion",
      },
    ],
    relatedSlugs: [],
    tags: ["liquidity-imbalance", "volatility", "tennis", "smarkets"],
  },
  {
    slug: "warriors-vs-lakers",
    title: "Warriors vs Lakers — NBA Spread",
    sport: "NBA",
    exchange: "FanDuel",
    openingPrice: 1.91,
    currentPrice: 1.79,
    direction: "down",
    movement: "−6.3%",
    volatility: 55,
    liquidity: 91,
    confidence: 81,
    aiRegime: "compression",
    aiSeverity: "medium",
    description:
      "AI model detects structural value on the under side of the Warriors–Lakers spread based on pace-of-play regression and defensive scheme data. Sharp-side consensus is aligning with the AI projection.",
    aiNarrative:
      "Pace-of-play regression across the last 7 games for both teams converges on a total points projection 4.2 below the current market line. Defensive scheme analysis confirms both teams are deploying low-tempo sets. Sharp-side money is moving to align with this projection.",
    liquidityNote:
      "Deep liquid market — 91st percentile for NBA spread markets. Large-volume sharp bets are being absorbed without significant price impact, suggesting the market is well-informed and efficiently priced around the current line.",
    volatilityNote:
      "Low current volatility consistent with a well-established pre-game line. Historical IV for Warriors–Lakers matchups at this stage of the season averages 42 — current reading of 55 suggests the market is pricing in higher uncertainty than the structural data supports.",
    behaviouralNote:
      "Sharp-side divergence from crowd consensus is at +23 points — sharp money is on the under while public sentiment is on the over. This divergence magnitude historically correlates with eventual line movement toward the sharp side.",
    keyCatalysts: [
      "Pace regression projects total 4.2 below current market line",
      "Defensive scheme analysis — both teams in low-tempo sets",
      "Sharp/crowd divergence at +23 points on the under",
      "AI model confidence at 81% for sub-line outcome",
    ],
    catalysts: [
      {
        id: "cat-war-001",
        headline: "Sharp money moving to under — pace regression confirms",
        source: "AI Market Thesis Engine",
        severity: "medium",
        timestamp: "14:27:14",
        impact: "Structural value signal on the under side",
      },
    ],
    relatedSlugs: ["chiefs-vs-bills"],
    tags: ["ai-thesis", "sharp-money", "nba", "fanduel"],
  },
  {
    slug: "chiefs-vs-bills",
    title: "Chiefs vs Bills — NFL Totals",
    sport: "NFL",
    exchange: "DraftKings",
    openingPrice: 1.95,
    currentPrice: 1.88,
    direction: "down",
    movement: "−3.6%",
    volatility: 38,
    liquidity: 86,
    confidence: 69,
    aiRegime: "compression",
    aiSeverity: "low",
    description:
      "Implied volatility is contracting sharply across the Chiefs–Bills totals market. Three consecutive hours of IV compression without a triggering event — historically a precursor to a significant move.",
    aiNarrative:
      "Three hours of IV compression without a corresponding news or injury trigger is a rare structural signal. In 71% of historical NFL totals markets exhibiting this pattern, a volatility expansion event occurred within 90 minutes of market open.",
    liquidityNote:
      "Well-liquefied market at 86th percentile. Compression is happening across a deep book, which means the signal is structural rather than a thin-book artefact.",
    volatilityNote:
      "Current IV reading of 38 is in the 12th percentile for this matchup type. Compression of this magnitude without a trigger typically represents either large institutional hedging activity or a coordinated positioning ahead of news.",
    behaviouralNote:
      "Both crowd and sharp sides are quiet — low commitment from both. This collective hesitation in a compressing market often precedes a sharp directional move when the trigger event occurs.",
    keyCatalysts: [
      "3-hour consecutive IV compression — no trigger event identified",
      "Current IV at 12th percentile for this matchup class",
      "Low crowd and sharp commitment — collective hesitation pattern",
      "Historical match rate: 71% expansion within 90 min of open",
    ],
    catalysts: [
      {
        id: "cat-chi-001",
        headline: "3-hour IV compression without trigger — rare structural signal",
        source: "Volatility Engine",
        severity: "low",
        timestamp: "14:24:03",
        impact: "Precursor signal — watch for expansion trigger",
      },
    ],
    relatedSlugs: ["warriors-vs-lakers"],
    tags: ["volatility-watch", "compression", "nfl", "draftkings"],
  },
  {
    slug: "poirier-vs-gaethje",
    title: "Poirier vs Gaethje — UFC Lightweight ML",
    sport: "UFC",
    exchange: "Betfair",
    openingPrice: 2.8,
    currentPrice: 2.18,
    direction: "down",
    movement: "−22.1%",
    volatility: 79,
    liquidity: 63,
    confidence: 65,
    aiRegime: "volatile",
    aiSeverity: "high",
    description:
      "Weight-cut rumour is entering the market for the Poirier–Gaethje lightweight main event. The underdog price is shortening without matching public volume — consistent with informed money responding to non-public information.",
    aiNarrative:
      "Price movement is decoupled from observable public information flow. The underdog is shortening at a rate that requires either a volume catalyst not yet visible in the public feed, or an informational asymmetry in the market. Weight-cut rumours in UFC markets historically cause 15–40% price swings.",
    liquidityNote:
      "Liquidity is thinning as the market becomes more directional. Sharp-side volume is entering on the underdog back, but the lay side is not being matched — creating a one-sided queue structure.",
    volatilityNote:
      "IV reading of 79 is in the 91st percentile for UFC lightweight markets. This level of volatility with a non-public information catalyst is a high-risk structural configuration.",
    behaviouralNote:
      "Sharp/crowd divergence is extreme — sharp money is backing the underdog while public sentiment overwhelmingly favours the favourite. This type of divergence in UFC markets often reflects sharp access to non-public preparation information.",
    keyCatalysts: [
      "Weight-cut rumour entering market — non-public information signal",
      "Underdog shortening 22% without matching public volume",
      "Sharp-only volume entering underdog back",
      "One-sided queue structure forming on lay side",
    ],
    catalysts: [
      {
        id: "cat-poi-001",
        headline: "Weight-cut rumour — underdog price compressing",
        source: "Market Monitoring Engine",
        severity: "high",
        timestamp: "14:15:12",
        impact: "Potential non-public information in market",
      },
    ],
    relatedSlugs: [],
    tags: ["news-catalyst", "sharp-money", "ufc", "betfair"],
  },
  {
    slug: "man-city-vs-arsenal",
    title: "Man City vs Arsenal — Premier League",
    sport: "Football",
    exchange: "Pinnacle",
    openingPrice: 2.05,
    currentPrice: 2.22,
    direction: "up",
    movement: "+8.3%",
    volatility: 52,
    liquidity: 94,
    confidence: 72,
    aiRegime: "rotational",
    aiSeverity: "low",
    description:
      "Cross-market liquidity is rotating from Asian handicap into match result markets for the Man City–Arsenal Premier League fixture. Flow pattern matches institutional rebalancing rather than retail activity.",
    aiNarrative:
      "Asian handicap to match-result flow rotation is a structural signal common in large institutional portfolio rebalancing events. The volume, timing, and directionality of the rotation is inconsistent with retail behaviour — this is a considered institutional position adjustment.",
    liquidityNote:
      "Deepest liquid market in the current feed at 94th percentile. The rotation flow is being absorbed efficiently — no queue distortions. This is a high-quality, well-functioning market.",
    volatilityNote:
      "IV is moderate and stable at 52. The rotational flow is not creating price instability — instead, it is shifting the implied probability distribution while maintaining price continuity.",
    behaviouralNote:
      "Institutional flow rotation is visible in the order book structure but is not creating crowd-side reaction. This is characteristic of institutional activity that is not yet on the retail radar.",
    keyCatalysts: [
      "Asian handicap to match result rotation detected",
      "Flow pattern consistent with institutional rebalancing",
      "Volume and timing inconsistent with retail activity",
      "No crowd-side reaction to institutional movement yet",
    ],
    catalysts: [
      {
        id: "cat-mci-001",
        headline: "Institutional flow rotation — Asian handicap to match result",
        source: "Exchange Flow Engine",
        severity: "low",
        timestamp: "14:11:55",
        impact: "Structural portfolio rebalancing in progress",
      },
    ],
    relatedSlugs: [],
    tags: ["exchange-flow", "institutional", "football", "pinnacle"],
  },
  {
    slug: "us-election-contract",
    title: "US Presidential Election — Polymarket Contract",
    sport: "Prediction Markets",
    exchange: "Polymarket",
    openingPrice: 0.52,
    currentPrice: 0.58,
    direction: "up",
    movement: "+11.5%",
    volatility: 66,
    liquidity: 97,
    confidence: 78,
    aiRegime: "expansion",
    aiSeverity: "medium",
    description:
      "Volume surge detected in the US presidential election prediction market. Contract pricing is diverging from the polling consensus by 6.8 points — a structural signal of informed positioning in a deep prediction market.",
    aiNarrative:
      "Prediction markets are theoretically efficient aggregators of distributed information. A 6.8-point divergence from polling consensus at this volume level suggests either a structural inefficiency or market participants with access to information not reflected in published polls.",
    liquidityNote:
      "Deepest liquid market in the prediction category at 97th percentile. Large-volume position entries are being absorbed efficiently. The depth of this market makes it resistant to manipulation — movements are structural signals.",
    volatilityNote:
      "IV expanding at this volume level signals increasing market uncertainty or confidence in a directional move. The expansion is sustained over 3 hours — not a spike event.",
    behaviouralNote:
      "Market participants in prediction markets skew toward sophisticated, information-driven actors. The current crowd consensus aligns with polling data while sharp-side money is diverging toward a different outcome.",
    keyCatalysts: [
      "Contract pricing 6.8 points above polling consensus",
      "Volume surge — 89% above 30-day average",
      "Sustained IV expansion over 3-hour window",
      "Sharp/polling consensus divergence",
    ],
    catalysts: [
      {
        id: "cat-us-001",
        headline: "Contract price 6.8pts above polling consensus",
        source: "Polymarket Analytics",
        severity: "medium",
        timestamp: "14:18:30",
        impact: "Potential information advantage in market",
      },
    ],
    relatedSlugs: [],
    tags: ["prediction-market", "volume-surge", "polymarket"],
  },
];

// ─── Sport Hubs ───────────────────────────────────────────────────────────────

const SPORT_HUBS: SportHub[] = [
  {
    sport: "Horse Racing",
    slug: "horse-racing",
    title: "Horse Racing Markets",
    subtitle: "Exchange intelligence across Betfair, Betdaq and global racecourses",
    seoDescription:
      "Real-time horse racing market intelligence. AI-powered queue health monitoring, sharp money detection, and liquidity analysis across Betfair, Betdaq and major racecourses.",
    accentColor: "text-amber-400",
    accentBg: "bg-amber-400/10",
    accentBorder: "border-amber-400/20",
    dotColor: "bg-amber-400",
    activeMarkets: 24,
    monitoredExchanges: 3,
    marketSlugs: ["ascot-2-40", "cheltenham-3-15"],
    highlights: [
      "Queue health monitoring across all Betfair markets",
      "Sharp money detection — unmatched liability analysis",
      "Pre-race liquidity thinning alerts",
      "In-play volatility expansion signals",
    ],
    aiSummary:
      "Horse racing exchanges are showing elevated structural activity today. Queue deterioration patterns in two flagship markets suggest informed positioning ahead of race-off. AI confidence in directional signals: high.",
  },
  {
    sport: "Tennis",
    slug: "tennis",
    title: "Tennis Markets",
    subtitle: "In-play exchange intelligence across ATP, WTA and Grand Slams",
    seoDescription:
      "Real-time tennis market intelligence. AI-powered volume divergence analysis, in-play liquidity tracking, and volatility expansion detection across Smarkets, Betfair and major exchanges.",
    accentColor: "text-emerald-400",
    accentBg: "bg-emerald-400/10",
    accentBorder: "border-emerald-400/20",
    dotColor: "bg-emerald-400",
    activeMarkets: 11,
    monitoredExchanges: 4,
    marketSlugs: ["djokovic-vs-alcaraz"],
    highlights: [
      "Volume/price divergence detection in live markets",
      "Set-by-set liquidity and volatility tracking",
      "Momentum shift identification via order book analysis",
      "Cross-exchange flow monitoring for major tournaments",
    ],
    aiSummary:
      "Tennis markets are entering a high-volume session. The Wimbledon semi-final is showing volume/price divergence consistent with pre-expansion structural setup. AI models are in active monitoring mode.",
  },
  {
    sport: "NBA",
    slug: "nba",
    title: "NBA Markets",
    subtitle: "Spread and totals intelligence across major US sportsbooks",
    seoDescription:
      "Real-time NBA market intelligence. AI-powered spread and totals analysis, pace-of-play regression, sharp money tracking and structural value detection across FanDuel, DraftKings and leading exchanges.",
    accentColor: "text-blue-400",
    accentBg: "bg-blue-400/10",
    accentBorder: "border-blue-400/20",
    dotColor: "bg-blue-400",
    activeMarkets: 8,
    monitoredExchanges: 5,
    marketSlugs: ["warriors-vs-lakers"],
    highlights: [
      "Pace-of-play regression for totals analysis",
      "Sharp/public divergence monitoring",
      "Defensive scheme data integration",
      "Cross-book line movement synchronisation",
    ],
    aiSummary:
      "NBA market intelligence is concentrated on the Western Conference matchup. AI pace regression models are detecting structural value signals diverging from the current consensus line.",
  },
  {
    sport: "NFL",
    slug: "nfl",
    title: "NFL Markets",
    subtitle: "Game lines, totals and player prop intelligence across US books",
    seoDescription:
      "Real-time NFL market intelligence. AI-powered totals and spread analysis, volatility compression monitoring, sharp money tracking and structural value detection across DraftKings, FanDuel and major books.",
    accentColor: "text-zinc-300",
    accentBg: "bg-zinc-300/10",
    accentBorder: "border-zinc-300/20",
    dotColor: "bg-zinc-300",
    activeMarkets: 14,
    monitoredExchanges: 5,
    marketSlugs: ["chiefs-vs-bills"],
    highlights: [
      "Implied volatility compression and expansion tracking",
      "Sharp/public split monitoring across all major books",
      "Injury and weather catalyst detection",
      "Cross-book arbitrage and line discrepancy alerts",
    ],
    aiSummary:
      "NFL markets are in a mid-week low-activity phase with isolated structural signals. The Chiefs–Bills totals market is exhibiting a rare IV compression pattern that historically precedes significant price movement.",
  },
  {
    sport: "UFC",
    slug: "ufc",
    title: "UFC Markets",
    subtitle: "Fight market intelligence across Betfair and global books",
    seoDescription:
      "Real-time UFC market intelligence. AI-powered moneyline and method-of-victory analysis, weight-cut catalyst monitoring, sharp money detection and non-public information signals across Betfair and global books.",
    accentColor: "text-orange-400",
    accentBg: "bg-orange-400/10",
    accentBorder: "border-orange-400/20",
    dotColor: "bg-orange-400",
    activeMarkets: 6,
    monitoredExchanges: 3,
    marketSlugs: ["poirier-vs-gaethje"],
    highlights: [
      "Weight-cut rumour and injury catalyst detection",
      "Non-public information signal monitoring",
      "Method-of-victory market structural analysis",
      "Sharp/public divergence in fight markets",
    ],
    aiSummary:
      "UFC market activity is elevated ahead of the main card. A significant non-public information signal has been detected in the lightweight main event — AI confidence in the structural significance is high.",
  },
  {
    sport: "Football",
    slug: "football",
    title: "Football Markets",
    subtitle: "Premier League, Champions League and global football exchange intelligence",
    seoDescription:
      "Real-time football market intelligence. AI-powered cross-market flow analysis, Asian handicap and match result monitoring, institutional flow detection and liquidity tracking across Pinnacle, Betfair and major exchanges.",
    accentColor: "text-zinc-400",
    accentBg: "bg-zinc-400/10",
    accentBorder: "border-zinc-400/20",
    dotColor: "bg-zinc-400",
    activeMarkets: 64,
    monitoredExchanges: 6,
    marketSlugs: ["man-city-vs-arsenal"],
    highlights: [
      "Cross-market flow rotation detection",
      "Asian handicap to match result flow tracking",
      "Institutional vs retail flow classification",
      "In-play liquidity depth monitoring",
    ],
    aiSummary:
      "Football markets are running at peak volume for the mid-week session. Cross-market institutional flow rotation has been detected in the Premier League flagship fixture — a structural signal consistent with portfolio rebalancing.",
  },
  {
    sport: "Prediction Markets",
    slug: "prediction-markets",
    title: "Prediction Markets",
    subtitle: "Polymarket, Kalshi and decentralised prediction contract intelligence",
    seoDescription:
      "Real-time prediction market intelligence. AI-powered contract analysis, polling consensus divergence detection, volume surge monitoring and structural signal identification across Polymarket, Kalshi and leading prediction exchanges.",
    accentColor: "text-purple-400",
    accentBg: "bg-purple-400/10",
    accentBorder: "border-purple-400/20",
    dotColor: "bg-purple-400",
    activeMarkets: 19,
    monitoredExchanges: 4,
    marketSlugs: ["us-election-contract"],
    highlights: [
      "Polling consensus divergence monitoring",
      "Volume surge and informed money detection",
      "Cross-platform contract price comparison",
      "Structured data and event resolution tracking",
    ],
    aiSummary:
      "Prediction markets are showing above-average structural activity. The US presidential election contract is exhibiting a sustained polling/market divergence that AI models classify as a significant informational signal.",
  },
];

// ─── Accessors ────────────────────────────────────────────────────────────────

export function getAllMarkets(): Market[] {
  return MARKETS;
}

export function getMarket(slug: string): Market | undefined {
  return MARKETS.find((m) => m.slug === slug);
}

export function getMarketsForSport(sport: string): Market[] {
  return MARKETS.filter((m) => m.sport === sport);
}

export function getAllHubs(): SportHub[] {
  return SPORT_HUBS;
}

export function getHub(slug: string): SportHub | undefined {
  return SPORT_HUBS.find((h) => h.slug === slug);
}

export function getRelatedMarkets(slug: string): Market[] {
  const market = getMarket(slug);
  if (!market) return [];
  return market.relatedSlugs
    .map((s) => getMarket(s))
    .filter((m): m is Market => m !== undefined);
}
