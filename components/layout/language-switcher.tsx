"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/navigation";
import { Link } from "@/navigation";
import { parseLocale, routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const locales = [...routing.locales] satisfies Locale[];

export function LanguageSwitcher() {
  const locale = parseLocale(useLocale()) ?? routing.defaultLocale;
  const pathname = usePathname();
  const t = useTranslations("language");

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-border bg-secondary/40 p-0.5"
      role="group"
      aria-label={t("ariaLabel")}
    >
      {locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={cn(
            "rounded px-2.5 py-1 font-mono text-xs uppercase transition-colors",
            locale === loc
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t(loc)}
        </Link>
      ))}
    </div>
  );
}
