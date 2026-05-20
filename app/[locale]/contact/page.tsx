import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Code2, Mail, Network } from "lucide-react";
import { getSiteConfig } from "@/config/site";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/navigation";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = getSiteConfig(locale as Locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription", { name: site.name }),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const site = getSiteConfig(locale as Locale);

  return (
    <SectionWrapper className="pt-8" narrow>
      <ScrollReveal>
        <p className="font-mono text-sm uppercase tracking-wider text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">{t("intro")}</p>
      </ScrollReveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Card className="glass-panel border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-primary" />
              {t("emailTitle")}
            </CardTitle>
            <CardDescription>{t("emailDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">{t("socialTitle")}</CardTitle>
            <CardDescription>{t("socialDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link
                href={site.social.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 className="mr-2 h-4 w-4" />
                {t("github")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Network className="mr-2 h-4 w-4" />
                {t("linkedin")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <ScrollReveal className="mt-12">
        <div className="glass-panel rounded-xl p-8 text-center text-sm text-muted-foreground">
          <p>{t("formNote")}</p>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
