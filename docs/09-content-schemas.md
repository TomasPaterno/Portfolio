# 10. Content Schemas & 11. Validation Rules

## 10.1 Canonical schema location

**Fuente de verdad:** `lib/content/project-schema.ts` (Zod)

**Re-export documental:** `content/projects/schema.ts` (no duplicar cambios ahí)

**JSON Schema para CMS externos:** `docs/schemas/project.frontmatter.schema.json`

## 10.2 ProjectFrontmatterRaw (Zod)

| Field | Zod type | Bilingual | Required |
|-------|----------|-----------|----------|
| `slug` | string optional | No | No |
| `title` | localizedString | Yes | Yes |
| `description` | localizedString | Yes | Yes |
| `shortDescription` | localizedString | Yes | Yes |
| `tags` | localizedStringArray | Yes | Yes |
| `technologies` | string[] | No (shared) | Yes |
| `coverImage` | string | No | Yes |
| `galleryImages` | string[] | No | Default [] |
| `githubUrl` | url optional | No | No |
| `demoUrl` | url optional | No | No |
| `featured` | boolean | No | Default false |
| `date` | string | No | Yes (ISO recommended) |
| `status` | enum | No | Yes |
| `markdownContent` | localizedString optional | Yes | No |
| `technicalDetails` | array | Yes (label/value) | Default [] |
| `metrics` | array | Yes (label/value/unit) | Default [] |
| `videoUrl` | url optional | No | No |

### localizedStringSchema

```typescript
z.union([
  z.object({ es: z.string().min(1), en: z.string().min(1) }),
  z.string().min(1),  // legacy single string
]);
```

### status enum

`completed` | `in-progress` | `archived`

UI labels vienen de `messages.status.*` — **no** del JSON.

## 10.3 Resolved Project type

**Archivo:** `types/project.ts`

Todos los campos user-facing son `string` / `string[]` post-`resolveProject()`.

## 10.4 Site profile (no Zod hoy)

**Archivo:** `config/site.ts` — TypeScript `satisfies LocalizedString`

Ver `docs/schemas/site-profile.schema.json`.

## 10.5 UI messages (no Zod hoy)

Paridad manual entre `messages/es.json` y `messages/en.json`.

Ver `docs/schemas/ui-messages.schema.json` (estructura esperada).

## 11. Validation rules

### 11.1 Build-time

| Check | Cuándo falla |
|-------|--------------|
| Zod parse project file | `npm run build` |
| Invalid URL en githubUrl/demoUrl/videoUrl | build |
| Empty es/en in object form | `.min(1)` en strings |
| Invalid JSON | parse throw |
| Invalid MDX frontmatter YAML | gray-matter / Zod throw |

### 11.2 No validado hoy

- Existencia de imagen en `public/`
- Paridad keys messages ES/EN
- `date` formato ISO
- Slug único (duplicados sobrescriben en find — undefined behavior)
- URLs sociales placeholder

### 11.3 Reglas CMS recomendadas (CI)

```bash
# Futuro
npm run validate:content
# - zod all projects
# - diff message keys es vs en
# - check image paths exist
# - slug uniqueness
```

### 11.4 Side effects de validación fallida

- Build Vercel **falla** → no deploy.
- Dev server muestra error overlay en página afectada.
