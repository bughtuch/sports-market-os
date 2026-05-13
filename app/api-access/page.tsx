import Link from "next/link";
import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import PlanBadge from "@/components/PlanBadge";
import Footer from "@/components/Footer";
import { API_EMAIL } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: "API Access — Market Intelligence Data Feed | Sports Market OS",
  description:
    "Structured API access to Sports Market OS intelligence feeds. Market data, AI narratives, odds movements, liquidity signals, and volatility analytics for intelligence systems.",
};

// ─── Endpoint definitions ─────────────────────────────────────────────────────

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/live/signals",
    description: "Live market intelligence signals",
    plan: "free" as const,
    refreshRate: "30s",
    sample: `{
  "signals": [
    {
      "id": "sig-001",
      "sport": "Horse Racing",
      "market": "Ascot 2:40",
      "type": "Sharp Money",
      "confidence": 87,
      "movement": "+34.2%",
      "direction": "up",
      "timestamp": "2026-05-13T14:32:08Z"
    }
  ],
  "meta": { "mode": "simulated", "count": 8 }
}`,
  },
  {
    method: "GET",
    path: "/api/live/news",
    description: "News catalyst feed",
    plan: "free" as const,
    refreshRate: "60s",
    sample: `{
  "items": [
    {
      "id": "news-001",
      "headline": "Sharp money detected — Ascot 2:40",
      "sport": "Horse Racing",
      "severity": "high",
      "catalystType": "Sharp Money",
      "impact": "Queue deterioration signal"
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/live/odds",
    description: "Odds snapshots and movement data",
    plan: "free" as const,
    refreshRate: "30s",
    sample: `{
  "snapshots": [
    {
      "market": "Ascot 2:40",
      "openingPrice": 4.20,
      "currentPrice": 3.10,
      "movementPct": -26.2,
      "direction": "down",
      "volatility": 84
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/ai/narrative",
    description: "AI market narrative engine output",
    plan: "api" as const,
    refreshRate: "15s",
    sample: `{
  "narrative": {
    "id": "narr-001",
    "narrative": "Sharp unmatched volume accumulating...",
    "regimeTag": "VOLATILE",
    "severity": "high",
    "confidence": 87,
    "affectedMarkets": ["Ascot 2:40", "Cheltenham 3:15"]
  },
  "mode": "simulated"
}`,
  },
  {
    method: "GET",
    path: "/api/ai/regime",
    description: "Global market regime classification",
    plan: "api" as const,
    refreshRate: "20s",
    sample: `{
  "regime": {
    "regime": "volatile",
    "confidence": 82,
    "commentary": "Multiple markets exhibiting...",
    "triggerFactors": ["sharp_money", "iv_expansion"]
  },
  "mode": "simulated"
}`,
  },
  {
    method: "GET",
    path: "/api/ai/liquidity",
    description: "Liquidity engine analysis",
    plan: "api" as const,
    refreshRate: "12s",
    sample: `{
  "insight": {
    "interpretation": "Order book depth falling...",
    "structuralPressure": 78,
    "spoofRisk": 42,
    "liquidityQuality": 34,
    "buyImbalance": 62,
    "sellImbalance": 38,
    "confidence": 87
  }
}`,
  },
  {
    method: "GET",
    path: "/api/ai/volatility",
    description: "Volatility regime and anomaly detection",
    plan: "api" as const,
    refreshRate: "12s",
    sample: `{
  "insight": {
    "regime": "expansion",
    "projectedMovement": 18.4,
    "anomalyScore": 71,
    "confidence": 78,
    "affectedSports": ["Horse Racing", "Tennis"]
  }
}`,
  },
  {
    method: "GET",
    path: "/api/ai/opportunities",
    description: "AI opportunity scanner results",
    plan: "api" as const,
    refreshRate: "15s",
    sample: `{
  "opportunities": [
    {
      "title": "Queue depth anomaly — Ascot",
      "category": "liquidity",
      "confidence": 87,
      "severity": "high",
      "explanation": "Market intelligence observation only..."
    }
  ],
  "count": 3
}`,
  },
  {
    method: "WS",
    path: "/ws/live/feed",
    description: "Real-time WebSocket event stream",
    plan: "api" as const,
    refreshRate: "real-time",
    soon: true,
    sample: `// Coming in a future release
// Streaming feed of market events
{
  "type": "volatility_spike",
  "market": "Ascot 2:40",
  "severity": "high",
  "timestamp": "..."
}`,
  },
];

const METHOD_STYLE: Record<string, string> = {
  GET: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  POST: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  WS:  "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function APIAccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MarketTicker />
      <TerminalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-12 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Sports Market OS · API Infrastructure
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">API Access</h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mb-6">
              Structured market intelligence feeds for systems, models, and data
              infrastructure. REST endpoints today — WebSocket streams coming.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pricing#api"
                className="inline-block text-[11px] font-mono text-black bg-white px-4 py-2 rounded-sm hover:bg-zinc-200 transition-colors"
              >
                Unlock API Access →
              </Link>
              <Link
                href="/pricing"
                className="inline-block text-[11px] font-mono text-zinc-400 border border-zinc-700 px-4 py-2 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 py-6 border-b border-zinc-900/80 bg-zinc-950/40">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Endpoints",      value: "9",        sub: "REST + WS" },
              { label: "Refresh",        value: "1s",       sub: "min interval (API)" },
              { label: "Sports covered", value: "7",        sub: "all categories" },
              { label: "AI engines",     value: "6",        sub: "feeding the API" },
            ].map((s) => (
              <div key={s.label} className="border border-zinc-800/60 rounded-sm p-4 bg-zinc-950">
                <p className="text-xl font-bold text-blue-400 tabular-nums">{s.value}</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">{s.label}</p>
                <p className="text-zinc-700 text-[9px] font-mono mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Endpoint reference */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Endpoint reference
            </p>

            <div className="space-y-3">
              {ENDPOINTS.map((ep) => (
                <div
                  key={ep.path}
                  className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden"
                >
                  {/* Endpoint header */}
                  <div className="px-4 py-3 flex items-center gap-3 flex-wrap border-b border-zinc-900/60">
                    <span
                      className={`text-[8px] font-mono px-1.5 py-0.5 border rounded-sm ${METHOD_STYLE[ep.method]}`}
                    >
                      {ep.method}
                    </span>
                    <code className="text-zinc-200 text-[11px] font-mono flex-1">
                      {ep.path}
                    </code>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-zinc-600 text-[8px] font-mono">
                        {ep.refreshRate}
                      </span>
                      <PlanBadge plan={ep.plan} />
                      {ep.soon && <PlanBadge plan="soon" />}
                    </div>
                  </div>

                  {/* Description + sample */}
                  <div className="px-4 py-3">
                    <p className="text-zinc-400 text-[11px] mb-3">{ep.description}</p>
                    {ep.plan === "api" && !ep.soon ? (
                      <div className="relative">
                        <pre className="text-[9px] font-mono text-zinc-600 bg-zinc-900/60 rounded-sm p-3 overflow-x-auto leading-relaxed">
                          {ep.sample}
                        </pre>
                        <div className="absolute inset-0 flex items-center justify-center rounded-sm">
                          <div className="bg-zinc-950/95 border border-zinc-800 rounded-sm px-4 py-2.5 text-center">
                            <PlanBadge plan="api" size="sm" />
                            <p className="text-zinc-500 text-[9px] mt-1">
                              Available on API plan
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : ep.soon ? (
                      <pre className="text-[9px] font-mono text-zinc-700 bg-zinc-900/40 rounded-sm p-3 overflow-x-auto leading-relaxed">
                        {ep.sample}
                      </pre>
                    ) : (
                      <pre className="text-[9px] font-mono text-zinc-400 bg-zinc-900/60 rounded-sm p-3 overflow-x-auto leading-relaxed">
                        {ep.sample}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Auth preview */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Authentication
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
                <p className="text-zinc-300 text-[11px] font-medium mb-2">API Key (coming)</p>
                <pre className="text-[9px] font-mono text-zinc-600 bg-zinc-900/60 rounded-sm p-3">
{`Authorization: Bearer smos_api_••••••••••••

# Headers
X-Plan: api
X-Version: 1.0`}
                </pre>
                <PlanBadge plan="soon" />
              </div>
              <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
                <p className="text-zinc-300 text-[11px] font-medium mb-2">Rate limits</p>
                <div className="space-y-2">
                  {[
                    { plan: "free" as const,    rate: "30s refresh, public endpoints" },
                    { plan: "partner" as const, rate: "10s refresh, creator endpoints" },
                    { plan: "api" as const,     rate: "1s refresh, all endpoints" },
                  ].map((r) => (
                    <div key={r.plan} className="flex items-center gap-2">
                      <PlanBadge plan={r.plan} />
                      <span className="text-zinc-500 text-[10px]">{r.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Provider integrations */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Provider integrations
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "Betfair",    status: "active",  plan: "api" as const },
                { name: "Betdaq",     status: "active",  plan: "api" as const },
                { name: "Smarkets",   status: "active",  plan: "api" as const },
                { name: "Polymarket", status: "active",  plan: "api" as const },
                { name: "Kalshi",     status: "planned", plan: "api" as const },
                { name: "Pinnacle",   status: "planned", plan: "api" as const },
                { name: "FanDuel",    status: "planned", plan: "api" as const },
                { name: "DraftKings", status: "planned", plan: "api" as const },
              ].map((p) => (
                <div
                  key={p.name}
                  className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-3 flex items-center justify-between"
                >
                  <span className="text-zinc-300 text-[11px]">{p.name}</span>
                  <span
                    className={`text-[8px] font-mono ${
                      p.status === "active"
                        ? "text-emerald-600"
                        : "text-zinc-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-12">
          <div className="max-w-xl mx-auto text-center">
            <PlanBadge plan="api" size="sm" />
            <h2 className="text-xl font-bold mt-4 mb-3">
              Structured data for intelligence systems.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              API access activates when billing goes live. Join the waitlist for
              early access and dedicated onboarding.
            </p>
            <Link
              href="/pricing#api"
              className="inline-block text-sm font-medium text-black bg-white px-6 py-2.5 rounded-sm hover:bg-zinc-200 transition-colors"
            >
              Unlock API access →
            </Link>
          </div>
        </section>

        {/* Enterprise contact CTA */}
        <section className="px-6 py-10 border-t border-zinc-900/60">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
              Enterprise API
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Need higher rate limits, custom endpoints, or dedicated onboarding? We work directly with data infrastructure teams.
            </p>
            <Link
              href="/contact"
              className="inline-block text-xs font-mono text-zinc-400 border border-zinc-700 px-5 py-2 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
            >
              Contact us →
            </Link>
            <p className="text-zinc-700 text-[9px] font-mono mt-3">{API_EMAIL}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
