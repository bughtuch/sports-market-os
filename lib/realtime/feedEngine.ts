import type { FeedEvent } from "./feedTypes";
import { generateEvent } from "./eventGenerator";
import { getMotionState } from "./motionState";

// ─── Feed engine ──────────────────────────────────────────────────────────────
// Self-scheduling with variable cadence driven by motionState.
// Starts automatically when first subscriber joins.
// Stops automatically when last subscriber leaves.
// Architecture comment: replace scheduleNext() with a WebSocket/SSE source
// when live exchange feeds are available.

type Listener = (event: FeedEvent) => void;

class FeedEngine {
  private listeners = new Set<Listener>();
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private tickCount = 0;

  /** Subscribe to the feed. Returns an unsubscribe function. */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    if (this.listeners.size === 1) this.scheduleNext();
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) this.cancelPending();
    };
  }

  private scheduleNext(): void {
    const { feedCadenceMs } = getMotionState();
    // ±20% jitter so events don't feel mechanical
    const jitter = (Math.random() * 0.4 - 0.2) * feedCadenceMs;
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      if (this.listeners.size === 0) return;
      const event = generateEvent(this.tickCount++);
      this.listeners.forEach((l) => l(event));
      this.scheduleNext();
    }, Math.max(500, feedCadenceMs + jitter));
  }

  private cancelPending(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

// ─── Lazy singleton — client-only ─────────────────────────────────────────────

let _engine: FeedEngine | null = null;

export function getFeedEngine(): FeedEngine | null {
  if (typeof window === "undefined") return null;
  if (!_engine) _engine = new FeedEngine();
  return _engine;
}
