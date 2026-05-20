"use client";

import { skillCategories } from "@/config/skills";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";

export function SkillsMarquee() {
  return (
    <SectionWrapper id="skills" className="border-t border-border/40">
      <ScrollReveal>
        <p className="font-mono text-sm uppercase tracking-wider text-primary">
          Capabilities
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Engineering stack
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          From bare-metal firmware to flight-ready control loops — tools and
          platforms I use to ship reliable hardware systems.
        </p>
      </ScrollReveal>

      <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((category) => (
          <div
            key={category.name}
            className="glass-panel glow-hover rounded-xl p-6"
          >
            <h3 className="font-mono text-sm text-primary">{category.name}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-sm text-foreground/90"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}
