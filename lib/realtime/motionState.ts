import type { TerminalMotionState, PulseRate, AlertDensity } from "./feedTypes";

// ─── Regime → motion mapping ──────────────────────────────────────────────────

interface RegimeConfig {
  pulseRate: PulseRate;
  alertDensity: AlertDensity;
  glowIntensity: number;
  feedCadenceMs: number;
}

const REGIME_CONFIG: Record<string, RegimeConfig> = {
  stable:      { pulseRate: "slow",   alertDensity: "sparse",  glowIntensity: 0.10, feedCadenceMs: 6_500 },
  volatile:    { pulseRate: "fast",   alertDensity: "dense",   glowIntensity: 0.70, feedCadenceMs: 2_800 },
  expansion:   { pulseRate: "normal", alertDensity: "normal",  glowIntensity: 0.40, feedCadenceMs: 4_200 },
  compression: { pulseRate: "slow",   alertDensity: "sparse",  glowIntensity: 0.20, feedCadenceMs: 5_500 },
  panic:       { pulseRate: "rapid",  alertDensity: "dense",   glowIntensity: 1.00, feedCadenceMs: 1_600 },
  rotational:  { pulseRate: "normal", alertDensity: "normal",  glowIntensity: 0.30, feedCadenceMs: 3_800 },
  illiquid:    { pulseRate: "slow",   alertDensity: "sparse",  glowIntensity: 0.50, feedCadenceMs: 5_800 },
};

// ─── Module-level regime state (SSR-safe: read only in feedEngine) ────────────

let _regime = "stable";

export function setRegime(regime: string): void {
  _regime = regime;
}

export function getMotionState(): TerminalMotionState {
  const cfg = REGIME_CONFIG[_regime] ?? REGIME_CONFIG.stable;
  return { regime: _regime, ...cfg };
}
