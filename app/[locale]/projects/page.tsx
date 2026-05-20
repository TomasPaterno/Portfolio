import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllProjects } from "@/lib/content/projects";
import { ProjectsFilter } from "@/components/projects/projects-filter";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { parseLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = parseLocale(locale);
  if (!loc) notFound();

  const t = await getTranslations({ locale: loc, namespace: "projects" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const loc = parseLocale(locale);
  if (!loc) notFound();

  setRequestLocale(loc);
  const t = await getTranslations("projects");
  const projects = await getAllProjects(loc);

  return (
    <SectionWrapper className="pt-8">
      <ScrollReveal>
        <p className="font-mono text-sm uppercase tracking-wider text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {t("description")}
        </p>
      </ScrollReveal>
      <div className="mt-12">
        <ProjectsFilter projects={projects} />
      </div>
    </SectionWrapper>
  );
}
