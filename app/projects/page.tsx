import type { Metadata } from "next";
import { getAllProjects } from "@/lib/content/projects";
import { ProjectsFilter } from "@/components/projects/projects-filter";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export const metadata: Metadata = {
  title: "Projects",
  description: "Embedded systems, firmware, and hardware engineering projects.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <SectionWrapper className="pt-8">
      <ScrollReveal>
        <p className="font-mono text-sm uppercase tracking-wider text-primary">
          Portfolio
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Projects
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Firmware, flight control, sensor networks, and FPGA signal chains —
          documented with specs, metrics, and architecture notes.
        </p>
      </ScrollReveal>
      <div className="mt-12">
        <ProjectsFilter projects={projects} />
      </div>
    </SectionWrapper>
  );
}
