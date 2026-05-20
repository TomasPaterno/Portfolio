import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — ${siteConfig.title}.`,
};

const timeline = [
  {
    year: "2024 — Present",
    role: "Embedded Systems Engineer",
    org: "Aerospace & Robotics",
    detail:
      "Flight software, sensor fusion, and hardware-in-the-loop validation for autonomous platforms.",
  },
  {
    year: "2021 — 2024",
    role: "Firmware Engineer",
    org: "Industrial IoT",
    detail:
      "Zephyr and FreeRTOS products on ARM Cortex-M; CAN networks and factory-edge deployments.",
  },
  {
    year: "2018 — 2021",
    role: "Electronics Engineering",
    org: "University & Research Labs",
    detail:
      "PCB design, FPGA prototyping, and robotics competition teams — controls and embedded C.",
  },
];

const values = [
  {
    title: "Determinism",
    body: "Predictable timing, measured jitter, and documented worst-case paths — especially in control loops.",
  },
  {
    title: "Traceability",
    body: "Versioned firmware, reproducible builds, and test logs that survive field deployment.",
  },
  {
    title: "Systems thinking",
    body: "Firmware meets schematic meets mechanics — interfaces defined early, assumptions validated in HIL.",
  },
];

export default function AboutPage() {
  return (
    <SectionWrapper className="pt-8">
      <ScrollReveal>
        <p className="font-mono text-sm uppercase tracking-wider text-primary">
          Profile
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          About
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I build reliable embedded systems — from bare-metal bring-up to
          closed-loop control on autonomous hardware. My work sits at the
          intersection of firmware, electronics, and robotics, with a focus on
          measurable performance and field-ready quality.
        </p>
      </ScrollReveal>

      <div className="mt-20">
        <h2 className="font-mono text-sm uppercase tracking-wider text-primary">
          Experience
        </h2>
        <StaggerChildren className="mt-8 space-y-0">
          {timeline.map((item) => (
            <div
              key={item.year}
              className="glass-panel glow-hover border-t-0 first:rounded-t-xl last:rounded-b-xl border-x border-b border-border px-6 py-8 first:border-t"
            >
              <p className="font-mono text-xs text-muted-foreground">
                {item.year}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{item.role}</h3>
              <p className="text-primary">{item.org}</p>
              <p className="mt-3 text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </StaggerChildren>
      </div>

      <div className="mt-20">
        <h2 className="font-mono text-sm uppercase tracking-wider text-primary">
          Principles
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="glass-panel rounded-xl p-6">
              <h3 className="text-lg font-semibold">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
