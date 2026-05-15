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
    mainThesis: "Two flagship markets are showing queue deterioration — informed positioning is active.",
    subThesis:
      "Unmatched lay liability is 3.4× above the race-class average while price holds. The market is coiling before race-off.",
    regime: "Volatile",
    confidence: 87,
    topSignal: "Queue Deterioration",
    exchangeFlow: "Betfair → Betdaq rotation detected",
    creatorAngle: "The horse racing market is moving before the race does.",
    edge: {
      publicReading:
        "Retail flow is tracking the form book and public news. No major news event has triggered the current price action. The crowd sees a normal pre-race market.",
      sharpReading:
        "Exchange flow shows unmatched lay liability accumulating at 3.4× the race-class average — sharp-side positioning without a public catalyst. This is informed money entering ahead of a structural move.",
      aiInterpretation:
        "Queue health is deteriorating on both sides simultaneously. This bilateral pattern, without a news trigger, historically precedes a significant structural market move within 6 minutes of race-off. AI confidence: 87%.",
      riskCaveat:
        "Non-runner declarations or stewards' activity can invalidate structural signals rapidly. Monitor official communications as race-off approaches.",
      contentAngle:
        "The market is moving before the race does. That is the story — not the odds, but the structure beneath them. The exchange knows something.",
    },
    timeline: [
      { time: "09:40", event: "Liquidity normal — queue health at 82nd percentile for this race class" },
      { time: "10:15", event: "Queue depth begins thinning on the lay side — first signal" },
      { time: "10:42", event: "Price holds despite rising unmatched volume — structural divergence" },
      { time: "11:05", event: "Sharp-side back concentration detected in top two selections" },
      { time: "11:18", event: "AI flags queue health deterioration — bilateral thinning confirmed" },
      { time: "Now", event: "Volatile regime active. Informed positioning confirmed. Race-off approaching.", highlight: true },
    ],
    traderView: [
      "Queue health: 14th percentile — deteriorating rapidly",
      "Lay liability: 3.4× above race-class average",
      "Bilateral thinning — not single-side withdrawal",
      "Sharp-side back volume concentrated in final 12 minutes",
      "Price compression inconsistent with public news flow",
    ],
    creatorView: {
      story:
        "The horse racing exchange is showing the signal before the result. The market structure knows something the scoreboard has not shown yet.",
      hook: "The horse racing market is moving before the race does.",
      audienceAngle:
        "Traders, racing fans, and anyone who wants to understand what professional exchange money looks like in action.",
      visualIdea:
        "Queue depth chart showing bilateral thinning — two lines converging toward zero as race-off approaches. The visual tension builds.",
    },
    sportDepth: [
      "Queue health falling below 15th percentile — critical threshold for this race class",
      "Late-money concentration: sharp-side back volume in final 12 minutes",
      "Unmatched lay liability 3.4× above average — informed positioning signal",
      "Going and weather stable — no environmental catalyst for this movement",
      "Race-off liquidity: both sides thinning — structural pre-race configuration confirmed",
    ],
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
    mainThesis: "Djokovic vs Alcaraz is entering a pre-expansion volatility window.",
    subThesis:
      "Matched volume is rising 34% above the 20-day average while price compresses — a classic setup for delayed repricing.",
    regime: "Compression",
    confidence: 74,
    topSignal: "Volume / Price Divergence",
    exchangeFlow: "Betfair → Smarkets rotation active",
    creatorAngle: "The tennis market is moving before the scoreboard does.",
    edge: {
      publicReading:
        "Retail flow is reacting to scoreline pressure and the visible match narrative. Public sentiment is tracking the match as expected — no unusual crowd-side behaviour.",
      sharpReading:
        "Exchange flow shows elevated matched volume with price compression — a structural divergence. Sophisticated money is entering without moving price, suggesting coordinated positioning ahead of a repricing event.",
      aiInterpretation:
        "Volume/price divergence is widening. When matched volume runs 34% above the 20-day average while price stays flat, the structural model rates this as a pre-expansion coiled-spring setup. AI confidence: 74%.",
      riskCaveat:
        "In-play markets are subject to rapid regime change. A single break of serve can invalidate the structural setup within seconds. This is a structural read, not a directional call.",
      contentAngle:
        "The market is building pressure while the score stays still. That gap between the market and the narrative — that is the clip.",
    },
    timeline: [
      { time: "13:20", event: "Market opens at 2.10 — normal pre-match liquidity" },
      { time: "13:45", event: "Matched volume rises 18% above the 20-day average" },
      { time: "14:02", event: "Price compresses despite continued elevated volume" },
      { time: "14:15", event: "Buy/sell imbalance tilts 62/38 toward the back side" },
      { time: "14:29", event: "AI flags volume/price divergence — structural signal confirmed" },
      { time: "Now", event: "Pre-expansion compression active. Coiled spring setup confirmed.", highlight: true },
    ],
    traderView: [
      "Volume/price divergence: 34% above average volume, price flat",
      "Buy/sell imbalance: 62/38 toward back side",
      "Crowd/sharp consensus alignment — rare in this match",
      "Set momentum: 1–1 — no clean directional read",
      "Cross-exchange: Betfair → Smarkets rotation in progress",
    ],
    creatorView: {
      story:
        "The tennis exchange is showing elevated volume while the price stays still. The market is loading before it fires. The score does not show it yet.",
      hook: "The tennis market is moving before the scoreboard does.",
      audienceAngle:
        "Tennis fans, trading content creators, anyone tracking Wimbledon. High-profile matchup with a hidden structural story the mainstream won't cover.",
      visualIdea:
        "Side-by-side: price chart (flat) vs volume chart (rising). The visual gap between the two lines is the entire story.",
    },
    sportDepth: [
      "Set momentum: both players at 1–1 — no clean directional momentum to follow",
      "Serve pressure: Alcaraz first-serve win rate 68% vs average 72% — slight regression",
      "In-play liquidity: 88th percentile — deep market, signals are structural not noise",
      "Price compression: holding despite 34% volume premium — coiled spring confirmed",
      "Scoreboard vs market divergence: the market is not following the score",
    ],
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
    mainThesis: "Pace regression models are detecting structural value on the under — sharp money is aligning.",
    subThesis:
      "Both teams are deploying low-tempo defensive sets. The current totals line is 4.2 points above the pace-projected total.",
    regime: "Compression",
    confidence: 81,
    topSignal: "Pace Regression / Totals Divergence",
    exchangeFlow: "Sharp consensus: FanDuel → DraftKings line movement",
    creatorAngle: "The NBA totals line hasn't caught up to the defensive scheme data.",
    edge: {
      publicReading:
        "Public sentiment is on the over — high-scoring teams, big names, casual fan expectation of an offensive game. Retail is following the narrative, not the data.",
      sharpReading:
        "Pace regression across the last 7 games for both teams projects a total 4.2 below the current market line. Sharp money is moving to the under. Consistent across FanDuel and DraftKings.",
      aiInterpretation:
        "Defensive scheme analysis confirms both teams are deploying low-tempo sets. When pace regression and scheme data align with sharp-side flow, the AI model rates this as a high-confidence structural value signal. Confidence: 81%.",
      riskCaveat:
        "Injury news within 90 minutes of tip-off can rapidly reprice totals markets. Monitor official injury reports from both teams as game time approaches.",
      contentAngle:
        "The public sees Warriors vs Lakers and expects fireworks. The data sees two teams in defensive mode. The line has not caught up. That gap is the trade.",
    },
    timeline: [
      { time: "09:00", event: "Line opens at consensus — public sentiment bullish on overs" },
      { time: "10:30", event: "Pace regression flags both teams in low-tempo defensive sets" },
      { time: "12:00", event: "Defensive scheme analysis confirms — projection 4.2 below the line" },
      { time: "13:15", event: "Sharp-side flow begins moving to under across FanDuel and DraftKings" },
      { time: "14:27", event: "Sharp/crowd divergence reaches +23 points — AI flags structural value" },
      { time: "Now", event: "Compression regime. Structural value signal confirmed on the under side.", highlight: true },
    ],
    traderView: [
      "Pace regression: total projection 4.2 below current consensus line",
      "Defensive scheme: both teams confirmed in low-tempo sets",
      "Sharp/crowd divergence: +23 points toward under",
      "Line movement: consistent across FanDuel and DraftKings",
      "AI confidence: 81% for sub-line outcome",
    ],
    creatorView: {
      story:
        "The public thinks Warriors vs Lakers means points. The data thinks it means defense. The line has not moved yet. The divergence is the story.",
      hook: "The NBA totals line hasn't caught up to the defensive scheme data.",
      audienceAngle:
        "NBA fans, sports analytics followers, anyone interested in sharp vs public split content. High-engagement matchup with a counterintuitive data angle.",
      visualIdea:
        "Chart: current line vs pace-projected total. The 4.2-point gap highlighted. Simple, visual, shareable — the gap tells the story.",
    },
    sportDepth: [
      "Injury: no confirmed absences — clean data environment for structural reads",
      "Spread pressure: public on Lakers +4 — sharp side on Warriors −4",
      "Totals movement: under volume accelerating across major books",
      "Sharp/public split: sharp under, public over — +23 point divergence",
      "Pace model: 7-game rolling regression for both teams confirms low-tempo setup",
    ],
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
    mainThesis: "Three consecutive hours of IV compression without a triggering event — a rare structural precursor.",
    subThesis:
      "Current implied volatility at the 12th percentile for this matchup class. Historical match rate for expansion: 71% within 90 minutes of market open.",
    regime: "Compression",
    confidence: 69,
    topSignal: "IV Compression / No Trigger",
    exchangeFlow: "Low commitment both sides — collective hesitation pattern",
    creatorAngle: "The NFL market is compressing before it moves. This is the quiet before.",
    edge: {
      publicReading:
        "Retail is treating this as a standard mid-week market. No breaking news, no injury catalyst. Public participation is low and undirected.",
      sharpReading:
        "Sophisticated market participants are not committing. Both crowd and sharp sides are quiet. This collective hesitation in a compressing market is a pre-event positioning pattern — both sides waiting for the trigger.",
      aiInterpretation:
        "Three hours of consecutive IV compression at the 12th percentile without a trigger is a statistically rare configuration. In 71% of historical matches, this pattern resolves as a volatility expansion event within 90 minutes of market open.",
      riskCaveat:
        "Compression can resolve sideways rather than upward. This signal is directionally agnostic — it indicates movement probability, not movement direction.",
      contentAngle:
        "The market is compressing before it moves. Three hours. No trigger. The question is not which way — it is when. That is the story.",
    },
    timeline: [
      { time: "09:00", event: "Market opens — IV at normal pre-week levels" },
      { time: "10:00", event: "First hour of compression — no trigger event identified" },
      { time: "11:00", event: "Second consecutive hour of compression — AI monitoring begins" },
      { time: "12:00", event: "Third consecutive hour — now in rare structural territory" },
      { time: "14:24", event: "AI flags: IV at 12th percentile, no trigger. Rare pre-expansion configuration." },
      { time: "Now", event: "Compression regime active. 71% historical rate of expansion within 90min of open.", highlight: true },
    ],
    traderView: [
      "IV: 38 — 12th percentile for this matchup class",
      "3-hour consecutive compression — no trigger identified",
      "Both crowd and sharp side quiet — collective hesitation",
      "Historical expansion rate: 71% within 90min of open",
      "Weather: stable — no environmental catalyst active",
    ],
    creatorView: {
      story:
        "The Chiefs vs Bills total is in a rare compression state. Three hours of the market tightening without a reason. Something is coming. The data is watching.",
      hook: "The NFL market is compressing before it moves. This is the quiet before.",
      audienceAngle:
        "NFL fans, analytics traders, anyone tracking line movement in major matchups. The compression story works for both casual and sophisticated audiences.",
      visualIdea:
        "IV chart showing three-hour compression trend. A flat line slowly descending. The tension builds visually — then the question: what breaks it?",
    },
    sportDepth: [
      "Weather: stable conditions — no field or weather catalyst identified",
      "Totals compression: IV at 12th percentile — deepest compression in current session",
      "Line movement: no significant move yet — market awaiting trigger event",
      "Injury reports: clean — no late scratches affecting current pricing",
      "Sharp spread pressure: sharp side uncommitted — waiting for trigger confirmation",
    ],
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
    mainThesis: "Weight-cut rumour is entering the market — underdog shortening without matching public volume.",
    subThesis:
      "Sharp-only volume is backing the underdog. The lay side is asymmetric. Non-public information may be in this market.",
    regime: "Volatile",
    confidence: 65,
    topSignal: "Non-Public Information Signal",
    exchangeFlow: "Sharp-only underdog flow — Betfair queue asymmetric",
    creatorAngle: "UFC markets move on information the public doesn't have yet.",
    edge: {
      publicReading:
        "Public sentiment overwhelmingly favours the favourite. Retail is following the pre-fight narrative, hype, and press conference read. No mainstream catalyst is visible.",
      sharpReading:
        "Underdog price is compressing 22% without matching public volume. Sharp-only flow entering underdog back while lay side remains thin. This configuration in UFC markets historically follows access to non-public preparation information.",
      aiInterpretation:
        "Price movement decoupled from observable public information flow. Weight-cut rumours in UFC markets historically cause 15–40% price swings. Current movement is at the lower bound — suggesting early-stage information entry. AI confidence: 65%.",
      riskCaveat:
        "UFC weight-cut rumours frequently prove false. This is a high-risk, high-information-asymmetry configuration. Structural read only — not a directional call.",
      contentAngle:
        "The underdog is shortening. Nobody in the public news feed knows why. The exchange sees it. That asymmetry between public narrative and market action — that is the content.",
    },
    timeline: [
      { time: "12:00", event: "Fight market opens — favourite at 1.45, underdog at 2.80" },
      { time: "13:15", event: "Weight-cut rumour enters — not yet in public news cycle" },
      { time: "13:42", event: "Underdog back volume begins accumulating — no lay matching" },
      { time: "14:00", event: "Underdog price compresses to 2.40 — sharp-only flow confirmed" },
      { time: "14:15", event: "AI flags: price compression without public catalyst — non-public signal" },
      { time: "Now", event: "Volatile regime. Underdog at 2.18. Sharp/crowd divergence extreme.", highlight: true },
    ],
    traderView: [
      "Underdog shortening: 2.80 → 2.18 (−22%) without public catalyst",
      "Queue structure: asymmetric — lay side thin, back side active",
      "Sharp/crowd divergence: extreme — sharp on underdog, crowd on favourite",
      "Weight-cut signal: rumour circulating but not yet in public news cycle",
      "IV: 79 — 91st percentile for UFC lightweight markets",
    ],
    creatorView: {
      story:
        "The underdog is shortening and nobody in the public news cycle has explained why. The exchange knows something the mainstream hasn't published yet.",
      hook: "UFC markets move on information the public doesn't have yet.",
      audienceAngle:
        "UFC fans, trading content creators, MMA analysts. High-engagement topic with a structural story most audiences will never find on their own.",
      visualIdea:
        "Price chart showing the 22% underdog compression vs flat public news volume. The two lines moving in opposite directions is the visual story.",
    },
    sportDepth: [
      "Weight cut: rumour circulating — not confirmed in public feed",
      "Late money: sharp-only underdog flow — 3.2× above average for this weight class",
      "Underdog shortening: 22% price compression without public news catalyst",
      "Public hype vs sharp flow: maximum divergence — opposite sides of the book",
      "Queue health: asymmetric — lay side one-sided, creating a structurally dangerous configuration",
    ],
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
    mainThesis: "Institutional flow is rotating from Asian handicap into match result — rebalancing event in progress.",
    subThesis:
      "The flow pattern is inconsistent with retail behaviour. Volume, timing, and directionality all indicate institutional portfolio adjustment that has not yet registered in the crowd.",
    regime: "Rotational",
    confidence: 72,
    topSignal: "Asian Handicap → Match Result Rotation",
    exchangeFlow: "Institutional rebalancing — Pinnacle → Betfair flow",
    creatorAngle: "The institutional money is quietly rotating. The public hasn't noticed yet.",
    edge: {
      publicReading:
        "Retail flow is tracking the match result market normally. No significant news event has caused visible crowd reaction. Public participation is at expected levels for this fixture.",
      sharpReading:
        "Cross-market rotation from Asian handicap to match result is a signature institutional rebalancing pattern. Volume, timing, and directionality are inconsistent with retail. This is a considered position adjustment from a large participant.",
      aiInterpretation:
        "Asian handicap to match-result rotation at this volume and speed is a structural institutional signal. The rotation is being absorbed efficiently — no queue distortions — confirming depth and intent. AI model confidence: 72%.",
      riskCaveat:
        "Lineup news within 75 minutes of kick-off can rapidly invalidate any pre-match structural signal. Monitor official team sheets from both clubs.",
      contentAngle:
        "The institutional money is quietly rotating in the Man City vs Arsenal market. The public feed shows nothing. The order book shows everything. That gap is the story.",
    },
    timeline: [
      { time: "10:00", event: "Asian handicap market opens — normal institutional volume levels" },
      { time: "11:30", event: "First rotation signals detected — AH volume declining" },
      { time: "12:15", event: "Match result volume rising — rotation pattern emerging" },
      { time: "13:00", event: "AI confirms rotation: volume, timing, direction all institutional" },
      { time: "14:11", event: "Rotation confirmed — no crowd-side reaction detected yet" },
      { time: "Now", event: "Rotational regime active. Institutional flow into match result. Crowd unaware.", highlight: true },
    ],
    traderView: [
      "AH → match result rotation: confirmed institutional pattern",
      "Liquidity: 94th percentile — deepest market in current session",
      "Queue: no distortions — rotation absorbed efficiently",
      "Crowd reaction: none — institutional move not yet on retail radar",
      "AI classification: portfolio rebalancing with high confidence",
    ],
    creatorView: {
      story:
        "The biggest football match in the current session has an institutional rotation event happening beneath the surface. The scoreboard story has not started. The market story has.",
      hook: "The institutional money is quietly rotating. The public hasn't noticed yet.",
      audienceAngle:
        "Football traders, analytics followers, Premier League fans who want the behind-the-scenes market story before the mainstream picks it up.",
      visualIdea:
        "Two columns: Asian handicap volume (falling) vs match result volume (rising). The crossover point is the story.",
    },
    sportDepth: [
      "Lineup: team sheets not yet released — monitor for surprises affecting market direction",
      "Asian handicap flow: declining as rotation into match result accelerates",
      "Match result rotation: institutional volume entering at an abnormal rate",
      "Totals movement: stable — rotation is directional, not volatility-driven",
      "Cross-exchange: Pinnacle → Betfair price convergence in progress",
    ],
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
    mainThesis: "The US election contract is pricing 6.8 points above the polling consensus — sustained divergence.",
    subThesis:
      "Volume is 89% above the 30-day average. The market has been repricing for three hours without a news trigger. Sophisticated money is moving.",
    regime: "Expansion",
    confidence: 78,
    topSignal: "Polling Consensus Divergence",
    exchangeFlow: "Volume surge: Polymarket → Kalshi convergence",
    creatorAngle: "The prediction market knows something the polls don't.",
    edge: {
      publicReading:
        "Polling consensus is tracking expected outcomes. Mainstream media coverage aligns with the current polling picture. Public sentiment follows the headline numbers without questioning the divergence.",
      sharpReading:
        "The prediction market is pricing 6.8 points above polling consensus. At 97th percentile liquidity, this is not a noise event. Sophisticated, information-driven participants are driving the divergence — sustained over three hours.",
      aiInterpretation:
        "Prediction markets function as distributed information aggregators. A 6.8-point sustained divergence from polling consensus, at this volume level, over a three-hour window, is a statistically significant structural signal. AI confidence: 78%.",
      riskCaveat:
        "Prediction markets can exhibit brief extreme divergences driven by large single-actor positions. The sustained nature of this move (3 hours) reduces but does not eliminate this risk.",
      contentAngle:
        "The prediction market knows something the polls don't. Or the prediction market is wrong. Either version of that story is the content — and either way, it is more interesting than the polls.",
    },
    timeline: [
      { time: "11:00", event: "Contract trading at normal volume — aligned with polling consensus" },
      { time: "12:00", event: "Volume begins rising — 30% above average and accelerating" },
      { time: "13:00", event: "Price diverges from polling consensus by 3 points" },
      { time: "14:00", event: "Divergence widens to 5.5 points — sustained IV expansion" },
      { time: "14:18", event: "AI flags: 6.8pt divergence, 89% volume premium, 3-hour window" },
      { time: "Now", event: "Expansion regime. 6.8pt divergence from polls. Market vs polls story active.", highlight: true },
    ],
    traderView: [
      "Contract price: 6.8 points above polling consensus",
      "Volume: 89% above 30-day average — sustained, not a spike",
      "IV expansion: sustained over 3-hour window",
      "Liquidity: 97th percentile — deepest market in prediction category",
      "Cross-platform: Polymarket and Kalshi pricing converging",
    ],
    creatorView: {
      story:
        "The prediction market and the polls are telling different stories. The market has been diverging for three hours. The volume is 89% above average. Something is different.",
      hook: "The prediction market knows something the polls don't.",
      audienceAngle:
        "Political followers, prediction market traders, analytics audiences. The prediction vs polling divergence is universally interesting with both casual and sophisticated appeal.",
      visualIdea:
        "Chart: polling consensus line (flat) vs contract price (rising). The 6.8-point gap highlighted at the current timestamp. Clean, simple, shareable.",
    },
    sportDepth: [
      "Polling divergence: 6.8 points above polling consensus — sustained 3-hour trend",
      "Volume surge: 89% above 30-day average — not a noise event",
      "Contract repricing: sustained IV expansion across the full session",
      "Sentiment mismatch: market pricing vs public narrative significantly diverged",
      "Cross-platform: Polymarket and Kalshi showing converging price action",
    ],
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
