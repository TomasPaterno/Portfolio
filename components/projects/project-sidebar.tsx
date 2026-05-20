"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Code2, ExternalLink } from "lucide-react";
import { Link } from "@/navigation";
import type { Project } from "@/types/project";
import { TechBadges } from "@/components/projects/tech-badges";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const sectionIds = [
  "overview",
  "technical",
  "metrics",
  "gallery",
  "writeup",
] as const;

type ProjectSidebarProps = {
  project: Project;
  activeSection?: string;
};

export function ProjectSidebar({ project, activeSection }: ProjectSidebarProps) {
  const t = useTranslations("projectDetail");
  const tStatus = useTranslations("status");
  const locale = useLocale() as Locale;

  const visibleSections = sectionIds.filter((id) => {
    if (id === "technical") return project.technicalDetails.length > 0;
    if (id === "metrics") return project.metrics.length > 0;
    if (id === "gallery") return project.galleryImages.length > 0;
    if (id === "writeup") return !!project.markdownContent?.trim();
    return true;
  });

  const sectionLabels: Record<(typeof sectionIds)[number], string> = {
    overview: t("overview"),
    technical: t("technical"),
    metrics: t("metrics"),
    gallery: t("gallery"),
    writeup: t("writeup"),
  };

  return (
    <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
      <div className="glass-panel rounded-xl p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t("status")}
        </p>
        <p className="mt-1 text-foreground">{tStatus(project.status)}</p>
        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t("date")}
        </p>
        <p className="mt-1 text-foreground">{formatDate(project.date, locale)}</p>

        <Separator className="my-6" />

        <nav
          className="hidden flex-col gap-1 lg:flex"
          aria-label={t("sectionsNav")}
        >
          {visibleSections.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                activeSection === id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              {sectionLabels[id]}
            </a>
          ))}
        </nav>

        <div className="mt-6 flex flex-col gap-2">
          {project.githubUrl && (
            <Button asChild variant="outline" className="w-full justify-start">
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 className="mr-2 h-4 w-4" />
                {t("viewSource")}
              </Link>
            </Button>
          )}
          {project.demoUrl && (
            <Button asChild variant="secondary" className="w-full justify-start">
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("liveDemo")}
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t("stack")}
        </p>
        <TechBadges technologies={project.technologies} tags={project.tags} />
      </div>
    </aside>
  );
}
