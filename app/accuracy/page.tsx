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
  const [totalRes, resolutionsRes, signalsPageRes, thirtyDayRes] = await Promise.all([
    db.from("signals").select("*", { count: "exact", head: true }),
    db.from("signal_resolutions").select("outcome, signal_id"),
    db.from("signals").select(`
      id, generated_at, sport, event_title, signal_type,
      predicted_direction, confidence,
      signal_resolutions ( outcome, resolved_at )
    `).order("generated_at", { ascending: false }).range(offset, offset + limit - 1),
    db.from("signals").select("id, confidence, signal_resolutions(outcome)")
      .gte("generated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const totalCount = totalRes.count ?? 0;
  const resolutions = resolutionsRes.data ?? [];
  // Accuracy denominator: only signals with a definitive outcome (correct | incorrect)
  const resolvedCounted = resolutions.filter(
    (r) => r.outcome === "correct" || r.outcome === "incorrect"
  );
  const correctCount = resolvedCounted.filter((r) => r.outcome === "correct").length;
  const lifetimeAccuracy = resolvedCounted.length > 0
    ? Math.round((correctCount / resolvedCounted.length) * 100)
    : null;

  // 30-day accuracy
  const thirtyDaySignals = thirtyDayRes.data ?? [];
  const thirtyDayResolvedIds = new Set(resolutions.map((r) => r.signal_id));
  // Filter to signals that have a correct|incorrect resolution
  const thirtyDayResolved = thirtyDaySignals.filter((s) => {
    if (!thirtyDayResolvedIds.has(s.id)) return false;
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
  const thirtyDayAccuracy =
    thirtyDayResolved.length > 0
      ? Math.round((thirtyDayCorrect / thirtyDayResolved.length) * 100)
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

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 space-y-12">

        {/* ── Zone 1: Hero stats ─────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Sports Market OS · Accuracy Ledger
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Signal Accuracy</h1>
          <p className="text-zinc-500 text-sm mb-8 max-w-xl">
            Every signal generated is logged permanently. No curation, no deletion, no editing.
            Resolution is applied against exchange close data hourly.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Lifetime Accuracy",
                value: lifetimeAccuracy != null ? `${lifetimeAccuracy}%` : "—",
                sub: resolvedCounted.length > 0 ? `${resolvedCounted.length} resolved` : "No resolved signals yet",
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
              <div key={stat.label} className="border border-zinc-900 rounded-[8px] p-5">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
                  {stat.label}
                </p>
                <p
                  className="text-4xl font-bold tabular-nums leading-none mb-1"
                  style={{ color: stat.accent ? "var(--accent)" : "white" }}
                >
                  {stat.value}
                </p>
                <p className="text-zinc-700 text-[10px] font-mono">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Zone 2: Calibration chart ──────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">
              Calibration Curve
            </span>
            <div className="flex-1 h-px bg-zinc-900" />
            <span className="text-zinc-700 text-[8px] font-mono shrink-0">
              Bars: actual hit rate · Dashed: perfect calibration
            </span>
          </div>
          <CalibrationChart data={calibrationData} hasEnoughData={hasCalibrationData} />
        </section>

        {/* ── Zone 3: Ledger table ───────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">
              Full Ledger
            </span>
            <div className="flex-1 h-px bg-zinc-900" />
            <span className="text-zinc-700 text-[8px] font-mono shrink-0">
              {totalCount.toLocaleString()} signals · {limit}/page
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="border-b border-zinc-900">
                  {["Generated", "Sport", "Event", "Type", "Direction", "Confidence", "Outcome", "Resolved"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-[9px] text-zinc-600 uppercase tracking-widest pb-2 pr-4 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {ledgerSignals.map((s) => {
                  const res = Array.isArray(s.signal_resolutions)
                    ? s.signal_resolutions[0]
                    : s.signal_resolutions;
                  const outcome = (res as { outcome?: string; resolved_at?: string } | null)
                    ?.outcome;
                  const resolvedAt = (res as { outcome?: string; resolved_at?: string } | null)
                    ?.resolved_at;
                  return (
                    <tr key={s.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="py-2 pr-4 text-zinc-600 whitespace-nowrap">
                        {fmtDate(s.generated_at)}
                      </td>
                      <td className="py-2 pr-4 text-zinc-500 uppercase whitespace-nowrap">
                        {s.sport}
                      </td>
                      <td className="py-2 pr-4 text-zinc-300 max-w-[220px] truncate">
                        {s.event_title}
                      </td>
                      <td className="py-2 pr-4 text-zinc-500 uppercase whitespace-nowrap">
                        {s.signal_type.replace(/_/g, " ")}
                      </td>
                      <td className="py-2 pr-4 text-zinc-500 uppercase whitespace-nowrap">
                        {s.predicted_direction}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="tabular-nums"
                            style={{ color: "var(--accent)" }}
                          >
                            {Math.round(s.confidence)}%
                          </span>
                          <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${s.confidence}%`,
                                backgroundColor: "var(--accent)",
                                opacity: 0.6,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {outcome ? (
                          <span
                            className={`uppercase text-[9px] px-1.5 py-0.5 rounded-sm border ${
                              outcome === "correct"
                                ? "text-emerald-400 border-emerald-400/30"
                                : outcome === "incorrect"
                                ? "text-red-400 border-red-400/30"
                                : "text-zinc-600 border-zinc-800"
                            }`}
                          >
                            {outcome}
                          </span>
                        ) : (
                          <span className="text-zinc-700 uppercase text-[9px]">unresolved</span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-zinc-700 whitespace-nowrap">
                        {resolvedAt ? fmtDate(resolvedAt) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <span className="text-zinc-700 text-[10px] font-mono">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/accuracy?page=${page - 1}`}
                    className="text-[10px] font-mono text-zinc-300 border border-zinc-700 px-3 py-1 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
                  >
                    ← Prev
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/accuracy?page=${page + 1}`}
                    className="text-[10px] font-mono text-zinc-300 border border-zinc-700 px-3 py-1 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── Zone 4: CSV download ────────────────────────────────────── */}
        <section className="flex justify-end">
          <a
            href="/api/ledger/csv"
            className="text-[10px] font-mono font-semibold text-black px-4 py-2 rounded-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Download full ledger as CSV ↓
          </a>
        </section>

        {/* ── Zone 5: Methodology ─────────────────────────────────────── */}
        <section className="border-t border-zinc-900/60 pt-8">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-4">
            Methodology
          </p>
          <div className="space-y-3 text-zinc-600 text-[11px] leading-relaxed max-w-2xl">
            <p>
              <span className="text-zinc-500 font-mono">Signal generation —</span>{" "}
              Signals are generated every 15 minutes by the automated engine. Each signal is
              threshold-gated at 70% confidence — signals below this threshold are discarded
              and never enter the ledger. The threshold is hard-coded; there is no operator
              override.
            </p>
            <p>
              <span className="text-zinc-500 font-mono">Resolution —</span>{" "}
              A resolution job runs hourly and marks each signal&apos;s outcome (correct /
              incorrect / expired) against exchange close data. Unresolved signals are those
              where outcome data is not yet available or the decay window has not elapsed.
            </p>
            <p>
              <span className="text-zinc-500 font-mono">Ledger integrity —</span>{" "}
              Every signal that passes the threshold gate is written to Supabase before it is
              returned to any caller. If the write fails, the signal is not displayed. No
              signals are edited or deleted after creation. The schema was created by migration{" "}
              <span className="font-mono text-zinc-500">20260516000000_signals_and_resolutions</span>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
