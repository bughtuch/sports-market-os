import type { Metadata } from "next";
import type { Market, SportHub } from "@/lib/markets/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sportsmarketos.com";

export function hubMetadata(hub: SportHub): Metadata {
  return {
    title: `${hub.title} | Sports Market OS`,
    description: hub.seoDescription,
    alternates: { canonical: `${BASE_URL}/${hub.slug}` },
    openGraph: {
      title: `${hub.title} | Sports Market OS`,
      description: hub.seoDescription,
      url: `${BASE_URL}/${hub.slug}`,
      siteName: "Sports Market OS",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${hub.title} | Sports Market OS`,
      description: hub.seoDescription,
    },
  };
}

export function marketMetadata(market: Market): Metadata {
  const title = `${market.title} — Market Intelligence | Sports Market OS`;
  const description = market.description;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/markets/${market.slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/markets/${market.slug}`,
      siteName: "Sports Market OS",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function directoryMetadata(): Metadata {
  return {
    title: "Market Directory — All Sports Markets | Sports Market OS",
    description:
      "Browse all monitored sports prediction and exchange markets. Filter by sport, volatility, and AI confidence. Real-time market intelligence powered by Sports Market OS.",
    alternates: { canonical: `${BASE_URL}/markets` },
    openGraph: {
      title: "Market Directory | Sports Market OS",
      description:
        "Browse all monitored sports prediction and exchange markets.",
      url: `${BASE_URL}/markets`,
      siteName: "Sports Market OS",
      type: "website",
    },
  };
}
