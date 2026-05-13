// ─── Terminal clock utilities (pure functions — no side effects) ───────────────

/** Format a Date as UTC HH:MM:SS */
export function formatUtcTime(date: Date = new Date()): string {
  const h = date.getUTCHours().toString().padStart(2, "0");
  const m = date.getUTCMinutes().toString().padStart(2, "0");
  const s = date.getUTCSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/** Simulated feed latency in ms — oscillates realistically using two sine waves */
export function simulatedLatencyMs(nowMs: number): number {
  return Math.max(
    8,
    Math.round(
      24 +
      Math.sin(nowMs / 14_000) * 14 +
      Math.sin(nowMs / 3_200) * 6 +
      Math.sin(nowMs / 900) * 3,
    ),
  );
}

/** Simulated events-per-minute throughput */
export function simulatedEventsPerMin(nowMs: number): number {
  return Math.max(
    80,
    Math.round(
      148 +
      Math.sin(nowMs / 20_000) * 38 +
      Math.sin(nowMs / 5_000) * 14,
    ),
  );
}

/** Seconds until next simulated provider sync (cycles on a 30-second window) */
export function syncCountdownSecs(nowMs: number = Date.now()): number {
  return 30 - (Math.floor(nowMs / 1_000) % 30);
}

/** Session label based on UTC hour */
export function sessionLabel(nowMs: number = Date.now()): string {
  const utcHour = new Date(nowMs).getUTCHours();
  if (utcHour >= 0 && utcHour < 7) return "ASIA";
  if (utcHour >= 7 && utcHour < 13) return "LONDON";
  if (utcHour >= 13 && utcHour < 20) return "NEW YORK";
  return "OVERNIGHT";
}
