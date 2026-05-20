# 12. Rendering Pipeline & 16. Build System

## 12.1 Server vs Client boundary

| Server Components | Client Components |
|-------------------|-------------------|
| Pages `[locale]/*` | SiteHeader, Hero |
| FeaturedProjects, SkillsMarquee, CtaStrip | ProjectsFilter, ProjectGrid |
| ProjectContent | ProjectCard, ProjectGallery, ProjectSidebar |
| SiteFooter | LanguageSwitcher, motion wrappers |
| MetricsBlock (wrapper) | AnimatedBackground (partial) |

**Regla:** data fetching en server; pasar props serializables a client.

## 12.2 Home page pipeline

```
app/[locale]/page.tsx
  → setRequestLocale(locale)
  → Hero (client: site + messages.hero)
  → FeaturedProjects(server: getFeaturedProjects(locale))
       → ProjectGrid(client) → ProjectCard × N
  → SkillsMarquee(server: getSkillCategories)
  → CtaStrip(server: getTranslations)
```

## 12.3 Project detail pipeline

```
params: { locale, slug }
  → getProjectBySlug(slug, locale)
  → generateMetadata (SEO)
  → Render hero Image + inline copy
  → ProjectContent
       → compileProjectMarkdown(markdownContent) if present
       → sections conditional
  → ProjectSidebar (client anchors)
```

## 12.4 MDX compilation

**Archivo:** `lib/mdx/compile-mdx.tsx`

- `compileMDX` from `next-mdx-remote/rsc`
- Plugin: `remark-gfm`
- Output: React tree embebido en `<article className="prose ...">`
- **No** custom MDX components map — HTML estándar + GFM solo

## 12.5 Static generation matrix

| Route | SSG | Dynamic |
|-------|-----|---------|
| `/[locale]` | ● | |
| `/[locale]/about` | ● | |
| `/[locale]/contact` | ● | |
| `/[locale]/projects` | ● | |
| `/[locale]/projects/[slug]` | ƒ (build output shows dynamic in some Next versions) | params |

Build log observado: 19 páginas estáticas generadas.

## 16. Build system

### Scripts

| Script | Acción |
|--------|--------|
| `npm run dev` | `next dev` Turbopack |
| `npm run build` | production build + typecheck |
| `npm run start` | serve `.next` |
| `npm run lint` | eslint |
| `npm run format` | prettier |
| `npm run typecheck` | `tsc --noEmit` |

### next.config.ts

- Plugin `createNextIntlPlugin("./i18n/request.ts")`
- images.dangerouslyAllowSVG + CSP

### PostCSS

`postcss.config.mjs` — Tailwind v4.

### Output

- `.next/` build artifacts
- No `output: 'export'` — requiere server Node en Vercel (default)

## 12.6 Caching

**No hay** `unstable_cache`, `"use cache"`, o `revalidate` en loaders.

Cada request/build re-lee disco. Refactor CMS: cache por slug.
