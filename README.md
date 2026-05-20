# Portfolio — Sistemas embebidos

Portfolio Next.js para ingenieros en firmware, robótica y electrónica. UI premium, contenido en **español e inglés**, proyectos vía JSON/MDX.

**Documentación técnica completa (arquitectura + CMS futuro):** [`docs/README.md`](docs/README.md)

## Idiomas

- **Por defecto:** español en `/es/...`
- **Inglés:** `/en/...`
- Selector **ES | EN** en el header (mantiene la página actual)
- Visitá `/` → redirección automática a `/es`

## Inicio rápido

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000/es](http://localhost:3000/es).

## Validar y construir

```bash
npm run validate:content   # Zod, mensajes, assets, tagIds, MDX
npm run build              # incluye validación
```

## Agregar un proyecto (bilingüe)

1. Definí tags en `content/registries/tags.json` si son nuevos
2. Creá `content/projects/tu-proyecto.json` con `tagIds`, campos `{ "es", "en" }` (ver [content/projects/README.md](content/projects/README.md))
3. Imágenes en `public/images/projects/tu-proyecto/`
4. `"featured": true` para mostrarlo en el inicio

Rutas: `/es/projects/tu-proyecto` y `/en/projects/tu-proyecto`.

## Textos de la interfaz

Editá `messages/es.json` y `messages/en.json` (mismas claves en ambos; sin namespace `meta`).

## Contenido editable (JSON)

| Archivo | Contenido |
|---------|-----------|
| `content/site.json` | Perfil, keywords, links, navegación, toggles del home |
| `content/about.json` | Intro, timeline, valores |
| `content/skills.json` | Categorías de skills |
| `content/registries/tags.json` | Labels de tags por locale |
| `content/projects/*.json` | Proyectos |

`config/site.ts` y `config/skills.ts` re-exportan loaders (compatibilidad).

```env
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
```

## Agregar una sección al inicio

1. Componente en `components/sections/`
2. Flag en `site.json` → `homeSections` y condición en `app/[locale]/page.tsx`

## Estructura

```
content/
  site.json, about.json, skills.json
  registries/tags.json
  projects/
app/[locale]/          # rutas con prefijo de idioma
messages/es.json, en.json
lib/content/           # loaders + Zod
scripts/validate-content.ts
docs/                  # arquitectura y CMS
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Desarrollo |
| `npm run validate:content` | Validación de contenido |
| `npm run build` | Validación + build producción |
| `npm run typecheck` | TypeScript |
