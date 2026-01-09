import { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/stores";
import { categories } from "@/data/categories";
import { platforms } from "@/data/platforms";

const BASE_URL = "https://appstores.dev";

// Popular comparison pairs for sitemap
const popularComparisons = [
  "google-play-vs-apple-app-store",
  "google-play-vs-amazon-appstore",
  "apple-app-store-vs-samsung-galaxy-store",
  "steam-vs-epic-games-store",
  "f-droid-vs-google-play",
  "huawei-appgallery-vs-google-play",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const storeSlugs = await getAllSlugs();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/stores`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Store detail pages
  const storePages: MetadataRoute.Sitemap = storeSlugs.map((slug) => ({
    url: `${BASE_URL}/stores/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/stores/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Platform pages
  const platformPages: MetadataRoute.Sitemap = platforms.map((platform) => ({
    url: `${BASE_URL}/stores/platform/${platform.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Comparison pages
  const comparePages: MetadataRoute.Sitemap = popularComparisons.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...storePages, ...categoryPages, ...platformPages, ...comparePages];
}
