"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/types/project";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProjectsFilterProps = {
  projects: Project[];
};

export function ProjectsFilter({ projects }: ProjectsFilterProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tags))].sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (status && p.status !== status) return false;
      if (tag && !p.tags.includes(tag)) return false;
      return true;
    });
  }, [projects, status, tag]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip
          active={status === null && tag === null}
          onClick={() => {
            setStatus(null);
            setTag(null);
          }}
        >
          All
        </FilterChip>
        {(["completed", "in-progress", "archived"] as const).map((s) => (
          <FilterChip
            key={s}
            active={status === s}
            onClick={() => {
              setStatus(s);
              setTag(null);
            }}
          >
            {s.replace("-", " ")}
          </FilterChip>
        ))}
      </div>
      <div className="mb-10 flex flex-wrap gap-2">
        {allTags.map((t) => (
          <FilterChip
            key={t}
            active={tag === t}
            onClick={() => {
              setTag(tag === t ? null : t);
              setStatus(null);
            }}
          >
            #{t}
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
