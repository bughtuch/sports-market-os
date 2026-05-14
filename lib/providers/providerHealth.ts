/**
 * providerHealth.ts — Provider health tracking for the live intelligence system.
 *
 * Tracks per-provider health metrics: latency, degraded state, fallback counts, uptime.
 * State is derived from environment configuration — in production this would be backed
 * by a time-series store or a health-check polling loop.
 */

export type ProviderHealthStatus = "healthy" | "degraded" | "offline" | "simulated" | "planned";

export interface ProviderHealth {
  id:            string;
  name:          string;
  category:      "intelligence" | "exchange" | "odds" | "news" | "ai" | "distribution";
  status:        ProviderHealthStatus;
  mode:          "live" | "hybrid" | "simulation" | "planned";
  avgLatencyMs:  number;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  fallbackCount: number;
  uptimePct:     number; // 0–100
  degraded:      boolean;
  description:   string;
}

export interface ProviderHealthSummary {
  providers:          ProviderHealth[];
  healthyCount:       number;
  degradedCount:      number;
  simulatedCount:     number;
  plannedCount:       number;
  offlineCount:       number;
  avgUptimePct:       number;
  systemHealthScore:  number; // 0–100
  generatedAt:        string;
}

function minsAgo(n: number): string {
  return new Date(Date.now() - n * 60_000).toISOString();
}

export function getProviderHealth(): ProviderHealthSummary {
  const hasNewsKey    = !!process.env.SPORTS_NEWS_API_KEY;
  const hasOddsKey    = !!process.env.THE_ODDS_API_KEY;
  const hasBetfair    = !!process.env.BETFAIR_APP_KEY;
  const hasProphetX   = !!process.env.PROPHETX_API_KEY;

  const providers: ProviderHealth[] = [
    {
      id:            "ph-001",
      name:          "AI Engine",
      category:      "ai",
      status:        "healthy",
      mode:          "live",
      avgLatencyMs:  340,
      lastSuccessAt: minsAgo(1),
      lastFailureAt: null,
      fallbackCount: 0,
      uptimePct:     99.8,
      degraded:      false,
      description:   "Regime, narrative, brief, opportunity, and behaviour generation via Claude API.",
    },
    {
      id:            "ph-002",
      name:          "News API",
      category:      "news",
      status:        hasNewsKey ? "healthy" : "simulated",
      mode:          hasNewsKey ? "live" : "simulation",
      avgLatencyMs:  hasNewsKey ? 420 : 12,
      lastSuccessAt: minsAgo(3),
      lastFailureAt: hasNewsKey ? null : minsAgo(720),
      fallbackCount: hasNewsKey ? 0 : 14,
      uptimePct:     hasNewsKey ? 98.2 : 100,
      degraded:      false,
      description:   hasNewsKey
        ? "NewsAPI.org wire feed active. Sports catalysts and headlines live."
        : "Simulated news feed. Set SPORTS_NEWS_API_KEY to activate live data.",
    },
    {
      id:            "ph-003",
      name:          "Odds API",
      category:      "odds",
      status:        hasOddsKey ? "healthy" : "simulated",
      mode:          hasOddsKey ? "live" : "simulation",
      avgLatencyMs:  hasOddsKey ? 280 : 8,
      lastSuccessAt: minsAgo(2),
      lastFailureAt: null,
      fallbackCount: hasOddsKey ? 1 : 0,
      uptimePct:     hasOddsKey ? 99.1 : 100,
      degraded:      false,
      description:   hasOddsKey
        ? "The Odds API active. Live price movements across sports."
        : "Simulated odds movements. Set THE_ODDS_API_KEY to activate live data.",
    },
    {
      id:            "ph-004",
      name:          "Betfair Read-Only",
      category:      "exchange",
      status:        hasBetfair ? "healthy" : "planned",
      mode:          hasBetfair ? "live" : "planned",
      avgLatencyMs:  hasBetfair ? 95 : 0,
      lastSuccessAt: hasBetfair ? minsAgo(1) : null,
      lastFailureAt: null,
      fallbackCount: 0,
      uptimePct:     hasBetfair ? 99.6 : 0,
      degraded:      false,
      description:   hasBetfair
        ? "Betfair Exchange Streaming API connected — read-only price feed active."
        : "Adapter ready. Set BETFAIR_APP_KEY + BETFAIR_SESSION_TOKEN to activate.",
    },
    {
      id:            "ph-005",
      name:          "ProphetX Read-Only",
      category:      "exchange",
      status:        hasProphetX ? "healthy" : "planned",
      mode:          hasProphetX ? "live" : "planned",
      avgLatencyMs:  hasProphetX ? 110 : 0,
      lastSuccessAt: hasProphetX ? minsAgo(2) : null,
      lastFailureAt: null,
      fallbackCount: 0,
      uptimePct:     hasProphetX ? 98.9 : 0,
      degraded:      false,
      description:   hasProphetX
        ? "ProphetX market data feed connected — read-only order book active."
        : "Pending commercial API agreement. Set PROPHETX_API_KEY to activate.",
    },
    {
      id:            "ph-006",
      name:          "Exchange Flow Engine",
      category:      "exchange",
      status:        "simulated",
      mode:          "simulation",
      avgLatencyMs:  6,
      lastSuccessAt: minsAgo(0),
      lastFailureAt: null,
      fallbackCount: 0,
      uptimePct:     100,
      degraded:      false,
      description:   "Cross-exchange liquidity rotation data — simulation mode until live exchange feeds active.",
    },
    {
      id:            "ph-007",
      name:          "Export Engine",
      category:      "distribution",
      status:        "healthy",
      mode:          "live",
      avgLatencyMs:  180,
      lastSuccessAt: minsAgo(5),
      lastFailureAt: null,
      fallbackCount: 0,
      uptimePct:     100,
      degraded:      false,
      description:   "html-to-image PNG capture, layout/theme rendering, export event tracking active.",
    },
    {
      id:            "ph-008",
      name:          "Distribution Queue",
      category:      "distribution",
      status:        "healthy",
      mode:          "live",
      avgLatencyMs:  24,
      lastSuccessAt: minsAgo(2),
      lastFailureAt: null,
      fallbackCount: 0,
      uptimePct:     100,
      degraded:      false,
      description:   "Supabase cloud sync + localStorage fallback. Social adapters in mock mode.",
    },
  ];

  const healthyCount   = providers.filter(p => p.status === "healthy").length;
  const degradedCount  = providers.filter(p => p.status === "degraded").length;
  const simulatedCount = providers.filter(p => p.status === "simulated").length;
  const plannedCount   = providers.filter(p => p.status === "planned").length;
  const offlineCount   = providers.filter(p => p.status === "offline").length;

  const activeProv = providers.filter(p => p.mode !== "planned");
  const avgUptimePct = activeProv.length > 0
    ? Math.round(activeProv.reduce((s, p) => s + p.uptimePct, 0) / activeProv.length * 10) / 10
    : 100;

  // Score: healthy=100, simulated=60, degraded=25, offline/planned=0
  const scoreSum = providers.reduce((s, p) => {
    if (p.status === "healthy")   return s + 100;
    if (p.status === "simulated") return s + 60;
    if (p.status === "degraded")  return s + 25;
    return s;
  }, 0);
  const systemHealthScore = Math.round(scoreSum / providers.length);

  return {
    providers,
    healthyCount,
    degradedCount,
    simulatedCount,
    plannedCount,
    offlineCount,
    avgUptimePct,
    systemHealthScore,
    generatedAt: new Date().toISOString(),
  };
}
