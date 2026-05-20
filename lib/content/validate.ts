import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { aboutSchema } from "@/lib/content/schemas";
import { siteSchema } from "@/lib/content/site";
import { skillsSchema } from "@/lib/content/skills";
import { projectFrontmatterSchema } from "@/lib/content/project-schema";

const tagsSchema = z.record(
  z.string(),
  z.object({ es: z.string(), en: z.string() }),
);

export type ContentIssue = { level: "error" | "warn"; message: string };

export type ContentValidationResult = {
  issues: ContentIssue[];
  errors: ContentIssue[];
  warnings: ContentIssue[];
};

function deepKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...deepKeys(value as Record<string, unknown>, full));
    } else {
      keys.push(full);
    }
  }
  return keys.sort();
}

async function fileExists(publicDir: string, relativePublicPath: string): Promise<boolean> {
  const clean = relativePublicPath.replace(/^\//, "");
  try {
    await fs.access(path.join(publicDir, clean));
    return true;
  } catch {
    return false;
  }
}

async function validateMessages(root: string, issues: ContentIssue[]) {
  const es = JSON.parse(
    await fs.readFile(path.join(root, "messages", "es.json"), "utf-8"),
  );
  const en = JSON.parse(
    await fs.readFile(path.join(root, "messages", "en.json"), "utf-8"),
  );

  const esKeys = new Set(deepKeys(es));
  const enKeys = new Set(deepKeys(en));

  for (const key of esKeys) {
    if (!enKeys.has(key)) issues.push({ level: "error", message: `Missing EN message key: ${key}` });
  }
  for (const key of enKeys) {
    if (!esKeys.has(key)) issues.push({ level: "error", message: `Missing ES message key: ${key}` });
  }

  if ("meta" in es || "meta" in en) {
    issues.push({ level: "error", message: 'Remove deprecated "meta" namespace from messages' });
  }
}

async function validateSiteAboutSkills(root: string) {
  const siteRaw = JSON.parse(
    await fs.readFile(path.join(root, "content", "site.json"), "utf-8"),
  );
  siteSchema.parse(siteRaw);

  const aboutRaw = JSON.parse(
    await fs.readFile(path.join(root, "content", "about.json"), "utf-8"),
  );
  aboutSchema.parse(aboutRaw);

  const skillsRaw = JSON.parse(
    await fs.readFile(path.join(root, "content", "skills.json"), "utf-8"),
  );
  skillsSchema.parse(skillsRaw);
}

async function validateRegistries(root: string) {
  const tagsRaw = JSON.parse(
    await fs.readFile(
      path.join(root, "content", "registries", "tags.json"),
      "utf-8",
    ),
  );
  return tagsSchema.parse(tagsRaw);
}

async function validateProjectAssets(
  publicDir: string,
  data: z.infer<typeof projectFrontmatterSchema>,
  slug: string,
  issues: ContentIssue[],
) {
  if (!(await fileExists(publicDir, data.coverImage))) {
    issues.push({ level: "error", message: `Project ${slug}: missing coverImage ${data.coverImage}` });
  }
  for (const img of data.galleryImages) {
    if (!(await fileExists(publicDir, img))) {
      issues.push({ level: "error", message: `Project ${slug}: missing gallery image ${img}` });
    }
  }

  const placeholders = ["https://github.com", "https://example.com"];
  if (data.githubUrl && placeholders.includes(data.githubUrl)) {
    issues.push({ level: "warn", message: `Project ${slug}: placeholder githubUrl` });
  }
}

async function validateProjects(
  root: string,
  tagRegistry: Record<string, unknown>,
  issues: ContentIssue[],
) {
  const projectsDir = path.join(root, "content", "projects");
  const publicDir = path.join(root, "public");
  const entries = await fs.readdir(projectsDir);
  const slugs = new Set<string>();

  for (const file of entries) {
    if (!file.endsWith(".json") && !file.endsWith(".mdx")) continue;

    const slug = file.replace(/\.(json|mdx)$/i, "");
    if (slugs.has(slug)) {
      issues.push({ level: "error", message: `Duplicate slug: ${slug}` });
    }
    slugs.add(slug);

    const filePath = path.join(projectsDir, file);
    const raw = await fs.readFile(filePath, "utf-8");

    if (file.endsWith(".json")) {
      const data = projectFrontmatterSchema.parse(JSON.parse(raw));
      await validateProjectAssets(publicDir, data, slug, issues);
      for (const tagId of data.tagIds) {
        if (!(tagId in tagRegistry)) {
          issues.push({ level: "error", message: `Project ${slug}: unknown tagId "${tagId}"` });
        }
      }
      continue;
    }

    const { data, content } = matter(raw);
    const parsed = projectFrontmatterSchema.parse(data);

    if (content.trim() && !parsed.markdownContent) {
      issues.push({
        level: "error",
        message: `MDX ${file}: non-empty body without markdownContent.es/en in frontmatter`,
      });
    }

    await validateProjectAssets(publicDir, parsed, slug, issues);
    for (const tagId of parsed.tagIds) {
      if (!(tagId in tagRegistry)) {
        issues.push({ level: "error", message: `Project ${slug}: unknown tagId "${tagId}"` });
      }
    }
  }
}

export async function validateContent(root = process.cwd()): Promise<ContentValidationResult> {
  const issues: ContentIssue[] = [];

  await validateMessages(root, issues);
  await validateSiteAboutSkills(root);
  const tagRegistry = await validateRegistries(root);
  await validateProjects(root, tagRegistry, issues);

  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warn");

  return { issues, errors, warnings };
}
