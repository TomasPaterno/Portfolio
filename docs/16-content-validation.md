# 16 — Content validation

El script `scripts/validate-content.ts` valida todo el contenido editable antes del build.

## Ejecución

```bash
npm run validate:content
```

El build de producción lo ejecuta automáticamente:

```bash
npm run build   # → validate:content && next build
```

## Qué valida

| Área | Reglas |
|------|--------|
| `messages/es.json` vs `en.json` | Paridad de claves (deep diff); ausencia del namespace `meta` |
| `content/site.json` | Schema Zod (`siteSchema`) |
| `content/about.json` | Schema Zod |
| `content/skills.json` | Schema Zod |
| `content/registries/tags.json` | Registry de tags |
| `content/projects/*` | Schema Zod; slugs únicos; `tagIds` existen en registry |
| Assets | `coverImage` y `galleryImages` existen bajo `public/` |
| MDX | Error si hay body no vacío sin `markdownContent.es` / `markdownContent.en` |
| Warnings | URLs placeholder (`https://github.com`, `https://example.com`) |

## Errores comunes

- **Unknown tagId** — agregar el id en `content/registries/tags.json` antes de usarlo en un proyecto.
- **Missing EN/ES message key** — mantener las mismas claves en ambos archivos de mensajes.
- **MDX body without markdownContent** — mover el markdown al frontmatter bilingüe; el body del archivo debe quedar vacío.

## CI

Recomendado en GitHub Actions:

```yaml
- run: npm ci
- run: npm run validate:content
- run: npm run build
```

## Extensión

Para reglas nuevas (p. ej. `technologyIds` en registry), ampliar el script y documentar aquí.
