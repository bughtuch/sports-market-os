import type { EscalationLevel } from "./feedTypes";

// ─── Escalation scoring ───────────────────────────────────────────────────────

export function computeEscalation(
  volatility: number,   // 0–100
  liquidity: number,    // 0–100
  hasCatalyst: boolean,
  confidence: number,   // 0–100
  divergence: number,   // 0–100
): EscalationLevel {
  let score = 0;

  // Volatility contribution
  if (volatility >= 80) score += 3;
  else if (volatility >= 60) score += 2;
  else if (volatility >= 40) score += 1;

  // Inverse liquidity contribution (thin liquidity = more risk)
  if (liquidity < 30) score += 3;
  else if (liquidity < 50) score += 2;
  else if (liquidity < 70) score += 1;

  // Catalyst multiplier
  if (hasCatalyst) score += 2;

  // AI confidence contribution
  if (confidence >= 85) score += 2;
  else if (confidence >= 70) score += 1;

  // Crowd/sharp divergence
  if (divergence >= 70) score += 2;
  else if (divergence >= 50) score += 1;

  if (score >= 9) return "critical";
  if (score >= 6) return "high";
  if (score >= 3) return "medium";
  return "low";
}

// ─── Colour helpers ───────────────────────────────────────────────────────────

export function escalationTextColor(level: EscalationLevel): string {
  switch (level) {
    case "critical": return "text-red-400";
    case "high":     return "text-orange-400";
    case "medium":   return "text-amber-400";
    case "low":      return "text-zinc-500";
  }
}

export function escalationBgBorder(level: EscalationLevel): string {
  switch (level) {
    case "critical": return "bg-red-400/10 border-red-400/20";
    case "high":     return "bg-orange-400/10 border-orange-400/20";
    case "medium":   return "bg-amber-400/10 border-amber-400/20";
    case "low":      return "bg-zinc-800/40 border-zinc-700/20";
  }
}

export function escalationDotColor(level: EscalationLevel): string {
  switch (level) {
    case "critical": return "bg-red-400";
    case "high":     return "bg-orange-400";
    case "medium":   return "bg-amber-400";
    case "low":      return "bg-zinc-600";
  }
}
