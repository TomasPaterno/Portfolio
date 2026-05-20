import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProjects } from "@/lib/content/projects";
import { ProjectGrid } from "@/components/projects/project-grid";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects();

  return (
    <SectionWrapper id="featured">
      <ScrollReveal>
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-wider text-primary">
              Selected work
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Featured projects
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Flight controllers, sensor hubs, and signal processing — engineered
              for reliability under real-world constraints.
            </p>
          </div>
          <Button asChild variant="ghost" className="self-start sm:self-auto">
            <Link href="/projects">
              All projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </ScrollReveal>
      <ProjectGrid projects={projects} />
    </SectionWrapper>
  );
}
