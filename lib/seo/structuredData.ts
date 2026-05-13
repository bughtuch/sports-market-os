import type { Market, SportHub } from "@/lib/markets/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sportsmarketos.com";

export function marketArticleLD(market: Market) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: market.title,
    description: market.description,
    url: `${BASE_URL}/markets/${market.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Sports Market OS",
      url: BASE_URL,
    },
    about: {
      "@type": "SportsEvent",
      name: market.title,
      sport: market.sport,
    },
  };
}

export function hubWebPageLD(hub: SportHub) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: hub.title,
    description: hub.seoDescription,
    url: `${BASE_URL}/${hub.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Sports Market OS",
      url: BASE_URL,
    },
    about: {
      "@type": "SportsOrganization",
      sport: hub.sport,
    },
  };
}

export function directoryDatasetLD() {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Sports Market OS — Market Directory",
    description:
      "AI-powered market intelligence dataset covering sports prediction and exchange markets across horse racing, tennis, NBA, NFL, UFC, football and prediction markets.",
    url: `${BASE_URL}/markets`,
    publisher: {
      "@type": "Organization",
      name: "Sports Market OS",
      url: BASE_URL,
    },
  };
}
