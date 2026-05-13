/**
 * NewsProvider — adapter interface for sports news APIs.
 *
 * Currently delegates to MockProvider.
 * Future integrations: AP Sports, Reuters Sport, The Odds API news endpoints.
 *
 * To add a real provider:
 *   1. Implement IProvider with your API client
 *   2. Set NEXT_PUBLIC_NEWS_PROVIDER=live in .env.local
 *   3. Register in providerRouter.ts
 */

import type { IProvider, NewsItem } from "./types";
import { MockProvider } from "./mockProvider";

const mock = new MockProvider();

export async function getNews(): Promise<NewsItem[]> {
  return mock.getNews();
}

export async function getNewsFromProvider(provider: IProvider): Promise<NewsItem[]> {
  return provider.getNews();
}
