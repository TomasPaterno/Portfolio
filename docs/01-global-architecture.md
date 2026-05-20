# 1. Global Architecture

## 1.1 Propósito del sistema

Portfolio estático/SSG para perfil de ingeniería embebida, con:

- **Presentación premium** (dark, glassmorphism, animaciones Framer Motion),
- **Contenido orientado a proyectos** (case studies técnicos),
- **Bilingüismo** ES (default, Argentina) + EN,
- **Deploy** en Vercel sin configuración custom de build.

No existe backend propio ni base de datos. Todo el contenido vive en el repositorio como archivos.

## 1.2 Stack tecnológico

| Capa | Tecnología | Versión (lock) |
|------|------------|----------------|
| Framework | Next.js App Router | 16.2.6 |
| UI | React | 19.2.4 |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS v4 + `@tailwindcss/typography` | 4.x |
| i18n | next-intl | 4.12.x |
| Validación contenido | Zod | 4.4.x |
| MDX runtime | next-mdx-remote/rsc + remark-gfm | 6.x |
| Animación | framer-motion | 12.x |
| Iconos | lucide-react | 1.16.x |
| UI primitives | Radix + shadcn patterns | varios |

## 1.3 Principios arquitectónicos actuales

1. **Single source per concern (parcial):** proyectos → filesystem; UI → messages; perfil → config TS.
2. **Server-first:** páginas y secciones cargan datos en Server Components; interactividad mínima en cliente (filtros, header, animaciones).
3. **Locale en URL:** prefijo obligatorio `/es` y `/en` — no hay detección automática por `Accept-Language`.
4. **Proyectos auto-descubiertos:** ningún registro manual de rutas; el filename define el slug.
5. **Resolución en build/request:** contenido bilingüe se aplana a un locale antes de renderizar.

## 1.4 Capas lógicas

```mermaid
flowchart TB
  subgraph presentation [Presentation Layer]
    Pages[app/[locale]/pages]
    Components[components/*]
  end

  subgraph application [Application Layer]
    Intl[next-intl messages]
    SiteCfg[getSiteConfig]
    AboutData[getAboutTimeline]
    SkillsData[getSkillCategories]
  end

  subgraph domain [Content Domain]
    ProjectLoader[lib/content/projects.ts]
    Resolver[resolve-project.ts]
    Schema[project-schema Zod]
  end

  subgraph infrastructure [Infrastructure]
    FS[Node fs/promises]
    MDX[compile-mdx.tsx]
    Middleware[middleware.ts]
  end

  Pages --> Components
  Pages --> application
  Pages --> ProjectLoader
  ProjectLoader --> Schema
  ProjectLoader --> Resolver
  ProjectLoader --> FS
  Pages --> MDX
  Middleware --> Pages
```

## 1.5 Flujo de request (runtime)

1. Request llega a Vercel / `next dev`.
2. **`middleware.ts`** (next-intl): valida locale, redirige `/` → `/es`.
3. Matchea `app/[locale]/...`.
4. **`i18n/request.ts`** carga `messages/{locale}.json`.
5. Página server:
   - llama loaders (`getAllProjects`, `getSiteConfig`, etc.),
   - compila MDX si aplica,
   - renderiza RSC + hidrata client islands.
6. Respuesta HTML estática (SSG) o regenerada según modo de build.

## 1.6 Flujo de build

1. `next build` (Turbopack).
2. `generateStaticParams` en `[locale]/layout` → `es`, `en`.
3. `generateStaticParams` en `[locale]/projects/[slug]` → producto cartesiano `locale × slug`.
4. Lectura de `content/projects/*` en build time.
5. Zod valida cada archivo; fallo de build si schema inválido.
6. Emisión de HTML para rutas estáticas; `sitemap.xml` y `robots.txt` generados.

## 1.7 Límites actuales (importante para CMS)

| Capacidad | Estado |
|-----------|--------|
| CRUD proyectos vía API | No existe |
| Upload imágenes vía UI | No; manual en `public/` |
| Preview draft | No |
| Validación messages ES/EN en CI | No automatizada |
| Cache de proyectos | No; re-lectura FS |
| Slug por locale | No; slug único |
| Tags unificados cross-locale | No; arrays distintos ES/EN |
| Edición About/Skills sin deploy | No (módulos TS) |

## 1.8 Objetivo CMS futuro (target architecture)

La documentación asume evolución hacia:

```
Admin App  →  Content API  →  Git / DB / Blob storage  →  Build webhook  →  Vercel
```

Contratos detallados en [13-cms-integration.md](./13-cms-integration.md).

## 1.9 Dependencias entre capas

| Si cambias… | Impacta… |
|-------------|----------|
| `project-schema.ts` | Build, todos los JSON/MDX, tipos `Project` |
| `messages/*.json` (solo una clave) | UI rota en un idioma si falta paridad |
| `config/site.ts` | Hero, footer, metadata layout, contact email |
| `routing.locales` | middleware, sitemap, generateStaticParams, switcher |
| `globals.css` tokens | Todo el sitio visual |
| Imagen en `public/` sin actualizar JSON | 404 de imagen en UI |
