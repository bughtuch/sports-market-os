import type { ProviderReadinessState } from "@/lib/providerConfig/configTypes";
import {
  PROVIDER_CATEGORY_LABELS,
  OPERATIONAL_STATUS_COLOR,
  OPERATIONAL_STATUS_DOT,
} from "@/lib/providerConfig/configTypes";

function ReadinessBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-400" :
    score >= 50 ? "bg-amber-400"   : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-[9px] font-mono tabular-nums text-zinc-400 w-7 text-right">
        {score}%
      </span>
    </div>
  );
}

export default function ProviderConfigCard({ state }: { state: ProviderReadinessState }) {
  const { definition: def } = state;

  return (
    <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                OPERATIONAL_STATUS_DOT[state.operationalStatus]
              }`}
            />
            <p className="text-white text-[11px] font-semibold truncate">{state.name}</p>
          </div>
          <p className="text-zinc-600 text-[9px] font-mono">
            {PROVIDER_CATEGORY_LABELS[state.category]}
          </p>
        </div>
        <div className="text-right shrink-0">
          {state.liveReady && (
            <span className="text-[8px] font-mono uppercase tracking-wider text-emerald-400 border border-emerald-400/30 bg-emerald-400/5 px-1.5 py-0.5 rounded-sm block mb-1">
              LIVE
            </span>
          )}
          {state.currentMode === "simulation" && (
            <span className="text-[8px] font-mono uppercase tracking-wider text-amber-400 border border-amber-400/30 bg-amber-400/5 px-1.5 py-0.5 rounded-sm block mb-1">
              SIM
            </span>
          )}
          {state.currentMode === "planned" && (
            <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded-sm block mb-1">
              PLANNED
            </span>
          )}
          {state.currentMode === "hybrid" && (
            <span className="text-[8px] font-mono uppercase tracking-wider text-blue-400 border border-blue-400/30 bg-blue-400/5 px-1.5 py-0.5 rounded-sm block mb-1">
              HYBRID
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-zinc-500 text-[9px] leading-relaxed line-clamp-2">
        {def.description}
      </p>

      {/* Readiness bar */}
      <div>
        <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">
          Readiness
        </p>
        <ReadinessBar score={state.readinessScore} />
      </div>

      {/* Env var status */}
      {def.envVars.length > 0 && (
        <div className="space-y-1">
          {state.envVarStatuses.map(ev => (
            <div key={ev.name} className="flex items-center justify-between">
              <span className="text-zinc-600 text-[9px] font-mono truncate max-w-[160px]">
                {ev.name}
              </span>
              <span
                className={`text-[8px] font-mono shrink-0 ${
                  ev.configured
                    ? "text-emerald-400"
                    : ev.required
                    ? "text-red-400"
                    : "text-zinc-600"
                }`}
              >
                {ev.configured ? "✓ set" : ev.required ? "✗ missing" : "— optional"}
              </span>
            </div>
          ))}
        </div>
      )}

      {def.envVars.length === 0 && (
        <p className="text-zinc-700 text-[9px] font-mono">No env vars required.</p>
      )}

      {/* Mode support pills */}
      <div className="flex flex-wrap gap-1 pt-1 border-t border-zinc-900/60">
        {def.supportedModes.map(mode => (
          <span
            key={mode}
            className={`text-[8px] font-mono px-1.5 py-0.5 border rounded-sm ${
              mode === state.currentMode
                ? "border-zinc-600 text-zinc-300 bg-zinc-900"
                : "border-zinc-800/60 text-zinc-700"
            }`}
          >
            {mode}
          </span>
        ))}
        {def.readOnly && (
          <span className="text-[8px] font-mono px-1.5 py-0.5 border border-blue-400/20 text-blue-600 rounded-sm">
            read-only
          </span>
        )}
        {def.fallbackCapable && (
          <span className="text-[8px] font-mono px-1.5 py-0.5 border border-zinc-800/60 text-zinc-700 rounded-sm">
            fallback
          </span>
        )}
      </div>
    </div>
  );
}
