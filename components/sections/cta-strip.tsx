import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/navigation";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";

export async function CtaStrip() {
  const t = await getTranslations("cta");

  return (
    <SectionWrapper className="pb-32">
      <ScrollReveal>
        <div className="glass-panel relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.15),transparent_55%)]" />
          <p className="font-mono text-sm uppercase tracking-wider text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="relative mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">
            {t("description")}
          </p>
          <Button asChild size="lg" className="relative mt-8">
            <Link href="/contact">
              {t("button")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
