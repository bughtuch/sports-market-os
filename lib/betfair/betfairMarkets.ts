/**
 * betfairMarkets.ts — Sport/market definitions for Betfair routing.
 *
 * Maps Sports Market OS sport names to Betfair Exchange contexts.
 * Used by TradeLiveButton to determine routing behaviour per sport.
 */

export interface BetfairSportConfig {
  sport:        string;
  label:        string;
  exchangeNote: string;
  supported:    boolean;
}

export const BETFAIR_SPORTS: BetfairSportConfig[] = [
  {
    sport:        "Horse Racing",
    label:        "Horse Racing",
    exchangeNote: "UK & Irish racing — Betfair Exchange",
    supported:    true,
  },
  {
    sport:        "Tennis",
    label:        "Tennis",
    exchangeNote: "ATP & WTA — Betfair Exchange",
    supported:    true,
  },
  {
    sport:        "Football",
    label:        "Football",
    exchangeNote: "European leagues — Betfair Exchange",
    supported:    true,
  },
  {
    sport:        "NBA",
    label:        "NBA",
    exchangeNote: "American sports — Betfair Exchange",
    supported:    true,
  },
  {
    sport:        "NFL",
    label:        "NFL",
    exchangeNote: "American sports — Betfair Exchange",
    supported:    true,
  },
  {
    sport:        "UFC",
    label:        "UFC / MMA",
    exchangeNote: "Combat sports — Betfair Exchange",
    supported:    true,
  },
  {
    sport:        "Prediction Markets",
    label:        "Prediction Markets",
    exchangeNote: "Not available on Betfair Exchange",
    supported:    false,
  },
];

export function getBetfairSportConfig(sport: string): BetfairSportConfig | null {
  return BETFAIR_SPORTS.find((s) => s.sport === sport) ?? null;
}
