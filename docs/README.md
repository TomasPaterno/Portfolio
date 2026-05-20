# Portfolio — Developer & CMS Architecture Documentation

Documentación técnica del portfolio Next.js bilingüe (ES/EN), diseñada para:

- desarrolladores que mantienen el sitio hoy (git + archivos),
- futuros builders de una **app admin / CMS externo**,
- sistemas de automatización e IA que editan contenido de forma segura.

## Estado del sistema (resumen ejecutivo)

| Capa | Tecnología | Editable sin código |
|------|------------|---------------------|
| Rutas | Next.js App Router + `next-intl` | No |
| UI copy | `messages/{es,en}.json` | Sí (archivos) |
| Marca / SEO base | `content/site.json` | Sí |
| Proyectos | `content/projects/*.{json,mdx}` + `tagIds` | Sí |
| Tags | `content/registries/tags.json` | Sí |
| About / timeline | `content/about.json` | Sí |
| Skills home | `content/skills.json` | Sí |
| Nav / home sections | `site.json` → `navigation`, `homeSections` | Sí |
| Tema visual | `app/globals.css` | No (CSS) |
| Imágenes | `public/images/projects/` | Sí |
| Validación | `npm run validate:content` | CI / pre-build |

**Veredicto DX:** contenido estructurado en JSON bilingüe + registries + validación Zod. Deuda D1–D15 cerrada — ver [14-analysis-debt-refactors.md](./14-analysis-debt-refactors.md) y [15-migration-guide.md](./15-migration-guide.md).

## Mapa de documentos

| # | Documento | Contenido |
|---|-----------|-----------|
| 01 | [Global architecture](./01-global-architecture.md) | Vista de sistema, flujos, capas |
| 02 | [Folder structure](./02-folder-structure.md) | Árbol de directorios y responsabilidades |
| 03 | [Routing](./03-routing.md) | i18n routes, middleware, navegación |
| 04 | [Projects system](./04-projects-system.md) | Slugs, loader, MDX, featured, filtros |
| 05 | [i18n & translations](./05-i18n-translations.md) | Tres capas de traducción, fallbacks, SEO |
| 06 | [Theme & animation](./06-theme-animation.md) | Tokens CSS, Framer Motion |
| 07 | [Assets & images](./07-assets-images.md) | `public/`, next/image, galerías |
| 08 | [SEO & metadata](./08-seo-metadata.md) | generateMetadata, sitemap, hreflang |
| 09 | [Content schemas](./09-content-schemas.md) | Zod, tipos, validación |
| 10 | [Rendering pipeline](./10-rendering-pipeline.md) | RSC, build, SSG |
| 11 | [Component hierarchy](./11-component-hierarchy.md) | Árbol de componentes y props |
| 12 | [Editable parameters catalog](./12-editable-parameters-catalog.md) | **Catálogo de cada valor editable** |
| 13 | [CMS integration](./13-cms-integration.md) | Contratos, APIs futuras, storage ideal |
| 14 | [Analysis, debt & refactors](./14-analysis-debt-refactors.md) | Deuda resuelta + backlog |
| 15 | [Migration guide](./15-migration-guide.md) | Desde tags `{es,en}` y config TS |
| 16 | [Content validation](./16-content-validation.md) | `validate:content`, reglas CI |
| 17 | [PortfolioAdminApp](./17-portfolio-admin-app.md) | Editor local, preview, caché dev |

## Esquemas JSON (referencia CMS)

- [schemas/project.frontmatter.schema.json](./schemas/project.frontmatter.schema.json)
- [schemas/site-profile.schema.json](./schemas/site-profile.schema.json)
- [schemas/ui-messages.schema.json](./schemas/ui-messages.schema.json)

## Diagrama de alto nivel

```mermaid
flowchart TB
  subgraph editors [Editores futuros]
    Admin[Admin CMS App]
    Git[Git / IDE]
  end

  subgraph storage [Almacenamiento actual]
    Messages[messages/es.json + en.json]
    Projects[content/projects/*.json|mdx]
    SiteCfg[content/site.json]
    About[content/about.json]
    Skills[content/skills.json]
    Public[public/images]
  end

  subgraph runtime [Runtime Next.js]
    MW[middleware.ts]
    Loader[lib/content/projects.ts]
    Resolve[resolve-project.ts]
    Intl[next-intl]
    Pages[app/[locale]/*]
  end

  Admin -->|filesystem + revalidate API| storage
  Git --> storage
  storage --> Loader
  storage --> Intl
  storage --> SiteCfg
  MW --> Pages
  Loader --> Resolve --> Pages
  Intl --> Pages
```

## Convenciones de lectura

- **Ruta canónica:** siempre con prefijo de locale: `/es/...`, `/en/...`.
- **Slug de proyecto:** nombre de archivo sin extensión; **no** hay slugs localizados distintos por idioma.
- **Campo bilingüe:** objeto `{ "es": string, "en": string }` o array `{ "es": string[], "en": string[] }` para tags.
- **Campo resuelto:** tras `resolveProject()`, el sitio consume `string` simples para el locale activo.

## Quick links operativos

| Quiero cambiar… | Archivo(s) hoy | Doc |
|-----------------|----------------|-----|
| Texto de un botón | `messages/*.json` | [12](./12-editable-parameters-catalog.md#ui-messages) |
| Nombre / bio hero | `content/site.json` | [12](./12-editable-parameters-catalog.md#site-profile) |
| Un proyecto | `content/projects/` | [04](./04-projects-system.md) |
| Skills en home | `content/skills.json` | [12](./12-editable-parameters-catalog.md#skills) |
| Timeline About | `content/about.json` | [12](./12-editable-parameters-catalog.md#about) |
| Todo vía UI local | PortfolioAdminApp :3001 | [17](./17-portfolio-admin-app.md) |
| Color acento | `app/globals.css` | [06](./06-theme-animation.md) |
| URL producción | `NEXT_PUBLIC_SITE_URL` | [08](./08-seo-metadata.md) |
