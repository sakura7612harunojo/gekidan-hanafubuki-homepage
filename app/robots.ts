import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/auth"],
    },
    sitemap: "https://gekidan-hanafubuki-homepage.vercel.app/sitemap.xml",
    host: "https://gekidan-hanafubuki-homepage.vercel.app",
  };
}
