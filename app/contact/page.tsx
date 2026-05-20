import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Mail, Network } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  return (
    <SectionWrapper className="pt-8" narrow>
      <ScrollReveal>
        <p className="font-mono text-sm uppercase tracking-wider text-primary">
          Contact
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Let&apos;s connect
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Interested in embedded engineering roles, consulting, or technical
          collaboration? Reach out directly — I typically respond within a few
          days.
        </p>
      </ScrollReveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Card className="glass-panel border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-primary" />
              Email
            </CardTitle>
            <CardDescription>Best for detailed inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">Social</CardTitle>
            <CardDescription>Code and professional profile</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Network className="mr-2 h-4 w-4" />
                LinkedIn
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <ScrollReveal className="mt-12">
        <div className="glass-panel rounded-xl p-8 text-center text-sm text-muted-foreground">
          <p>
            Prefer a form? Connect Formspree, Resend, or Vercel contact API by
            replacing this section with your provider component.
          </p>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
