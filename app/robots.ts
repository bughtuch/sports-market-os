import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sportsmarketos.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account", "/creator-studio", "/watchlists", "/admin", "/partner-dashboard", "/export-studio", "/distribution-center"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
