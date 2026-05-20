<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Portfolio content architecture

Before editing content or planning CMS features, read [`docs/README.md`](docs/README.md).

- **Projects:** `content/projects/*.{json,mdx}` with `tagIds` → `content/registries/tags.json` (Zod: `lib/content/project-schema.ts`)
- **Site / about / skills:** `content/site.json`, `about.json`, `skills.json` (loaders in `lib/content/`)
- **UI strings:** `messages/es.json` + `messages/en.json` (sync keys; no `meta` namespace)
- **Validation:** `npm run validate:content` before build
- **Routes:** always prefixed `/es` or `/en` (next-intl)
- **Migration from old shape:** [`docs/15-migration-guide.md`](docs/15-migration-guide.md)
