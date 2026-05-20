import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content/projects";
import { ProjectContent } from "@/components/projects/project-content";
import { ProjectSidebar } from "@/components/projects/project-sidebar";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Button } from "@/components/ui/button";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [{ url: project.coverImage, alt: project.title }],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <div className="relative border-b border-border/60">
        <div className="relative mx-auto max-w-6xl px-6 pt-8 pb-12">
          <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All projects
            </Link>
          </Button>
          <div className="relative aspect-[21/9] max-h-[420px] overflow-hidden rounded-2xl border border-border bg-secondary">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1152px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
              <p className="font-mono text-sm uppercase tracking-wider text-primary">
                {project.tags.join(" · ")}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                {project.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SectionWrapper className="pt-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <ProjectContent project={project} />
          <ProjectSidebar project={project} />
        </div>
      </SectionWrapper>
    </>
  );
}
