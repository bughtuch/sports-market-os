/**
 * OddsProvider — adapter interface for odds data APIs.
 *
 * Currently delegates to MockProvider.
 * Future integrations: The Odds API, Pinnacle API, Betfair price feeds.
 *
 * To add a real provider:
 *   1. Implement IProvider with the odds API client
 *   2. Set NEXT_PUBLIC_ODDS_PROVIDER=live in .env.local
 *   3. Register in providerRouter.ts
 *
 * Compliance note:
 *   Sports Market OS reads odds for intelligence purposes only.
 *   No bet placement, no order routing, no custody of funds.
 */

import type { IProvider, OddsSnapshot } from "./types";
import { MockProvider } from "./mockProvider";

const mock = new MockProvider();

export async function getOddsSnapshots(): Promise<OddsSnapshot[]> {
  return mock.getOddsSnapshots();
}

export async function getOddsFromProvider(provider: IProvider): Promise<OddsSnapshot[]> {
  return provider.getOddsSnapshots();
}
