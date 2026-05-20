import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/navigation";
import { getFeaturedProjects } from "@/lib/content/projects";
import { ProjectGrid } from "@/components/projects/project-grid";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";

type Props = {
  locale: Locale;
};

export async function FeaturedProjects({ locale }: Props) {
  const projects = await getFeaturedProjects(locale);
  const t = await getTranslations({ locale, namespace: "featured" });

  return (
    <SectionWrapper id="featured">
      <ScrollReveal>
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-wider text-primary">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <Button asChild variant="ghost" className="self-start sm:self-auto">
            <Link href="/projects">
              {t("allProjects")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </ScrollReveal>
      <ProjectGrid projects={projects} />
    </SectionWrapper>
  );
}
