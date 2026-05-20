import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllProjects } from "@/lib/content/projects";
import { ProjectsFilter } from "@/components/projects/projects-filter";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const projects = await getAllProjects(locale as Locale);

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
