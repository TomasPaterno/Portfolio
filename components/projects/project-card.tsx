"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseLocale, routing } from "@/i18n/routing";
import { Link } from "@/navigation";
import type { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { scaleOnHover } from "@/lib/animations/variants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  priority?: boolean;
};

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const t = useTranslations("status");
  const locale = parseLocale(useLocale()) ?? routing.defaultLocale;
  const reduced = useReducedMotion();

  const card = (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "glow-hover flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute right-4 top-4 rounded-full bg-background/60 p-2 backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge variant="outline">{t(project.status)}</Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {formatDate(project.date, locale)}
          </span>
        </div>
        <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.shortDescription}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline" className="text-[10px]">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );

  if (reduced) {
    return <div className="group h-full">{card}</div>;
  }

  return (
    <motion.article
      className="group h-full"
      initial="rest"
      whileHover="hover"
      variants={scaleOnHover}
    >
      {card}
    </motion.article>
  );
}
