import type { MetadataRoute } from "next";
import { getAllMarkets, getAllHubs } from "@/lib/markets/data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sportsmarketos.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const hubs = getAllHubs();
  const markets = getAllMarkets();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/terminal`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/markets`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  const hubRoutes: MetadataRoute.Sitemap = hubs.map((h) => ({
    url: `${BASE_URL}/${h.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  const marketRoutes: MetadataRoute.Sitemap = markets.map((m) => ({
    url: `${BASE_URL}/markets/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...hubRoutes, ...marketRoutes];
}
