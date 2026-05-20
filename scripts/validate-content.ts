import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { siteSchema } from "@/lib/content/site";
import { skillsSchema } from "@/lib/content/skills";
import { projectFrontmatterSchema } from "@/lib/content/project-schema";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const aboutSchema = z.object({
  intro: z.object({ es: z.string(), en: z.string() }),
  timeline: z.array(z.any()),
  values: z.array(z.any()),
});

const tagsSchema = z.record(
  z.string(),
  z.object({ es: z.string(), en: z.string() }),
);

type Issue = { level: "error" | "warn"; message: string };

const issues: Issue[] = [];

function error(message: string) {
  issues.push({ level: "error", message });
}

function warn(message: string) {
  issues.push({ level: "warn", message });
}

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

async function fileExists(relativePublicPath: string): Promise<boolean> {
  const clean = relativePublicPath.replace(/^\//, "");
  try {
    await fs.access(path.join(PUBLIC_DIR, clean));
    return true;
  } catch {
    return false;
  }
}

async function validateMessages() {
  const es = JSON.parse(
    await fs.readFile(path.join(process.cwd(), "messages", "es.json"), "utf-8"),
  );
  const en = JSON.parse(
    await fs.readFile(path.join(process.cwd(), "messages", "en.json"), "utf-8"),
  );

  const esKeys = new Set(deepKeys(es));
  const enKeys = new Set(deepKeys(en));

  for (const key of esKeys) {
    if (!enKeys.has(key)) error(`Missing EN message key: ${key}`);
  }
  for (const key of enKeys) {
    if (!esKeys.has(key)) error(`Missing ES message key: ${key}`);
  }

  if ("meta" in es || "meta" in en) {
    error('Remove deprecated "meta" namespace from messages');
  }
}

async function validateSiteAboutSkills() {
  const siteRaw = JSON.parse(
    await fs.readFile(path.join(process.cwd(), "content", "site.json"), "utf-8"),
  );
  siteSchema.parse(siteRaw);

  const aboutRaw = JSON.parse(
    await fs.readFile(path.join(process.cwd(), "content", "about.json"), "utf-8"),
  );
  aboutSchema.parse(aboutRaw);

  const skillsRaw = JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), "content", "skills.json"),
      "utf-8",
    ),
  );
  skillsSchema.parse(skillsRaw);
}

async function validateRegistries() {
  const tagsRaw = JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), "content", "registries", "tags.json"),
      "utf-8",
    ),
  );
  return tagsSchema.parse(tagsRaw);
}

async function validateProjects(tagRegistry: Record<string, unknown>) {
  const entries = await fs.readdir(PROJECTS_DIR);
  const slugs = new Set<string>();

  for (const file of entries) {
    if (!file.endsWith(".json") && !file.endsWith(".mdx")) continue;

    const slug = file.replace(/\.(json|mdx)$/i, "");
    if (slugs.has(slug)) {
      error(`Duplicate slug: ${slug}`);
    }
    slugs.add(slug);

    const filePath = path.join(PROJECTS_DIR, file);
    const raw = await fs.readFile(filePath, "utf-8");

    if (file.endsWith(".json")) {
      const data = projectFrontmatterSchema.parse(JSON.parse(raw));
      await validateProjectAssets(data, slug);
      for (const tagId of data.tagIds) {
        if (!(tagId in tagRegistry)) {
          error(`Project ${slug}: unknown tagId "${tagId}"`);
        }
      }
      continue;
    }

    const { data, content } = matter(raw);
    const parsed = projectFrontmatterSchema.parse(data);

    if (content.trim() && !parsed.markdownContent) {
      error(
        `MDX ${file}: non-empty body without markdownContent.es/en in frontmatter`,
      );
    }

    await validateProjectAssets(parsed, slug);
    for (const tagId of parsed.tagIds) {
      if (!(tagId in tagRegistry)) {
        error(`Project ${slug}: unknown tagId "${tagId}"`);
      }
    }
  }
}

async function validateProjectAssets(
  data: z.infer<typeof projectFrontmatterSchema>,
  slug: string,
) {
  if (!(await fileExists(data.coverImage))) {
    error(`Project ${slug}: missing coverImage ${data.coverImage}`);
  }
  for (const img of data.galleryImages) {
    if (!(await fileExists(img))) {
      error(`Project ${slug}: missing gallery image ${img}`);
    }
  }

  const placeholders = ["https://github.com", "https://example.com"];
  if (data.githubUrl && placeholders.includes(data.githubUrl)) {
    warn(`Project ${slug}: placeholder githubUrl`);
  }
}

async function main() {
  console.log("Validating content…\n");

  await validateMessages();
  await validateSiteAboutSkills();
  const tagRegistry = await validateRegistries();
  await validateProjects(tagRegistry);

  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warn");

  for (const w of warnings) console.warn(`⚠ ${w.message}`);
  for (const e of errors) console.error(`✖ ${e.message}`);

  if (errors.length) {
    console.error(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
    process.exit(1);
  }

  console.log(
    `\nOK — ${warnings.length} warning(s), 0 errors`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
