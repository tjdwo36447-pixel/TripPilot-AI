import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap:
      "https://trip-pilot-ai-web-xp2a.vercel.app/sitemap.xml",
  };
}