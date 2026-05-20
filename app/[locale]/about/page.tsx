import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAboutContent } from "@/lib/content/about";
import { getSiteConfig } from "@/config/site";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = getSiteConfig(locale as Locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription", {
      name: site.name,
      title: site.title,
    }),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const about = await getAboutContent(loc);

  return (
    <SectionWrapper className="pt-8">
      <ScrollReveal>
        <p className="font-mono text-sm uppercase tracking-wider text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {about.intro}
        </p>
      </ScrollReveal>

      <div className="mt-20">
        <h2 className="font-mono text-sm uppercase tracking-wider text-primary">
          {t("experience")}
        </h2>
        <StaggerChildren className="mt-8 space-y-0">
          {about.timeline.map((item) => (
            <div
              key={`${item.year}-${item.title}`}
              className="glass-panel glow-hover border-t-0 first:rounded-t-xl last:rounded-b-xl border-x border-b border-border px-6 py-8 first:border-t"
            >
              <p className="font-mono text-xs text-muted-foreground">
                {item.year}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </StaggerChildren>
      </div>

      <div className="mt-20">
        <h2 className="font-mono text-sm uppercase tracking-wider text-primary">
          {t("principles")}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {about.values.map((v) => (
            <div key={v.title} className="glass-panel rounded-xl p-6">
              <h3 className="text-lg font-semibold">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
