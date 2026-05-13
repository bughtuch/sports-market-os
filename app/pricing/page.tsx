"use client";

import { useState } from "react";
import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import PlanBadge from "@/components/PlanBadge";
import { PLANS } from "@/lib/plans/plans";

// ─── Check icon ───────────────────────────────────────────────────────────────

function Check({ color }: { color: string }) {
  return <span className={`text-[10px] font-bold ${color}`}>✓</span>;
}

function Dash() {
  return <span className="text-zinc-800 text-[10px]">—</span>;
}

// ─── Pricing page ─────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MarketTicker />
      <TerminalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-16 md:py-24 text-center border-b border-zinc-900/80">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Sports Market OS · Intelligence Platform
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Choose your access tier.
            </h1>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
              Free terminal access forever. Upgrade for creator infrastructure,
              partner analytics, and structured data feeds.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setAnnual(false)}
                className={`text-[11px] font-mono px-3 py-1.5 rounded-sm border transition-colors ${
                  !annual
                    ? "text-white border-zinc-600 bg-zinc-800/60"
                    : "text-zinc-600 border-zinc-800/60 hover:text-zinc-400"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-sm border transition-colors ${
                  annual
                    ? "text-white border-zinc-600 bg-zinc-800/60"
                    : "text-zinc-600 border-zinc-800/60 hover:text-zinc-400"
                }`}
              >
                Annual
                <span className="text-[8px] font-mono text-emerald-500 border border-emerald-800/60 bg-emerald-900/20 px-1 py-0.5 rounded-sm">
                  −20%
                </span>
              </button>
            </div>
            {annual && (
              <p className="text-zinc-600 text-[9px] font-mono mt-2">
                Annual billing coming soon — showing preview pricing
              </p>
            )}
          </div>
        </section>

        {/* Plan cards */}
        <section className="px-6 py-12 border-b border-zinc-900/80">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const price = annual ? plan.annualPrice : plan.monthlyPrice;
              return (
                <div
                  key={plan.id}
                  id={plan.id}
                  className={`relative flex flex-col p-6 rounded-sm border bg-zinc-950 ${plan.accentBorder} ${
                    plan.recommended ? plan.accentBg : ""
                  }`}
                >
                  {/* Recommended badge */}
                  {plan.recommended && (
                    <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                  )}
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-amber-400 bg-zinc-950 border border-amber-400/30 px-2 py-0.5 rounded-sm">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan name */}
                  <div className="mb-5">
                    <PlanBadge plan={plan.id} size="sm" />
                    <div className="mt-4 flex items-end gap-1">
                      {price === 0 ? (
                        <span className="text-3xl font-bold text-white">$0</span>
                      ) : (
                        <>
                          <span className={`text-3xl font-bold ${plan.accentColor}`}>
                            ${price}
                          </span>
                          <span className="text-zinc-600 text-sm font-mono mb-1">
                            /mo
                          </span>
                        </>
                      )}
                    </div>
                    {annual && price !== null && price > 0 && (
                      <p className="text-zinc-600 text-[9px] font-mono mt-1">
                        billed annually · preview pricing
                      </p>
                    )}
                    <p className="text-zinc-500 text-xs mt-3 leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.id === "free" ? "/signup" : "/pricing#contact"}
                    className={`block text-center text-[11px] font-medium py-2.5 rounded-sm border transition-colors mb-6 ${
                      plan.id === "free"
                        ? "text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white"
                        : plan.id === "partner"
                        ? "text-black bg-amber-400 border-amber-400 hover:bg-amber-300"
                        : "text-black bg-blue-400 border-blue-400 hover:bg-blue-300"
                    }`}
                  >
                    {plan.ctaLabel}
                  </Link>

                  {/* Feature list */}
                  <div className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <div key={f.label} className="flex items-start gap-2">
                        <span className="shrink-0 mt-0.5">
                          {f.included ? (
                            <Check color={plan.accentColor} />
                          ) : (
                            <Dash />
                          )}
                        </span>
                        <span
                          className={`text-[11px] leading-snug flex-1 ${
                            f.included ? "text-zinc-300" : "text-zinc-700"
                          }`}
                        >
                          {f.label}
                        </span>
                        {f.badge === "soon" && f.included && (
                          <PlanBadge plan="soon" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature comparison table */}
        <section className="px-6 py-12 border-b border-zinc-900/80">
          <div className="max-w-3xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-8 text-center">
              Full feature comparison
            </p>

            {/* Table header */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              <div />
              {PLANS.map((p) => (
                <div key={p.id} className="text-center">
                  <PlanBadge plan={p.id} size="sm" />
                </div>
              ))}
            </div>

            {[
              {
                section: "Intelligence Terminal",
                rows: [
                  { label: "Live market pulse",        free: true,  partner: true,  api: true  },
                  { label: "AI market narratives",      free: true,  partner: true,  api: true  },
                  { label: "News catalyst feed",        free: true,  partner: true,  api: true  },
                  { label: "Market intelligence pages", free: true,  partner: true,  api: true  },
                  { label: "Sport hubs (7)",            free: true,  partner: true,  api: true  },
                  { label: "Watchlists",                free: true,  partner: true,  api: true  },
                ],
              },
              {
                section: "Creator + Distribution",
                rows: [
                  { label: "Share card exports",        free: true,  partner: true,  api: true  },
                  { label: "Creator distribution",      free: false, partner: true,  api: true  },
                  { label: "Branded export tooling",    free: false, partner: true,  api: true  },
                  { label: "Partner analytics",         free: false, partner: true,  api: true  },
                  { label: "Priority signal routing",   free: false, partner: true,  api: true  },
                  { label: "Creator performance data",  free: false, partner: true,  api: true  },
                ],
              },
              {
                section: "Data + API",
                rows: [
                  { label: "Structured API access",     free: false, partner: false, api: true  },
                  { label: "AI narrative endpoints",    free: false, partner: false, api: true  },
                  { label: "Odds + liquidity feed",     free: false, partner: false, api: true  },
                  { label: "Deep liquidity scans",      free: false, partner: false, api: true  },
                  { label: "Higher refresh limits",     free: false, partner: false, api: true  },
                  { label: "WebSocket feed",            free: false, partner: false, api: "soon" as const },
                ],
              },
            ].map(({ section, rows }) => (
              <div key={section} className="mb-6">
                <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mb-1 col-span-4">
                  {section}
                </p>
                <div className="border border-zinc-900/60 rounded-sm overflow-hidden">
                  {rows.map((row, i) => (
                    <div
                      key={row.label}
                      className={`grid grid-cols-4 gap-2 px-4 py-2.5 ${
                        i < rows.length - 1 ? "border-b border-zinc-900/60" : ""
                      }`}
                    >
                      <span className="text-zinc-400 text-[11px]">{row.label}</span>
                      {[row.free, row.partner, row.api].map((val, j) => (
                        <div key={j} className="flex justify-center">
                          {val === true ? (
                            <Check
                              color={
                                j === 0
                                  ? "text-zinc-400"
                                  : j === 1
                                  ? "text-amber-400"
                                  : "text-blue-400"
                              }
                            />
                          ) : val === "soon" ? (
                            <PlanBadge plan="soon" />
                          ) : (
                            <Dash />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact / waitlist */}
        <section className="px-6 py-12 border-b border-zinc-900/80" id="contact">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
              Billing system activates soon
            </p>
            <h2 className="text-xl font-bold mb-3">
              Ready to upgrade?
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Billing infrastructure is being finalised. Join the waitlist and
              you&apos;ll be first to access Partner and API tiers.
            </p>
            <Link
              href="/signup"
              className="inline-block text-sm font-medium text-black bg-white px-6 py-2.5 rounded-sm hover:bg-zinc-200 transition-colors"
            >
              Create free account →
            </Link>
          </div>
        </section>

        {/* Compliance */}
        <div className="px-6 py-4">
          <p className="text-zinc-800 text-[9px] font-mono text-center leading-relaxed max-w-2xl mx-auto">
            Sports Market OS is a market intelligence and analytics platform. It does not accept
            wagers, custody funds, or execute trades. All data is for analytical purposes only.
          </p>
        </div>
      </main>
    </div>
  );
}
