import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";

export function CtaStrip() {
  return (
    <SectionWrapper className="pb-32">
      <ScrollReveal>
        <div className="glass-panel relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.15),transparent_55%)]" />
          <p className="font-mono text-sm uppercase tracking-wider text-primary">
            Collaborate
          </p>
          <h2 className="relative mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Building something precise?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">
            Open to firmware, robotics, and hardware engineering roles — or
            technical collaborations on ambitious embedded products.
          </p>
          <Button asChild size="lg" className="relative mt-8">
            <Link href="/contact">
              Start a conversation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
