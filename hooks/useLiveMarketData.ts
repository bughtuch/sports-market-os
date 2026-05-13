"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { MarketSignal, MarketPulseItem, ProviderStatus, DataMode } from "@/lib/providers/types";

// ─── Fallback mock data (used when API is unreachable) ────────────────────────

const FALLBACK_SIGNALS: MarketSignal[] = [
  { id: "f-001", sport: "Horse Racing", timestamp: "14:32:08", title: "Sharp Money Detected — Ascot 2.40", description: "Significant unmatched liability appearing on the lay side. Pattern consistent with informed positioning.", confidence: 87, tag: "Premium", type: "Sharp Money", movement: "+34.2%", direction: "up", aiScore: 87, exchange: "Betfair", sparkData: [28, 31, 35, 32, 39, 37, 43, 41, 48, 46, 52, 58] },
  { id: "f-002", sport: "Tennis", timestamp: "14:29:51", title: "Liquidity Imbalance — Djokovic vs Alcaraz", description: "Exchange volume diverging from in-play price movement. Matched volume 34% above 20-day average.", confidence: 74, tag: "Free", type: "Liquidity Imbalance", movement: "+18.4%", direction: "up", aiScore: 74, exchange: "Smarkets", sparkData: [40, 42, 38, 45, 41, 50, 47, 55, 52, 60, 57, 66] },
  { id: "f-003", sport: "NBA", timestamp: "14:27:14", title: "AI Market Thesis — Warriors vs Lakers", description: "Model detects spread value on the under side based on pace-of-play regression and defensive scheme data.", confidence: 81, tag: "Premium", type: "AI Market Thesis", movement: "−6.1%", direction: "down", aiScore: 81, exchange: "FanDuel", sparkData: [60, 58, 62, 55, 59, 52, 56, 49, 53, 47, 50, 44] },
  { id: "f-004", sport: "NFL", timestamp: "14:24:03", title: "Volatility Compression — Chiefs vs Bills", description: "Implied volatility contracting sharply across the totals market. Three consecutive hours of compression.", confidence: 69, tag: "Free", type: "Volatility Watch", movement: "+4.7%", direction: "up", aiScore: 69, exchange: "DraftKings", sparkData: [50, 52, 48, 54, 50, 56, 52, 58, 54, 60, 56, 62] },
  { id: "f-005", sport: "Horse Racing", timestamp: "14:21:47", title: "Queue Health Warning — Cheltenham 3.15", description: "Betfair queue depth falling below threshold. Liquidity thinning on both sides simultaneously.", confidence: 92, tag: "API", type: "Queue Health", movement: "−12.1%", direction: "down", aiScore: 92, exchange: "Betfair", sparkData: [70, 68, 72, 65, 69, 62, 66, 59, 63, 56, 60, 54] },
  { id: "f-006", sport: "Prediction Markets", timestamp: "14:18:30", title: "Creator Signal — US Election Market", description: "AI-generated share card ready. Volume surge detected in US presidential market.", confidence: 78, tag: "Creator", type: "Creator Signal", movement: "+89.2%", direction: "up", aiScore: 78, exchange: "Polymarket", sparkData: [15, 18, 22, 19, 26, 23, 30, 27, 35, 32, 40, 46] },
  { id: "f-007", sport: "UFC", timestamp: "14:15:12", title: "Market News Catalyst — Poirier vs Gaethje", description: "Weight-cut rumour entering the market. Underdog price shortening without matching public volume.", confidence: 65, tag: "Free", type: "News Catalyst", movement: "+22.8%", direction: "up", aiScore: 65, exchange: "Betfair", sparkData: [20, 22, 25, 24, 28, 27, 32, 31, 36, 35, 40, 45] },
  { id: "f-008", sport: "Football", timestamp: "14:11:55", title: "Exchange Flow Shift — Premier League Markets", description: "Cross-market liquidity rotating from Asian handicap into match result markets.", confidence: 72, tag: "Premium", type: "Exchange Flow", movement: "+8.3%", direction: "up", aiScore: 72, exchange: "Pinnacle", sparkData: [30, 33, 31, 36, 34, 38, 36, 41, 39, 44, 42, 48] },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface LiveMarketData {
  signals: MarketSignal[];
  pulse: MarketPulseItem[];
  providerStatuses: ProviderStatus[];
  mode: DataMode;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  usingFallback: boolean;
  refresh: () => void;
}

const POLL_INTERVAL_MS = 15_000;

export function useLiveMarketData(): LiveMarketData {
  const [signals, setSignals] = useState<MarketSignal[]>(FALLBACK_SIGNALS);
  const [pulse, setPulse] = useState<MarketPulseItem[]>([]);
  const [providerStatuses, setProviderStatuses] = useState<ProviderStatus[]>([]);
  const [mode, setMode] = useState<DataMode>("simulation");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [sigRes, pulseRes, statusRes] = await Promise.allSettled([
        fetch("/api/live/signals"),
        fetch("/api/live/market-pulse"),
        fetch("/api/live/provider-status"),
      ]);

      let anySuccess = false;

      if (sigRes.status === "fulfilled" && sigRes.value.ok) {
        const json = await sigRes.value.json() as { signals?: MarketSignal[]; meta?: { mode: DataMode } };
        if (json.signals?.length) {
          setSignals(json.signals);
          if (json.meta?.mode) setMode(json.meta.mode);
          anySuccess = true;
        }
      }

      if (pulseRes.status === "fulfilled" && pulseRes.value.ok) {
        const json = await pulseRes.value.json() as { items?: MarketPulseItem[] };
        if (json.items?.length) setPulse(json.items);
      }

      if (statusRes.status === "fulfilled" && statusRes.value.ok) {
        const json = await statusRes.value.json() as { providers?: ProviderStatus[]; systemMode?: DataMode };
        if (json.providers?.length) setProviderStatuses(json.providers);
        if (json.systemMode) setMode(json.systemMode);
      }

      setUsingFallback(!anySuccess);
      setError(null);
      setLastUpdated(new Date().toISOString());
    } catch {
      setUsingFallback(true);
      setError("Feed temporarily unavailable — showing cached data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
    timerRef.current = setInterval(() => void fetchAll(), POLL_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchAll]);

  return {
    signals,
    pulse,
    providerStatuses,
    mode,
    loading,
    error,
    lastUpdated,
    usingFallback,
    refresh: () => void fetchAll(),
  };
}
