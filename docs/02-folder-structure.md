# 2. Folder Structure

## 2.1 Árbol completo (referencia)

```
c:\Portfolio\
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root: html, body, fonts, globals.css
│   ├── globals.css               # Design tokens + utilities
│   ├── robots.ts                 # Route handler robots.txt
│   ├── sitemap.ts                # Route handler sitemap.xml
│   └── [locale]/                 # Segmento dinámico i18n
│       ├── layout.tsx            # Metadata, NextIntlClientProvider, header/footer
│       ├── page.tsx              # Home
│       ├── about/page.tsx
│       ├── contact/page.tsx
│       └── projects/
│           ├── page.tsx
│           └── [slug]/
│               ├── page.tsx
│               └── not-found.tsx
├── components/
│   ├── ui/                       # shadcn: button, card, badge, sheet, separator
│   ├── layout/                   # header, footer, section-wrapper, lang switcher
│   ├── sections/                 # hero, featured, skills, cta, animated-bg
│   ├── projects/                 # cards, grid, filter, detail, gallery, sidebar
│   └── motion/                   # scroll-reveal, stagger, parallax, fade-in
├── config/
│   ├── site.ts                   # Perfil bilingüe + SEO keywords + social
│   └── skills.ts                 # Categorías skills (home)
├── content/
│   ├── site.json, about.json, skills.json
│   ├── registries/tags.json
│   └── projects/
│       ├── README.md             # Guía autores
│       ├── schema.ts             # Re-export Zod (no canonical)
│       ├── *.json
│       └── *.mdx
├── docs/                         # Esta documentación
├── hooks/
│   ├── use-reduced-motion.ts     # Usado
│   └── use-section-spy.ts        # Scroll spy detalle proyecto
├── i18n/
│   ├── routing.ts                # locales, defaultLocale, prefix
│   └── request.ts                # Plugin next-intl: carga messages
├── lib/
│   ├── content/
│   │   ├── project-schema.ts     # CANONICAL Zod schema
│   │   ├── projects.ts           # FS loader
│   │   └── resolve-project.ts    # Locale flattening
│   ├── i18n/localized.ts         # pickLocalized helpers
│   ├── mdx/compile-mdx.tsx       # next-mdx-remote RSC
│   ├── animations/               # Framer variants
│   └── utils.ts                  # cn, formatDate(date, locale)
├── messages/
│   ├── es.json
│   └── en.json
├── middleware.ts
├── navigation.ts                 # createNavigation(routing)
├── public/
│   └── images/projects/{slug}/   # cover.svg, gallery-*.svg
├── types/project.ts              # Resolved Project type
├── next.config.ts
├── package.json
├── tsconfig.json
├── components.json               # shadcn config
└── README.md                     # Guía operativa corta
```

## 2.2 Reglas de ubicación (para CMS)

| Tipo de dato | Ubicación canónica | ¿Mover a JSON? (recomendado) |
|--------------|-------------------|------------------------------|
| UI labels | `messages/` | Ya JSON ✓ |
| Proyectos | `content/projects/` | Ya JSON/MDX ✓ |
| Perfil sitio | `config/site.ts` | → `content/site.json` |
| About | `content/about.ts` | → `content/about.json` |
| Skills | `config/skills.ts` | → `content/skills.json` |
| Tema | `app/globals.css` | → `content/theme.json` + codegen |
| Navegación | Hardcoded en `site-header.tsx` | → messages o site config |

## 2.3 Archivos que NO debe tocar un editor de contenido

- `app/`, `components/`, `lib/`, `middleware.ts`, `navigation.ts`, `i18n/`
- `package.json`, lockfiles, configs ESLint/TS
- `next.config.ts` (salvo dominio imágenes remotas futuras)

## 2.4 Archivos ignorados por el loader de proyectos

En `content/projects/`:

| Archivo | Motivo |
|---------|--------|
| `README.md` | No es `.json` ni `.mdx` |
| `schema.ts` | Documentación / re-export |

Cualquier otro archivo sin esas extensiones es **ignorado silenciosamente**.
