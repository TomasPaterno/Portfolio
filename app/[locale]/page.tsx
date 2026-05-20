import { setRequestLocale } from "next-intl/server";
import { getSiteConfig } from "@/config/site";
import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { SkillsMarquee } from "@/components/sections/skills-marquee";
import { CtaStrip } from "@/components/sections/cta-strip";
import { parseLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const loc = parseLocale(locale);
  if (!loc) notFound();

  setRequestLocale(loc);
  const site = getSiteConfig(loc);
  const sections = site.homeSections;

  return (
    <>
      <Hero name={site.name} title={site.title} description={site.description} />
      {sections.featuredProjects && <FeaturedProjects locale={loc} />}
      {sections.skillsMarquee && <SkillsMarquee locale={loc} />}
      {sections.ctaStrip && <CtaStrip />}
    </>
  );
}
