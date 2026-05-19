import Link from "next/link";

export const revalidate = 3600;

export const metadata = {
  title: "Horse Racing Trader — Sports Market OS · Bug Hutch Portfolio",
  description: "Horse Racing Trader is in build — a browser-native AI trading terminal for Betfair Exchange horse racing markets. UK and Ireland coverage.",
};

const PILLARS = [
  {
    heading: "Live Betfair ladder",
    body: "UK and Ireland horse racing markets. Real-time order book with full depth visibility.",
  },
  {
    heading: "AI Guardian",
    body: "Risk management built for racing volatility. Automated exit strategies and liability control.",
  },
  {
    heading: "Paper trading",
    body: "Full functionality before live deployment. No balance required to test the system.",
  },
];

export default function HorseRacingPage() {
  return (
    <div className="max-w-[840px] mx-auto px-4 md:px-6 py-12">

      {/* Header */}
      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-amber-400 mb-4">
        Horse Racing Markets · Portfolio Coverage
      </p>
      <h1 className="text-[36px] md:text-[40px] font-semibold text-white leading-tight mb-4">
        Horse Racing
      </h1>
      <p className="font-serif text-white text-[17px] leading-[1.65] max-w-[720px] mb-14">
        Polymarket does not currently list horse racing markets. For UK and Irish horse racing exchange
        trading, Bug Hutch is building Horse Racing Trader — a browser-native AI trading system for
        Betfair Exchange, designed for the same audience as Tennis Trader AI.
      </p>

      {/* Divider */}
      <div className="h-px bg-zinc-900 mb-12" />

      {/* Portfolio product block */}
      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
        Partner Product · Bug Hutch Portfolio · In Build
      </p>
      <h2 className="text-[28px] md:text-[32px] font-semibold text-white leading-tight mb-4">
        Horse Racing Trader
      </h2>

      {/* Status badge */}
      <div className="inline-flex items-center border border-zinc-800 px-2 py-1 rounded-sm mb-6">
        <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500">
          Status: In Build · Launch Planned Pre-Cheltenham 2026
        </span>
      </div>

      <p className="font-serif text-white text-[17px] leading-[1.65] max-w-[720px] mb-10">
        A browser-native AI trading terminal for the Betfair Exchange horse racing markets. UK and
        Ireland coverage at launch. Built with the same execution stack as Tennis Trader AI — live
        ladder, AI Guardian risk management, paper trading included. Targeting launch ahead of the
        2026 Cheltenham Festival window.
      </p>

      {/* Feature pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {PILLARS.map((p) => (
          <div key={p.heading} className="border border-zinc-800/60 rounded-sm p-5">
            <p className="text-white text-[16px] font-semibold mb-2">{p.heading}</p>
            <p className="font-serif text-zinc-400 text-[14px] leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-start gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center min-h-[44px] bg-teal-500 text-zinc-950 text-[13px] font-mono font-semibold uppercase tracking-[0.1em] px-7 py-3 rounded-md hover:bg-teal-400 transition-colors"
        >
          Notify me when Horse Racing Trader launches →
        </Link>
        <p className="text-[11px] font-mono text-zinc-600">
          A Bug Hutch Ltd product · Operated separately from Sports Market OS
        </p>
      </div>

      {/* ── Cross-sport nav ──────────────────────────────────────────────────── */}
      <div className="mt-16">
        <div className="h-px bg-zinc-900 mb-8" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
          More from Sports Market OS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: "/tennis",   label: "Tennis",                tag: "Live",   accent: "text-amber-400" },
            { href: "/terminal", label: "Intelligence Terminal", tag: "Live",   accent: "text-cyan-400" },
            { href: "/accuracy", label: "Accuracy Ledger",       tag: "Public", accent: "text-emerald-400" },
            { href: "/markets",  label: "All Markets",           tag: "Live",   accent: "text-white" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between p-4 border border-zinc-800/60 rounded-sm hover:border-zinc-600 transition-colors group"
            >
              <div>
                <span className="text-white text-[14px] font-semibold group-hover:text-zinc-200 transition-colors">
                  {link.label}
                </span>
                <span className={`ml-2 text-[10px] font-mono uppercase tracking-[0.1em] ${link.accent}`}>
                  {link.tag}
                </span>
              </div>
              <svg className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
