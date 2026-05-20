import type {
  ProjectFrontmatter,
  ProjectMetric,
  TechnicalDetail,
} from "@/lib/content/project-schema";

/** Full project record used across the app (includes derived slug). */
export type Project = ProjectFrontmatter & {
  slug: string;
  /** True when body came from an .mdx file */
  isMdx: boolean;
};

export type { ProjectMetric, TechnicalDetail };
