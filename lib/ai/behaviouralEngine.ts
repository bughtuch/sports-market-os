import type { AIBehaviourSignal, BehaviouralState } from "./types";

// ─── Variation helpers ────────────────────────────────────────────────────────

function wave(phase: number): number {
  return Math.sin(Date.now() / 24000 + phase);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function ts(): string {
  return new Date().toISOString();
}

// ─── Template data ────────────────────────────────────────────────────────────

const STATES: BehaviouralState[] = [
  "uncertainty",
  "crowd_consensus",
  "sharp_divergence",
  "uncertainty",
  "euphoria",
  "panic",
  "neutral",
  "sharp_divergence",
];

const STATE_SUMMARIES: Record<BehaviouralState, string> = {
  panic:
    "Market panic signature detected. Crowd positions unwinding rapidly without structural justification. Volatility premium elevated beyond fundamental basis — informed participants absorbing the supply.",
  euphoria:
    "Euphoric sentiment driving elevated participation at price levels inconsistent with structural data. Late-cycle positioning pattern emerging. Counter-positioning by informed participants increasing.",
  uncertainty:
    "Uncertainty regime active. Mixed signals across crowd and sharp positioning layers. Market participants exhibiting indecision ahead of catalyst window — AI monitoring elevated.",
  crowd_consensus:
    "Strong crowd consensus forming on directional thesis. Historical pattern suggests institutional participants positioning against prevailing sentiment. Divergence window forming.",
  sharp_divergence:
    "Significant divergence between sharp-side and crowd-side positioning. Informed capital rotating against prevailing public sentiment with elevated conviction score.",
  neutral:
    "Behavioural metrics within normal distribution. No significant crowd/sharp divergence detected. System monitoring for regime change across all active market sectors.",
};

// ─── Engine function ──────────────────────────────────────────────────────────

export function generateBehaviourSignal(): AIBehaviourSignal {
  const t = Date.now();
  const stateIdx = Math.abs(Math.floor(((wave(0.4) + 1) / 2) * STATES.length)) % STATES.length;
  const state = STATES[stateIdx] as BehaviouralState;

  return {
    id: `beh-${t}`,
    timestamp: ts(),
    state,
    summary: STATE_SUMMARIES[state],
    behaviouralPressure: clamp(Math.round(45 + wave(1.1) * 38), 8, 96),
    crowdAlignment: clamp(Math.round(55 + wave(2.3) * 32), 12, 98),
    institutionalDivergence: clamp(Math.round(38 + wave(0.7) * 28), 5, 88),
    confidence: clamp(Math.round(70 + wave(1.8) * 16), 48, 94),
  };
}
