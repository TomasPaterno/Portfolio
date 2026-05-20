import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteConfig } from "@/config/site";
import { getAllProjects, getProjectSlugs } from "@/lib/content/projects";
import type { Locale } from "@/i18n/routing";

const staticPaths = ["", "/projects", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteConfig("es");
  const base = site.url;
  const slugs = await getProjectSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const projects = await getAllProjects(locale as Locale);
    const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "/projects" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path === "/projects" ? 0.9 : 0.7,
      });
    }

    for (const slug of slugs) {
      const project = projectBySlug.get(slug);
      const lastModified = project?.updatedAt ?? project?.date;
      entries.push({
        url: `${base}/${locale}/projects/${slug}`,
        lastModified: lastModified ? new Date(lastModified) : new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
