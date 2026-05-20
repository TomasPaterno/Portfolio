import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProjectSlugs } from "@/lib/content/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const slugs = await getProjectSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
