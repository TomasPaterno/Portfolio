"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Link, usePathname } from "@/navigation";
import type { SiteConfigRaw } from "@/lib/content/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

type SiteHeaderProps = {
  siteName: string;
  navigation: SiteConfigRaw["navigation"];
};

export function SiteHeader({ siteName, navigation }: SiteHeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const navItems = navigation.filter((item) => item.enabled);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          {siteName}
          <span className="ml-2 hidden text-muted-foreground sm:inline">
            {t("embeddedTag")}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Button asChild size="sm" variant="outline">
            <Link href="/contact">{t("getInTouch")}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("menu")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-left font-mono text-sm">
                  {t("menu")}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-lg",
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
                <Button asChild className="mt-4">
                  <Link href="/contact">{t("getInTouch")}</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
