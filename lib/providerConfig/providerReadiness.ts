/**
 * providerReadiness.ts — System-wide provider readiness engine.
 *
 * Server-side only. Aggregates per-provider validation into a system summary.
 * Called from server components and API routes. Never exposes secret values.
 */

import type { SystemReadinessSummary } from "./configTypes";
import { PROVIDER_DEFINITIONS } from "./providerDefinitions";
import { validateProvider } from "./configValidation";

export function getSystemReadiness(): SystemReadinessSummary {
  const providers = PROVIDER_DEFINITIONS
    .sort((a, b) => a.activationOrder - b.activationOrder)
    .map(def => validateProvider(def));

  const liveReadyCount   = providers.filter(p => p.liveReady).length;
  const hybridReadyCount = providers.filter(p => p.currentMode === "hybrid").length;
  const simulatedCount   = providers.filter(p => p.currentMode === "simulation").length;
  const plannedCount     = providers.filter(p => p.currentMode === "planned").length;

  const missingRequirementsCount = providers.reduce(
    (sum, p) => sum + p.missingRequired.length,
    0,
  );

  // Overall readiness = average of all provider scores
  const overallReadiness = Math.round(
    providers.reduce((sum, p) => sum + p.readinessScore, 0) / providers.length,
  );

  return {
    providers,
    overallReadiness,
    liveReadyCount,
    hybridReadyCount,
    simulatedCount,
    plannedCount,
    missingRequirementsCount,
    generatedAt: new Date().toISOString(),
  };
}
