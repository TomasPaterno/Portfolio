# Agregar un proyecto (bilingüe ES + EN)

Creá un archivo `.json` o `.mdx` en esta carpeta. El sitio lo detecta solo — aparece en `/es/projects/...` y `/en/projects/...`.

## Tags (`tagIds`)

Los tags usan **ids estables** definidos en `content/registries/tags.json`:

```json
{
  "aerospace": { "es": "aeroespacial", "en": "aerospace" }
}
```

En el proyecto:

```json
"tagIds": ["aerospace", "stm32"]
```

Los filtros en `/projects` muestran las mismas categorías en ES y EN.

## Plantilla JSON

```json
{
  "title": { "es": "Título", "en": "Title" },
  "description": { "es": "...", "en": "..." },
  "shortDescription": { "es": "...", "en": "..." },
  "tagIds": ["embedded", "rtos"],
  "technologies": ["STM32", "C"],
  "coverImage": "/images/projects/mi-proyecto/cover.svg",
  "galleryImages": [],
  "githubUrl": "https://github.com/tu-usuario/repo",
  "featured": false,
  "date": "2026-03-01",
  "updatedAt": "2026-03-15",
  "status": "completed",
  "markdownContent": {
    "es": "## Detalle\n\nMarkdown en español.",
    "en": "## Details\n\nMarkdown in English."
  }
}
```

## MDX

- Frontmatter YAML con los mismos campos (incl. `tagIds`).
- **No** dejar markdown en el body del archivo; usar solo `markdownContent.es` / `markdownContent.en`.

## Validación

```bash
npm run validate:content
```

Ver [docs/16-content-validation.md](../../docs/16-content-validation.md).
