"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          {siteConfig.name}
          <span className="ml-2 hidden text-muted-foreground sm:inline">
            / embedded
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
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
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm" variant="outline">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-left font-mono text-sm">
                Navigation
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-4">
              {siteConfig.nav.map((item) => (
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
                  {item.title}
                </Link>
              ))}
              <Button asChild className="mt-4">
                <Link href="/contact">Get in touch</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
