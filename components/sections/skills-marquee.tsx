import { getTranslations } from "next-intl/server";
import { getSkillCategories } from "@/config/skills";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerChildren } from "@/components/motion/stagger-children";
import type { Locale } from "@/i18n/routing";

type Props = {
  locale: Locale;
};

export async function SkillsMarquee({ locale }: Props) {
  const categories = getSkillCategories(locale);
  const t = await getTranslations({ locale, namespace: "skills" });

  return (
    <SectionWrapper id="skills" className="border-t border-border/40">
      <ScrollReveal>
        <p className="font-mono text-sm uppercase tracking-wider text-primary">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">{t("description")}</p>
      </ScrollReveal>

      <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="glass-panel glow-hover rounded-xl p-6"
          >
            <h3 className="font-mono text-sm text-primary">{category.title}</h3>
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
