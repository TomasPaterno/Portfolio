"use client";

import { useMemo, type ReactNode } from "react";
import {
  ProjectSidebar,
  type ProjectSidebarProject,
} from "@/components/projects/project-sidebar";
import { useSectionSpy } from "@/hooks/use-section-spy";
import type { ProjectSectionId } from "@/lib/projects/sections";

type ProjectDetailShellProps = {
  project: ProjectSidebarProject;
  visibleSections: ProjectSectionId[];
  children: ReactNode;
};

export function ProjectDetailShell({
  project,
  visibleSections,
  children,
}: ProjectDetailShellProps) {
  const visibleIds = useMemo(
    () => visibleSections,
    [visibleSections],
  );
  const activeSection = useSectionSpy(visibleIds);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
      {children}
      <ProjectSidebar
        project={project}
        visibleSections={visibleIds}
        activeSection={activeSection}
      />
    </div>
  );
}
