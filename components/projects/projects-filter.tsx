"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Project } from "@/types/project";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProjectsFilterProps = {
  projects: Project[];
};

function tagLabelFor(projects: Project[], tagId: string): string {
  const project = projects.find((p) => p.tagIds.includes(tagId));
  if (!project) return tagId;
  const index = project.tagIds.indexOf(tagId);
  return project.tags[index] ?? tagId;
}

export function ProjectsFilter({ projects }: ProjectsFilterProps) {
  const t = useTranslations("projects");
  const tStatus = useTranslations("status");
  const [status, setStatus] = useState<string | null>(null);
  const [tagId, setTagId] = useState<string | null>(null);

  const allTagIds = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tagIds))].sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (status && p.status !== status) return false;
      if (tagId && !p.tagIds.includes(tagId)) return false;
      return true;
    });
  }, [projects, status, tagId]);

  if (!filtered.length) {
    return (
      <p className="text-center text-muted-foreground">
        {t("empty")}{" "}
        <code className="font-mono text-primary">content/projects/</code>
      </p>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip
          active={status === null && tagId === null}
          onClick={() => {
            setStatus(null);
            setTagId(null);
          }}
        >
          {t("filterAll")}
        </FilterChip>
        {(["completed", "in-progress", "archived"] as const).map((s) => (
          <FilterChip
            key={s}
            active={status === s}
            onClick={() => {
              setStatus(s);
              setTagId(null);
            }}
          >
            {tStatus(s)}
          </FilterChip>
        ))}
      </div>
      <div className="mb-10 flex flex-wrap gap-2">
        {allTagIds.map((id) => (
          <FilterChip
            key={id}
            active={tagId === id}
            onClick={() => {
              setTagId(tagId === id ? null : id);
              setStatus(null);
            }}
          >
            #{tagLabelFor(projects, id)}
          </FilterChip>
        ))}
      </div>
      <ProjectGrid projects={filtered} />
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("rounded-full transition-colors")}
    >
      <Badge variant={active ? "default" : "outline"}>{children}</Badge>
    </button>
  );
}
