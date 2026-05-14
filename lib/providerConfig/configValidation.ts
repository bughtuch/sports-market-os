/**
 * configValidation.ts — Server-side environment validation for provider config.
 *
 * IMPORTANT: This file reads process.env and must only be imported from:
 *   - Server Components (app/ pages without "use client")
 *   - API Route handlers (app/api/)
 *   - Other server-only lib files
 *
 * It NEVER exposes actual secret values — only configured: true/false.
 */

import type {
  ProviderDefinition,
  EnvVarStatus,
  ProviderReadinessState,
  ProviderOperationalStatus,
  ProviderMode,
} from "./configTypes";

// ─── Core validation ──────────────────────────────────────────────────────────

/**
 * Returns true if the env var is set and non-empty. Never returns the value.
 */
export function isEnvVarConfigured(name: string): boolean {
  const val = process.env[name];
  return typeof val === "string" && val.trim().length > 0;
}

/**
 * Validates all env vars for a provider definition.
 * Returns status objects (name + configured boolean only).
 */
export function validateProviderEnvVars(def: ProviderDefinition): EnvVarStatus[] {
  return def.envVars.map(envVar => ({
    name:       envVar.name,
    configured: isEnvVarConfigured(envVar.name),
    required:   envVar.required,
  }));
}

/**
 * Returns names of missing required env vars (no values).
 */
export function getMissingRequired(statuses: EnvVarStatus[]): string[] {
  return statuses.filter(s => s.required && !s.configured).map(s => s.name);
}

/**
 * Returns names of missing optional env vars (no values).
 */
export function getMissingOptional(statuses: EnvVarStatus[]): string[] {
  return statuses.filter(s => !s.required && !s.configured).map(s => s.name);
}

/**
 * Calculates provider readiness score (0–100).
 *
 * Scoring:
 * - No required vars:          100 (nothing to configure)
 * - All required configured:   80 base + 20 for all optional
 * - Partial required missing:  proportional to configured/total required
 */
export function calculateReadinessScore(
  def: ProviderDefinition,
  statuses: EnvVarStatus[],
): number {
  if (def.envVars.length === 0) return 100;

  const required = statuses.filter(s => s.required);
  const optional = statuses.filter(s => !s.required);

  if (required.length === 0) {
    // Only optional vars
    const optConfigured = optional.filter(s => s.configured).length;
    return Math.round(80 + 20 * (optConfigured / optional.length));
  }

  const reqConfigured = required.filter(s => s.configured).length;
  if (reqConfigured < required.length) {
    // Some required vars missing
    return Math.round(80 * (reqConfigured / required.length));
  }

  // All required configured — bonus for optional
  const optConfigured = optional.length > 0
    ? optional.filter(s => s.configured).length / optional.length
    : 1;
  return Math.round(80 + 20 * optConfigured);
}

/**
 * Determines the current mode a provider is operating in.
 */
export function determineCurrentMode(
  def: ProviderDefinition,
  missingRequired: string[],
): ProviderMode {
  if (!def.liveCapable && !def.hybridCapable) return "simulation";
  if (def.envVars.length === 0) return "live"; // no config needed
  if (missingRequired.length === 0) {
    return def.liveCapable ? "live" : "hybrid";
  }
  // Has required vars but they're not all set
  const allRequired = def.envVars.filter(v => v.required).map(v => v.name);
  if (missingRequired.length < allRequired.length && def.hybridCapable) return "hybrid";
  if (!def.liveCapable && def.hybridCapable) return "planned";
  return "simulation";
}

/**
 * Determines operational status from mode and readiness score.
 */
export function determineOperationalStatus(
  mode: ProviderMode,
  score: number,
  def: ProviderDefinition,
): ProviderOperationalStatus {
  if (mode === "planned")    return "planned";
  if (mode === "simulation") return score === 100 ? "simulated" : "fallback-active";
  if (mode === "hybrid")     return "hybrid";
  // live mode
  if (score >= 80)           return "operational";
  return "live-ready";
}

/**
 * Full validation for a single provider.
 */
export function validateProvider(def: ProviderDefinition): ProviderReadinessState {
  const envVarStatuses = validateProviderEnvVars(def);
  const missingRequired = getMissingRequired(envVarStatuses);
  const missingOptional = getMissingOptional(envVarStatuses);
  const readinessScore  = calculateReadinessScore(def, envVarStatuses);
  const currentMode     = determineCurrentMode(def, missingRequired);
  const operationalStatus = determineOperationalStatus(currentMode, readinessScore, def);

  return {
    id:               def.id,
    name:             def.name,
    category:         def.category,
    definition:       def,
    currentMode,
    operationalStatus,
    readinessScore,
    liveReady:       currentMode === "live",
    fallbackActive:  currentMode === "simulation" && def.fallbackCapable,
    envVarStatuses,
    missingRequired,
    missingOptional,
  };
}
