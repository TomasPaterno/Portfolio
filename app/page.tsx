import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { SkillsMarquee } from "@/components/sections/skills-marquee";
import { CtaStrip } from "@/components/sections/cta-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <SkillsMarquee />
      <CtaStrip />
    </>
  );
}
