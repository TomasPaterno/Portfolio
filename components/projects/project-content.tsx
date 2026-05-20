import { getTranslations } from "next-intl/server";
import type { Project } from "@/types/project";
import { compileProjectMarkdown } from "@/lib/mdx/compile-mdx";
import { MetricsBlock } from "@/components/projects/metrics-block";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Separator } from "@/components/ui/separator";

type ProjectContentProps = {
  project: Project;
};

export async function ProjectContent({ project }: ProjectContentProps) {
  const t = await getTranslations("projectDetail");
  const mdxContent = project.markdownContent
    ? await compileProjectMarkdown(project.markdownContent)
    : null;

  return (
    <div className="space-y-20">
      <section id="overview">
        <ScrollReveal>
          <h2 className="font-mono text-sm uppercase tracking-wider text-primary">
            {t("overview")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </ScrollReveal>
        {project.videoUrl && (
          <ScrollReveal className="mt-8">
            <div className="aspect-video overflow-hidden rounded-xl border border-border">
              <iframe
                src={project.videoUrl}
                title={`${project.title} demo`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </ScrollReveal>
        )}
      </section>

      {project.technicalDetails.length > 0 && (
        <section id="technical">
          <ScrollReveal>
            <h2 className="font-mono text-sm uppercase tracking-wider text-primary">
              {t("technicalTitle")}
            </h2>
          </ScrollReveal>
          <ScrollReveal className="mt-6">
            <dl className="glass-panel divide-y divide-border overflow-hidden rounded-xl">
              {project.technicalDetails.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-2 px-6 py-4 sm:grid-cols-[200px_1fr]"
                >
                  <dt className="font-mono text-sm text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </section>
      )}

      {project.metrics.length > 0 && (
        <section id="metrics">
          <ScrollReveal>
            <h2 className="mb-6 font-mono text-sm uppercase tracking-wider text-primary">
              {t("metricsTitle")}
            </h2>
          </ScrollReveal>
          <MetricsBlock metrics={project.metrics} />
        </section>
      )}

      {project.galleryImages.length > 0 && (
        <section id="gallery">
          <ScrollReveal>
            <h2 className="mb-6 font-mono text-sm uppercase tracking-wider text-primary">
              {t("gallery")}
            </h2>
          </ScrollReveal>
          <ProjectGallery images={project.galleryImages} title={project.title} />
        </section>
      )}

      {mdxContent && (
        <section id="writeup">
          <ScrollReveal>
            <h2 className="font-mono text-sm uppercase tracking-wider text-primary">
              {t("deepDive")}
            </h2>
          </ScrollReveal>
          <Separator className="my-6" />
          <article className="prose prose-invert prose-engineering max-w-none prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground">
            {mdxContent}
          </article>
        </section>
      )}
    </div>
  );
}
