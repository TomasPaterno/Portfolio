import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/config/site";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LocaleHtmlLang } from "@/components/layout/locale-html-lang";
import { JsonLdPerson } from "@/components/seo/json-ld-person";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = getSiteConfig(locale as Locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.title}`,
      template: `%s — ${site.name}`,
    },
    description: site.description,
    keywords: site.keywords,
    authors: [{ name: site.author }],
    openGraph: {
      type: "website",
      locale: site.openGraphLocale,
      url: site.url,
      title: site.name,
      description: site.description,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
    },
    alternates: {
      languages: {
        es: "/es",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const site = getSiteConfig(locale as Locale);

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlLang locale={locale as Locale} />
      <JsonLdPerson site={site} locale={locale as Locale} />
      <SiteHeader siteName={site.name} navigation={site.navigation} />
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter />
    </NextIntlClientProvider>
  );
}
