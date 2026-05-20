"use client";

import Link from "next/link";
import { Code2, ExternalLink } from "lucide-react";
import type { Project } from "@/types/project";
import { TechBadges } from "@/components/projects/tech-badges";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "technical", label: "Technical" },
  { id: "metrics", label: "Metrics" },
  { id: "gallery", label: "Gallery" },
  { id: "writeup", label: "Write-up" },
] as const;

type ProjectSidebarProps = {
  project: Project;
  activeSection?: string;
};

export function ProjectSidebar({ project, activeSection }: ProjectSidebarProps) {
  const visibleSections = sections.filter((s) => {
    if (s.id === "technical") return project.technicalDetails.length > 0;
    if (s.id === "metrics") return project.metrics.length > 0;
    if (s.id === "gallery") return project.galleryImages.length > 0;
    if (s.id === "writeup") return !!project.markdownContent?.trim();
    return true;
  });

  return (
    <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
      <div className="glass-panel rounded-xl p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Status
        </p>
        <p className="mt-1 capitalize text-foreground">{project.status}</p>
        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Date
        </p>
        <p className="mt-1 text-foreground">{formatDate(project.date)}</p>

        <Separator className="my-6" />

        <nav className="hidden flex-col gap-1 lg:flex" aria-label="Page sections">
          {visibleSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                activeSection === section.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="mt-6 flex flex-col gap-2">
          {project.githubUrl && (
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Code2 className="mr-2 h-4 w-4" />
                View source
              </Link>
            </Button>
          )}
          {project.demoUrl && (
            <Button asChild variant="secondary" className="w-full justify-start">
              <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live demo
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Stack
        </p>
        <TechBadges
          technologies={project.technologies}
          tags={project.tags}
        />
      </div>
    </aside>
  );
}
