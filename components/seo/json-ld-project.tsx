import type { Project } from "@/types/project";
import type { SiteConfig } from "@/lib/content/site";

type JsonLdProjectProps = {
  project: Project;
  site: SiteConfig;
  locale: string;
};

export function JsonLdProject({ project, site, locale }: JsonLdProjectProps) {
  const title = project.seo?.title ?? project.title;
  const description =
    project.seo?.description ?? project.shortDescription;

  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    datePublished: project.date,
    dateModified: project.updatedAt ?? project.date,
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    image: project.coverImage.startsWith("http")
      ? project.coverImage
      : `${site.url}${project.coverImage}`,
    url: `${site.url}/${locale}/projects/${project.slug}`,
    keywords: project.tags.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
