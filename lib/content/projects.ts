import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import {
  projectFrontmatterSchema,
  type ProjectFrontmatter,
} from "@/lib/content/project-schema";
import type { Project } from "@/types/project";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

const CONTENT_EXTENSIONS = [".json", ".mdx"] as const;

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.(json|mdx)$/i, "");
}

function toProject(
  data: ProjectFrontmatter,
  filename: string,
  isMdx: boolean,
): Project {
  const slug = data.slug ?? getSlugFromFilename(filename);
  return { ...data, slug, isMdx };
}

async function loadJsonProject(filename: string): Promise<Project> {
  const filePath = path.join(PROJECTS_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = projectFrontmatterSchema.parse(JSON.parse(raw));
  return toProject(parsed, filename, false);
}

async function loadMdxProject(filename: string): Promise<Project> {
  const filePath = path.join(PROJECTS_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  const parsed = projectFrontmatterSchema.parse(data);
  const withBody: ProjectFrontmatter = {
    ...parsed,
    markdownContent: content.trim() || parsed.markdownContent,
  };
  return toProject(withBody, filename, true);
}

async function loadProjectFile(filename: string): Promise<Project | null> {
  if (filename.endsWith(".json")) return loadJsonProject(filename);
  if (filename.endsWith(".mdx")) return loadMdxProject(filename);
  return null;
}

/** List project content files (excludes README and schema helpers). */
async function listProjectFiles(): Promise<string[]> {
  const entries = await fs.readdir(PROJECTS_DIR);
  return entries.filter((name) =>
    CONTENT_EXTENSIONS.some((ext) => name.endsWith(ext)),
  );
}

/** All projects, newest first. */
export async function getAllProjects(): Promise<Project[]> {
  const files = await listProjectFiles();
  const projects = await Promise.all(files.map(loadProjectFile));
  return projects
    .filter((p): p is Project => p !== null)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  const all = await getAllProjects();
  return all.map((p) => p.slug);
}
