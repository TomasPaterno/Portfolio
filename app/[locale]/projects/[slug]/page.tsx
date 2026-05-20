import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/config/site";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content/projects";
import { ProjectDetailShell } from "@/components/projects/project-detail-shell";
import { JsonLdProject } from "@/components/seo/json-ld-project";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug, locale as Locale);
  const t = await getTranslations({ locale, namespace: "projects" });

  if (!project) return { title: t("notFoundTitle") };

  const title = project.seo?.title ?? project.title;
  const description =
    project.seo?.description ?? project.shortDescription;
  const path = `/projects/${slug}`;

  return {
    title,
    description,
    robots: project.seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      images: [{ url: project.coverImage, alt: title }],
      locale: locale === "es" ? "es_AR" : "en_US",
    },
    alternates: {
      languages: {
        es: `/es${path}`,
        en: `/en${path}`,
      },
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const project = await getProjectBySlug(slug, locale as Locale);
  const site = getSiteConfig(locale as Locale);

  if (!project) {
    notFound();
  }

  return (
    <>
      <JsonLdProject project={project} site={site} locale={locale} />
      <div className="relative border-b border-border/60">
        <div className="relative mx-auto max-w-6xl px-6 pt-8 pb-12">
          <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToProjects")}
            </Link>
          </Button>
          <div className="relative aspect-[21/9] max-h-[420px] overflow-hidden rounded-2xl border border-border bg-secondary">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1152px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
              <p className="font-mono text-sm uppercase tracking-wider text-primary">
                {project.tags.join(" · ")}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                {project.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SectionWrapper className="pt-12">
        <ProjectDetailShell project={project} />
      </SectionWrapper>
    </>
  );
}
