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

## Media (`media[]`)

Cada proyecto define una secuencia ordenada de imágenes y videos (autoplay en tarjetas y página de detalle):

```json
"media": [
  {
    "type": "image",
    "src": "/images/projects/mi-proyecto/cover.webp",
    "alt": { "es": "Vista principal", "en": "Main view" },
    "priority": true
  },
  {
    "type": "video",
    "src": "/videos/projects/mi-proyecto/demo.mp4",
    "poster": "/images/projects/mi-proyecto/poster.webp",
    "alt": { "es": "Demo en vuelo", "en": "Flight demo" },
    "muted": true
  }
],
"mediaSettings": {
  "imageDurationMs": 5500,
  "transition": "crossfade"
}
```

Videos: archivos en `public/videos/projects/{slug}/`. Ver [docs/schemas/project-media.schema.json](../../docs/schemas/project-media.schema.json).

## Plantilla JSON

```json
{
  "title": { "es": "Título", "en": "Title" },
  "description": { "es": "...", "en": "..." },
  "shortDescription": { "es": "...", "en": "..." },
  "tagIds": ["embedded", "rtos"],
  "technologies": ["STM32", "C"],
  "media": [
    {
      "type": "image",
      "src": "/images/projects/mi-proyecto/cover.svg",
      "alt": { "es": "Portada", "en": "Cover" },
      "priority": true
    }
  ],
  "githubUrl": "https://github.com/tu-usuario/repo",
  "featured": false,
  "date": "2026-03-01",
  "status": "completed",
  "markdownContent": {
    "es": "## Detalle\n\nMarkdown en español.",
    "en": "## Details\n\nMarkdown in English."
  }
}
```

## MDX

- Frontmatter YAML con los mismos campos (incl. `tagIds` y `media`).
- **No** dejar markdown en el body del archivo; usar solo `markdownContent.es` / `markdownContent.en`.

## Validación

```bash
npm run validate:content
```

Ver [docs/16-content-validation.md](../../docs/16-content-validation.md).
