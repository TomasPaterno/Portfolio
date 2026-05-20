import Link from "next/link";
import { Code2, Network } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-sm text-muted-foreground">
              {siteConfig.name} — {siteConfig.title}
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="GitHub"
            >
              <Code2 className="h-5 w-5" />
            </Link>
            <Link
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="LinkedIn"
            >
              <Network className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <Separator className="my-8" />
        <p className="text-center text-xs text-muted-foreground md:text-left">
          © {year} {siteConfig.author}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
