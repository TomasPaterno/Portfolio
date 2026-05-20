import type { SiteConfig } from "@/lib/content/site";
import type { Locale } from "@/i18n/routing";

type JsonLdPersonProps = {
  site: SiteConfig;
  locale: Locale;
};

export function JsonLdPerson({ site, locale }: JsonLdPersonProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.title,
    description: site.description,
    url: `${site.url}/${locale}`,
    sameAs: [site.social.github, site.social.linkedin],
    email: site.email,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
