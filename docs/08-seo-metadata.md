# 9. Metadata & SEO System

## 9.1 Fuentes de metadata

| Scope | Archivo | Función |
|-------|---------|---------|
| Site default | `app/[locale]/layout.tsx` | `generateMetadata` + `getSiteConfig(locale)` |
| Home | Hereda layout | — |
| Projects list | `projects/page.tsx` | `getTranslations("projects")` |
| Project detail | `projects/[slug]/page.tsx` | project fields + alternates |
| About | `about/page.tsx` | `messages.about` + site |
| Contact | `contact/page.tsx` | `messages.contact` + site |
| Sitemap | `app/sitemap.ts` | todas las URLs × locales |
| Robots | `app/robots.ts` | allow all + sitemap URL |

## 9.2 Layout metadata (global)

```typescript
metadataBase: new URL(site.url)  // NEXT_PUBLIC_SITE_URL
title.template: "%s — {name}"
description: site.description
keywords: site.keywords[]  // distinto por locale
openGraph.locale: es_AR | en_US
alternates.languages: { es: "/es", en: "/en" }
```

## 9.3 Project page metadata

- `title`: `project.title` (resuelto)
- `description`: `project.shortDescription`
- `openGraph.images`: `[{ url: coverImage }]`
- `alternates.languages`: `/es/projects/{slug}`, `/en/projects/{slug}`

**Nota:** `coverImage` como OG URL debe ser absoluta en producción — `metadataBase` ayuda si path es relativo `/images/...`.

## 9.4 Sitemap

**Archivo:** `app/sitemap.ts`

Genera:

- `/{locale}` para `locale in [es, en]`
- `/{locale}/projects`, `/about`, `/contact`
- `/{locale}/projects/{slug}` para cada slug

**Deuda:**

- `lastModified: new Date()` siempre — no refleja git mtime del contenido.
- `getSiteConfig("es")` para base URL — OK si URL no es locale-specific.

## 9.5 Robots

```typescript
allow: "/"
sitemap: `${siteConfig.url}/sitemap.xml`  // usa export deprecated siteConfig
```

## 9.6 No implementado

- `opengraph-image.tsx` / `twitter-image.tsx` dinámicos
- JSON-LD `Person`, `CreativeWork`
- `manifest.json`
- Canonical URLs explícitas per page (solo hreflang en projects)
- `noindex` per project

## 9.7 CMS SEO fields (recomendado)

Extender schema proyecto:

```json
"seo": {
  "title": { "es": "...", "en": "..." },
  "description": { "es": "...", "en": "..." },
  "ogImage": "/images/...",
  "noindex": false
}
```

Fallback chain: `seo.title` → `title`, etc.

## 9.8 Environment

| Variable | Efecto |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | metadataBase, sitemap, robots |

Sin esto en Vercel producción: URLs default `http://localhost:3000` en metadata.
