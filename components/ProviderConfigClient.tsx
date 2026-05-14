"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  SystemReadinessSummary,
  ProviderReadinessState,
  ProviderCategory,
} from "@/lib/providerConfig/configTypes";
import { PROVIDER_CATEGORY_LABELS } from "@/lib/providerConfig/configTypes";
import ProviderConfigCard from "@/components/ProviderConfigCard";

type FilterTab = "all" | ProviderCategory;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all",          label: "All Providers" },
  { id: "ai",           label: "AI Engine" },
  { id: "news",         label: "News" },
  { id: "odds",         label: "Odds" },
  { id: "exchange",     label: "Exchange" },
  { id: "distribution", label: "Distribution" },
];

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-emerald-400" :
    score >= 50 ? "text-amber-400"   : "text-red-400";
  return (
    <span className={`text-4xl font-bold font-mono tabular-nums ${color}`}>
      {score}%
    </span>
  );
}

function MissingRequirements({ providers }: { providers: ProviderReadinessState[] }) {
  const withMissing = providers.filter(p => p.missingRequired.length > 0);
  if (withMissing.length === 0) {
    return (
      <p className="text-emerald-400 text-[10px] font-mono">
        All required env vars configured.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      {withMissing.map(p => (
        <div key={p.id} className="bg-zinc-950 border border-red-400/20 rounded-sm px-4 py-3">
          <p className="text-zinc-300 text-[11px] font-medium mb-1.5">{p.name}</p>
          <div className="flex flex-wrap gap-2">
            {p.missingRequired.map(varName => (
              <span
                key={varName}
                className="text-red-400 text-[9px] font-mono bg-red-400/5 border border-red-400/20 px-2 py-0.5 rounded-sm"
              >
                {varName}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FallbackActivity({ providers }: { providers: ProviderReadinessState[] }) {
  const fallbackActive = providers.filter(p => p.fallbackActive);
  if (fallbackActive.length === 0) {
    return (
      <p className="text-zinc-700 text-[10px] font-mono">No fallback events — all providers nominal.</p>
    );
  }
  return (
    <div className="space-y-1.5">
      {fallbackActive.map(p => (
        <div key={p.id} className="flex items-center gap-3 bg-zinc-950 border border-amber-400/20 rounded-sm px-4 py-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <span className="text-zinc-300 text-[10px] flex-1">{p.name}</span>
          <span className="text-amber-400 text-[9px] font-mono">fallback active → mock provider</span>
        </div>
      ))}
    </div>
  );
}

function ActivationOrder({ providers }: { providers: ProviderReadinessState[] }) {
  const ordered = [...providers].sort(
    (a, b) => a.definition.activationOrder - b.definition.activationOrder,
  );
  return (
    <div className="space-y-1.5">
      {ordered.map((p, i) => (
        <div key={p.id} className="flex items-center gap-3 bg-zinc-950 border border-zinc-800/60 rounded-sm px-4 py-2.5">
          <span className="text-zinc-700 text-[9px] font-mono w-5 shrink-0">
            {p.definition.activationOrder === 0 ? "①" : `${i}.`}
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-zinc-300 text-[10px]">{p.name}</span>
            {p.definition.envVars.filter(v => v.required).map(v => (
              <span key={v.name} className="text-zinc-700 text-[9px] font-mono ml-2">
                {v.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[9px] font-mono ${
              p.liveReady       ? "text-emerald-400" :
              p.currentMode === "hybrid"     ? "text-blue-400"    :
              p.currentMode === "planned"    ? "text-zinc-600"    : "text-amber-400"
            }`}>
              {p.liveReady ? "live" : p.currentMode}
            </span>
            <span className="text-zinc-600 text-[9px] font-mono">{p.readinessScore}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProviderConfigClient({
  readiness,
}: {
  readiness: SystemReadinessSummary;
}) {
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered =
    tab === "all"
      ? readiness.providers
      : readiness.providers.filter(p => p.category === tab);

  const liveProviders      = readiness.providers.filter(p => p.liveReady);
  const simulatedProviders = readiness.providers.filter(p => p.currentMode === "simulation");
  const hybridProviders    = readiness.providers.filter(p => p.currentMode === "hybrid");

  return (
    <div className="space-y-10">

      {/* ─── Overview metrics ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Overall Readiness", value: <ScoreRing score={readiness.overallReadiness} />, large: true },
          { label: "Live Providers",    value: <span className="text-emerald-400 text-xl font-bold font-mono">{readiness.liveReadyCount}</span> },
          { label: "Simulated",         value: <span className="text-amber-400 text-xl font-bold font-mono">{readiness.simulatedCount}</span> },
          { label: "Planned",           value: <span className="text-zinc-500 text-xl font-bold font-mono">{readiness.plannedCount}</span> },
          {
            label: "Missing Config",
            value: <span className={`text-xl font-bold font-mono ${readiness.missingRequirementsCount > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {readiness.missingRequirementsCount}
            </span>,
          },
        ].map((m, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
            <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-2">{m.label}</p>
            {m.value}
          </div>
        ))}
      </div>

      {/* ─── Missing Requirements ──────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Missing Requirements</p>
          <div className="flex-1 h-px bg-zinc-900" />
          {readiness.missingRequirementsCount > 0 && (
            <span className="text-red-400 text-[9px] font-mono">{readiness.missingRequirementsCount} vars</span>
          )}
        </div>
        <MissingRequirements providers={readiness.providers} />
      </div>

      {/* ─── Provider Grid (filterable) ────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Provider Grid</p>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {FILTER_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-[9px] font-mono px-3 py-1.5 border rounded-sm transition-colors ${
                tab === t.id
                  ? "border-zinc-600 text-white bg-zinc-900"
                  : "border-zinc-800/60 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(state => (
            <ProviderConfigCard key={state.id} state={state} />
          ))}
        </div>
      </div>

      {/* ─── Activation Order ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Recommended Activation Order</p>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>
        <ActivationOrder providers={readiness.providers} />
      </div>

      {/* ─── Mode Summary ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Live-capable */}
        <div>
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-2">
            Live Providers ({liveProviders.length})
          </p>
          <div className="space-y-1.5">
            {liveProviders.length === 0 ? (
              <p className="text-zinc-700 text-[10px] font-mono">None active.</p>
            ) : liveProviders.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-zinc-950 border border-emerald-400/15 rounded-sm px-3 py-2">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span className="text-zinc-300 text-[10px]">{p.name}</span>
                <span className="text-emerald-400 text-[9px] font-mono ml-auto">{p.readinessScore}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Simulated */}
        <div>
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-2">
            Simulated ({simulatedProviders.length})
          </p>
          <div className="space-y-1.5">
            {simulatedProviders.length === 0 ? (
              <p className="text-zinc-700 text-[10px] font-mono">None.</p>
            ) : simulatedProviders.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-zinc-950 border border-amber-400/15 rounded-sm px-3 py-2">
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                <span className="text-zinc-300 text-[10px]">{p.name}</span>
                <span className="text-amber-400 text-[9px] font-mono ml-auto">{p.readinessScore}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hybrid */}
        <div>
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-2">
            Hybrid Providers ({hybridProviders.length})
          </p>
          <div className="space-y-1.5">
            {hybridProviders.length === 0 ? (
              <p className="text-zinc-700 text-[10px] font-mono">None active.</p>
            ) : hybridProviders.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-zinc-950 border border-blue-400/15 rounded-sm px-3 py-2">
                <span className="w-1 h-1 rounded-full bg-blue-400" />
                <span className="text-zinc-300 text-[10px]">{p.name}</span>
                <span className="text-blue-400 text-[9px] font-mono ml-auto">{p.readinessScore}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Fallback Activity ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Fallback Activity</p>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>
        <FallbackActivity providers={readiness.providers} />
      </div>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-900/60 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-zinc-700 text-[9px] font-mono">
          Generated: {new Date(readiness.generatedAt).toLocaleTimeString()} ·
          Read-only intelligence only · No secrets exposed
        </p>
        <div className="flex items-center gap-4">
          <Link href="/system-status" className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors">
            System Status →
          </Link>
          <Link href="/daily-brief" className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors">
            Daily Brief →
          </Link>
        </div>
      </div>
    </div>
  );
}
