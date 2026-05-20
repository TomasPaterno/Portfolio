"use client";

import type { Project } from "@/types/project";
import { ProjectContent } from "@/components/projects/project-content";
import { ProjectSidebar } from "@/components/projects/project-sidebar";
import { useSectionSpy } from "@/hooks/use-section-spy";

const sectionIds = [
  "overview",
  "technical",
  "metrics",
  "gallery",
  "writeup",
] as const;

type ProjectDetailShellProps = {
  project: Project;
};

export function ProjectDetailShell({ project }: ProjectDetailShellProps) {
  const visibleIds = sectionIds.filter((id) => {
    if (id === "technical") return project.technicalDetails.length > 0;
    if (id === "metrics") return project.metrics.length > 0;
    if (id === "gallery") return project.galleryImages.length > 0;
    if (id === "writeup") return !!project.markdownContent?.trim();
    return true;
  });

  const activeSection = useSectionSpy([...visibleIds]);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
      <ProjectContent project={project} />
      <ProjectSidebar project={project} activeSection={activeSection} />
    </div>
  );
}
