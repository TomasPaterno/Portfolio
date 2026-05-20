import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/routing";
import { shouldReloadContentFromDisk } from "@/lib/content/content-cache";
import {
  projectFrontmatterSchema,
  type ProjectFrontmatterRaw,
} from "@/lib/content/project-schema";
import { resolveProject } from "@/lib/content/resolve-project";
import type { Project } from "@/types/project";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

const CONTENT_EXTENSIONS = [".json", ".mdx"] as const;

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.(json|mdx)$/i, "");
}

async function toProject(
  data: ProjectFrontmatterRaw,
  filename: string,
  locale: Locale,
): Promise<Project> {
  const slug = data.slug ?? getSlugFromFilename(filename);
  return resolveProject(data, slug, locale);
}

async function loadJsonProject(
  filename: string,
  locale: Locale,
): Promise<Project> {
  const filePath = path.join(PROJECTS_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = projectFrontmatterSchema.parse(JSON.parse(raw));
  return toProject(parsed, filename, locale);
}

async function loadMdxProject(
  filename: string,
  locale: Locale,
): Promise<Project> {
  const filePath = path.join(PROJECTS_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  const parsed = projectFrontmatterSchema.parse(data);
  const body = content.trim();

  const withBody: ProjectFrontmatterRaw = {
    ...parsed,
    ...(parsed.markdownContent || !body
      ? {}
      : { markdownContent: { es: body, en: body } }),
  };

  return toProject(withBody, filename, locale);
}

async function loadProjectFile(
  filename: string,
  locale: Locale,
): Promise<Project | null> {
  if (filename.endsWith(".json")) return loadJsonProject(filename, locale);
  if (filename.endsWith(".mdx")) return loadMdxProject(filename, locale);
  return null;
}

async function listProjectFiles(): Promise<string[]> {
  const entries = await fs.readdir(PROJECTS_DIR);
  return entries.filter((name) =>
    CONTENT_EXTENSIONS.some((ext) => name.endsWith(ext)),
  );
}

async function loadAllProjectsUncached(locale: Locale): Promise<Project[]> {
  const files = await listProjectFiles();
  const projects = await Promise.all(
    files.map((file) => loadProjectFile(file, locale)),
  );
  return projects
    .filter((p): p is Project => p !== null)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

export async function getAllProjects(locale: Locale): Promise<Project[]> {
  if (shouldReloadContentFromDisk()) {
    return loadAllProjectsUncached(locale);
  }
  return unstable_cache(
    () => loadAllProjectsUncached(locale),
    ["projects", locale],
    { tags: ["projects"] },
  )();
}

async function getProjectsBySlugMap(
  locale: Locale,
): Promise<Map<string, Project>> {
  const projects = await getAllProjects(locale);
  return new Map(projects.map((p) => [p.slug, p]));
}

export async function getFeaturedProjects(locale: Locale): Promise<Project[]> {
  const all = await getAllProjects(locale);
  return all.filter((p) => p.featured);
}

export async function getProjectBySlug(
  slug: string,
  locale: Locale,
): Promise<Project | null> {
  const map = await getProjectsBySlugMap(locale);
  return map.get(slug) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  const files = await listProjectFiles();
  return files.map(getSlugFromFilename);
}
