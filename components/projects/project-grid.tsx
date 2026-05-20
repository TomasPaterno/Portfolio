import type { Project } from "@/types/project";
import { ProjectCard } from "@/components/projects/project-card";
import { StaggerChildren } from "@/components/motion/stagger-children";

type ProjectGridProps = {
  projects: Project[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (!projects.length) {
    return (
      <p className="text-center text-muted-foreground">
        No projects yet. Add a JSON file to{" "}
        <code className="font-mono text-primary">content/projects/</code>.
      </p>
    );
  }

  return (
    <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          priority={index < 3}
        />
      ))}
    </StaggerChildren>
  );
}
