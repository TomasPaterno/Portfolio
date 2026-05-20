# 15 — Migration guide (pre-refactor → actual)

Guía para quien mantenía el portfolio antes de la resolución de deuda técnica (D1–D15).

## Resumen de cambios

| Antes | Ahora |
|-------|--------|
| `config/site.ts` con datos inline | `content/site.json` + `getSiteConfig()` en `config/site.ts` |
| `content/about.ts` / `config/skills.ts` | `content/about.json`, `content/skills.json` |
| `tags: { es: [], en: [] }` en proyectos | `tagIds: []` + `content/registries/tags.json` |
| `messages.meta` | Eliminado — SEO/perfil en `site.json` |
| Filtros por label de tag | Filtros por `tagId` (mismas categorías ES/EN) |
| `getProjectBySlug` re-lee todo | Cache `unstable_cache` + `Map` por slug |
| Nav hardcoded en header | `navigation[]` en `site.json` |

## Migrar tags en un proyecto

**Antes:**

```json
"tags": {
  "es": ["aeroespacial", "control"],
  "en": ["aerospace", "control-systems"]
}
```

**Después:**

1. Definir ids estables en `content/registries/tags.json`:

```json
{
  "aerospace": { "es": "aeroespacial", "en": "aerospace" },
  "control-systems": { "es": "control", "en": "control-systems" }
}
```

2. En el proyecto:

```json
"tagIds": ["aerospace", "control-systems"]
```

## Migrar perfil del sitio

Copiar nombre, título, descripción, keywords y links a `content/site.json`. Los labels de navegación siguen en `messages/nav.*`; las rutas y `labelKey` viven en `navigation[]`.

## Migrar about / skills

- Timeline: `year`, `title`, `description` bilingües en `content/about.json`.
- Skills: categorías con `id`, `title`, `skills[]` bilingües en `content/skills.json`.

## MDX

No dejar markdown suelto en el body. Usar solo `markdownContent.es` y `markdownContent.en` en el frontmatter.

## Validar

```bash
npm run validate:content
npm run build
```

Ver [16-content-validation.md](./16-content-validation.md).
