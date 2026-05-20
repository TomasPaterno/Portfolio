import type { Project } from "@/types/project";

export const projectSectionIds = [
  "overview",
  "technical",
  "metrics",
  "gallery",
  "writeup",
] as const;

export type ProjectSectionId = (typeof projectSectionIds)[number];

export function getVisibleProjectSections(project: Project): ProjectSectionId[] {
  return projectSectionIds.filter((id) => {
    if (id === "technical") return project.technicalDetails.length > 0;
    if (id === "metrics") return project.metrics.length > 0;
    if (id === "gallery") return project.galleryImages.length > 0;
    if (id === "writeup") return !!project.markdownContent?.trim();
    return true;
  });
}
