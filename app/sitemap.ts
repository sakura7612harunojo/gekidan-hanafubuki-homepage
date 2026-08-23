import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gekidan-hanafubuki-homepage.vercel.app";

  return [
    {
      url: baseUrl,
      priority: 1,
      changeFrequency: "daily",
    },
    {
      url: `${baseUrl}/performances`,
      priority: 0.9,
      changeFrequency: "daily",
    },
    {
      url: `${baseUrl}/news`,
      priority: 0.8,
      changeFrequency: "daily",
    },
  ];
}
