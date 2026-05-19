import Link from "next/link";
import PublicNavBar from "@/components/PublicNavBar";
import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

import Footer from "@/components/Footer";

import CalibrationChart from "@/components/CalibrationChart";
import type { CalibrationBucket } from "@/components/CalibrationChart";

export const metadata: Metadata = {
  title: "Accuracy Ledger | Sports Market OS",
  description:
    "Public signal accuracy ledger for Sports Market OS. Every generated signal, logged permanently. No curation, no deletion.",
};

export const dynamic = "force-dynamic";

// ─── Supabase ─────────────────────────────────────────────────────────────────

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

function getBucket(confidence: number): string {
  if (confidence >= 95) return "95–100";
  if (confidence >= 90) return "90–95";
  if (confidence >= 85) return "85–90";
  if (confidence >= 80) return "80–85";
  if (confidence >= 75) return "75–80";
  return "70–75";
}

const BUCKET_ORDER = ["70–75", "75–80", "80–85", "85–90", "90–95", "95–100"];
const BUCKET_EXPECTED: Record<string, number> = {
  "70–75": 72.5,
  "75–80": 77.5,
  "80–85": 82.5,
  "85–90": 87.5,
  "90–95": 92.5,
  "95–100": 97.5,
};

function signalTypeLabel(t: string): string {
  return t.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function fmtDate(iso: string): string {
  return new Date(iso).toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AccuracyPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const db = adminClient();
  const params: Record<string, string | string[] | undefined> = searchParams
    ? await searchParams
    : {};
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const page = Math.max(1, Number(pageParam ?? "1"));
  const limit = 50;
  const offset = (page - 1) * limit;

  // ── Fetch in parallel ────────────────────────────────────────────────────
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [totalRes, correctRes, incorrectRes, signalsPageRes, thirtyDayRes] = await Promise.all([
    db.from("signals").select("*", { count: "exact", head: true }),
    db.from("signal_resolutions").select("*", { count: "exact", head: true }).eq("outcome", "correct"),
    db.from("signal_resolutions").select("*", { count: "exact", head: true }).eq("outcome", "incorrect"),
    db.from("signals").select(`
      id, generated_at, sport, event_title, signal_type,
      predicted_direction, confidence,
      signal_resolutions ( outcome, resolved_at )
    `).order("generated_at", { ascending: false }).range(offset, offset + limit - 1),
    db.from("signals").select("id, confidence, signal_resolutions(outcome)")
      .gte("generated_at", since30d),
  ]);

  const totalCount = totalRes.count ?? 0;
  const correctCount  = correctRes.count   ?? 0;
  const incorrectCount = incorrectRes.count ?? 0;
  const resolvedCount = correctCount + incorrectCount;
  // Require at least one incorrect outcome before displaying — 100% with zero incorrect
  // is a resolver calibration artefact, not a meaningful accuracy claim.
  const lifetimeAccuracy = (resolvedCount >= 10 && incorrectCount > 0)
    ? Math.min(99, Math.round((correctCount / resolvedCount) * 100))
    : null;

  // 30-day accuracy — use embedded signal_resolutions from thirtyDayRes
  const thirtyDaySignals = thirtyDayRes.data ?? [];
  const thirtyDayResolved = thirtyDaySignals.filter((s) => {
    const res = Array.isArray(s.signal_resolutions)
      ? s.signal_resolutions[0]
      : s.signal_resolutions;
    const outcome = (res as { outcome?: string } | null)?.outcome;
    return outcome === "correct" || outcome === "incorrect";
  });
  const thirtyDayCorrect = thirtyDayResolved.filter((s) => {
    const res = Array.isArray(s.signal_resolutions)
      ? s.signal_resolutions[0]
      : s.signal_resolutions;
    return (res as { outcome?: string } | null)?.outcome === "correct";
  }).length;
  const thirtyDayIncorrect = thirtyDayResolved.length - thirtyDayCorrect;
  const thirtyDayAccuracy =
    (thirtyDayResolved.length > 0 && thirtyDayIncorrect > 0)
      ? Math.min(99, Math.round((thirtyDayCorrect / thirtyDayResolved.length) * 100))
      : null;

  // Calibration data
  const bucketMap: Record<string, { total: number; resolved: number; correct: number }> = {};
  for (const bucket of BUCKET_ORDER) {
    bucketMap[bucket] = { total: 0, resolved: 0, correct: 0 };
  }
  const allForCalibration = thirtyDaySignals; // reuse fetch
  for (const s of allForCalibration) {
    const b = getBucket(s.confidence);
    bucketMap[b].total++;
    const res = Array.isArray(s.signal_resolutions)
      ? s.signal_resolutions[0]
      : s.signal_resolutions;
    const outcome = (res as { outcome?: string } | null)?.outcome;
    // Only count definitive outcomes in calibration — exclude unresolved/expired
    if (outcome === "correct" || outcome === "incorrect") {
      bucketMap[b].resolved++;
      if (outcome === "correct") bucketMap[b].correct++;
    }
  }

  const calibrationData: CalibrationBucket[] = BUCKET_ORDER.map((bucket) => {
    const { total, resolved, correct } = bucketMap[bucket];
    return {
      bucket,
      hitRate: resolved > 0 ? Math.round((correct / resolved) * 100) : null,
      expected: BUCKET_EXPECTED[bucket],
      total,
      resolved,
    };
  });
  const totalResolved = calibrationData.reduce((s, b) => s + b.resolved, 0);
  const hasCalibrationData = totalResolved >= 20;

  // Ledger page data
  const ledgerSignals = signalsPageRes.data ?? [];
  const totalPages = Math.ceil(totalCount / limit);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <PublicNavBar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 space-y-16">

        {/* ── Zone 1: Hero stats ─────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.15em]">
              Sports Market OS · Accuracy Ledger
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Signal Accuracy</h1>
          {/* Fix 6 — Intro copy: serif, near-white, comfortable reading size */}
          <p className="font-serif text-zinc-100 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            Every signal generated is logged permanently. No curation, no deletion, no editing.
            Resolution is applied against exchange close data hourly.
          </p>

          {/* Fix 1 — Hero stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 rounded-lg overflow-hidden border border-zinc-800">
            {[
              {
                label: "Lifetime Accuracy",
                value: lifetimeAccuracy != null ? `${lifetimeAccuracy}%` : "—",
                sub: resolvedCount > 0 ? `${resolvedCount} resolved` : "No resolved signals yet",
                accent: lifetimeAccuracy != null,
              },
              {
                label: "Last 30 Days",
                value: thirtyDayAccuracy != null ? `${thirtyDayAccuracy}%` : "—",
                sub: thirtyDayResolved.length > 0 ? `${thirtyDayResolved.length} resolved` : "No resolved signals",
                accent: false,
              },
              {
                label: "Total Signals",
                value: totalCount.toLocaleString(),
                sub: "Generated to date",
                accent: false,
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-zinc-950 p-8">
                <p className="text-[12px] font-mono text-zinc-400 uppercase tracking-[0.15em] mb-4">
                  {stat.label}
                </p>
                <p
                  className="text-7xl font-bold font-mono tabular-nums leading-none tracking-tight mb-3"
                  style={{ color: stat.accent ? "var(--accent)" : "#F4F5F7" }}
                >
                  {stat.value}
                </p>
                <p className="text-[13px] font-mono text-zinc-500">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Zone 2: Calibration chart ──────────────────────────────── */}
        {/* Fix 2 — Calibration chart header: larger, more readable */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[12px] font-mono text-zinc-400 uppercase tracking-[0.1em] shrink-0">
              Calibration Curve
            </span>
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-500 text-[12px] font-mono shrink-0">
              Bars: actual hit rate · Dashed: perfect calibration
            </span>
          </div>
          <CalibrationChart data={calibrationData} hasEnoughData={hasCalibrationData} />
        </section>

        {/* ── Zone 3: Ledger table ───────────────────────────────────── */}
        {/* Fix 3 — Table typography */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[12px] font-mono text-zinc-400 uppercase tracking-[0.1em] shrink-0">
              Full Ledger
            </span>
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-500 text-[12px] font-mono shrink-0">
              {totalCount.toLocaleString()} signals · {limit}/page
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Generated", "Sport", "Event", "Type", "Direction", "Confidence", "Outcome", "Resolved"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-[11px] font-mono text-zinc-400 uppercase tracking-[0.1em] py-3 pr-4 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {ledgerSignals.map((s) => {
                  const res = Array.isArray(s.signal_resolutions)
                    ? s.signal_resolutions[0]
                    : s.signal_resolutions;
                  const outcome = (res as { outcome?: string; resolved_at?: string } | null)
                    ?.outcome;
                  const resolvedAt = (res as { outcome?: string; resolved_at?: string } | null)
                    ?.resolved_at;
                  const isHighConf = s.confidence >= 85;
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-zinc-900/50 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Generated */}
                      <td className="py-3 pr-4 text-[12px] font-mono text-zinc-500 whitespace-nowrap">
                        {fmtDate(s.generated_at)}
                      </td>
                      {/* Sport */}
                      <td className="py-3 pr-4 text-[13px] font-mono text-zinc-400 whitespace-nowrap">
                        {s.sport.replace(/_/g, " ")}
                      </td>
                      {/* Event title — primary content */}
                      <td className="py-3 pr-4 text-[14px] text-zinc-100 max-w-[220px] truncate">
                        {s.event_title}
                      </td>
                      {/* Type */}
                      <td className="py-3 pr-4 text-[13px] font-mono text-zinc-400 whitespace-nowrap">
                        {signalTypeLabel(s.signal_type)}
                      </td>
                      {/* Direction */}
                      <td className="py-3 pr-4 text-[13px] font-mono text-zinc-400 uppercase whitespace-nowrap">
                        {s.predicted_direction}
                      </td>
                      {/* Confidence */}
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[13px] font-mono font-bold tabular-nums"
                            style={{ color: isHighConf ? "var(--accent)" : "#F4F5F7" }}
                          >
                            {Math.round(s.confidence)}%
                          </span>
                          <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${s.confidence}%`,
                                backgroundColor: isHighConf ? "var(--accent)" : "#71717a",
                                opacity: 0.7,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      {/* Outcome */}
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {outcome === "correct" ? (
                          <span className="text-[12px] font-mono font-bold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                            correct
                          </span>
                        ) : outcome === "incorrect" ? (
                          <span className="text-[12px] font-mono font-bold uppercase tracking-wide text-[#F87171]">
                            incorrect
                          </span>
                        ) : outcome === "expired" ? (
                          <span className="text-[12px] font-mono italic text-zinc-600">
                            expired
                          </span>
                        ) : outcome === "unresolved" ? (
                          <span className="text-[12px] font-mono text-zinc-600 uppercase">
                            unresolved
                          </span>
                        ) : (
                          <span className="text-[12px] font-mono text-zinc-700 uppercase">
                            pending
                          </span>
                        )}
                      </td>
                      {/* Resolved at */}
                      <td className="py-3 pr-4 text-[12px] font-mono text-zinc-500 whitespace-nowrap">
                        {resolvedAt ? fmtDate(resolvedAt) : <span className="text-zinc-700">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <span className="text-zinc-500 text-[13px] font-mono">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/accuracy?page=${page - 1}`}
                    className="text-[13px] font-mono text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-sm hover:border-zinc-400 hover:text-white transition-colors"
                  >
                    ← Prev
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/accuracy?page=${page + 1}`}
                    className="text-[13px] font-mono text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-sm hover:border-zinc-400 hover:text-white transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── Zone 4: CSV download ────────────────────────────────────── */}
        {/* Fix 5 — Proper solid teal button */}
        <section className="flex justify-end">
          <a
            href="/api/ledger/csv"
            className="text-[14px] font-mono font-semibold py-3 px-6 rounded-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg-canvas, #09090b)" }}
          >
            Download full ledger as CSV ↓
          </a>
        </section>

        {/* ── Zone 5: Methodology ─────────────────────────────────────── */}
        {/* Fix 4 — Editorial serif body text */}
        <section className="border-t border-zinc-800 pt-10">
          <p className="text-[12px] font-mono text-zinc-400 uppercase tracking-[0.15em] mb-8">
            Methodology
          </p>
          <div className="space-y-6 max-w-[720px]">
            <p className="font-serif text-zinc-100 text-[16px] leading-[1.65]">
              <span className="font-mono text-[12px] text-zinc-400 uppercase tracking-[0.1em] mr-2">
                Signal generation —
              </span>
              Signals are generated every 15 minutes by the automated engine. Each signal is
              threshold-gated at 70% confidence — signals below this threshold are discarded
              and never enter the ledger. The threshold is hard-coded; there is no operator
              override.
            </p>
            <p className="font-serif text-zinc-100 text-[16px] leading-[1.65]">
              <span className="font-mono text-[12px] text-zinc-400 uppercase tracking-[0.1em] mr-2">
                Resolution —
              </span>
              A resolution job runs hourly and marks each signal&apos;s outcome (correct /
              incorrect / expired) against exchange close data. Unresolved signals are those
              where outcome data is not yet available or the decay window has not elapsed.
            </p>
            <p className="font-serif text-zinc-100 text-[16px] leading-[1.65]">
              <span className="font-mono text-[12px] text-zinc-400 uppercase tracking-[0.1em] mr-2">
                Ledger integrity —
              </span>
              Every signal that passes the threshold gate is written to Supabase before it is
              returned to any caller. If the write fails, the signal is not displayed. No
              signals are edited or deleted after creation. The schema was created by migration{" "}
              <span className="font-mono text-[13px] text-zinc-400">20260516000000_signals_and_resolutions</span>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
