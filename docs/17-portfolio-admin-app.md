# 17 — PortfolioAdminApp (editor local)

App Next.js separada que edita los archivos de este repositorio por filesystem. No sustituye git/deploy en producción.

## Arranque

Terminal A (sitio público):

```bash
cd Portfolio
npm run dev
```

Terminal B (admin):

```bash
cd PortfolioAdminApp
npm install
npm run dev
```

| URL | App |
|-----|-----|
| http://localhost:3000/es | Portfolio |
| http://localhost:3001 | PortfolioAdminApp |

## Variables de entorno

**PortfolioAdminApp** (`.env.local` opcional):

| Variable | Default | Uso |
|----------|---------|-----|
| `PORTFOLIO_ROOT` | `../Portfolio` | Raíz del repo del sitio |
| `PORTFOLIO_PREVIEW_URL` | `http://localhost:3000` | Base para revalidar preview |
| `ADMIN_REVALIDATE_SECRET` | — | Header `x-admin-revalidate-secret` si Portfolio lo exige |

**Portfolio** (opcional en producción):

| Variable | Uso |
|----------|-----|
| `ADMIN_REVALIDATE_SECRET` | Si está definido, `POST /api/admin/revalidate` exige el header. En `development` sin secret, el endpoint acepta peticiones locales. |

## Qué escribe cada sección

Ver [12-editable-parameters-catalog.md](./12-editable-parameters-catalog.md). Resumen:

| Admin | Archivos |
|-------|----------|
| Proyectos | `content/projects/*.{json,mdx}` |
| Imágenes | `public/images/projects/{slug}/` |
| Site | `content/site.json` |
| About | `content/about.json` |
| Skills | `content/skills.json` |
| Tags | `content/registries/tags.json` |
| Mensajes | `messages/es.json`, `messages/en.json` |

## Caché y preview en desarrollo

El Portfolio cacheaba contenido en memoria (`unstable_cache` para proyectos; caché de módulo en site/skills/about; `import()` de mensajes). Eso hacía que la preview no reflejara guardados del admin.

**Comportamiento actual:**

1. En `NODE_ENV=development`, los loaders leen del disco en cada request (sin caché persistente).
2. Tras cada guardado, el admin llama `POST {PORTFOLIO_PREVIEW_URL}/api/admin/revalidate`, que limpia cachés y ejecuta `revalidateTag("projects")` + `revalidatePath` de rutas clave.

Si la preview no actualiza: comprobar que Portfolio dev está en marcha en el puerto configurado.

## Validación

```bash
# Desde PortfolioAdminApp (round-trip en disco, restaura al final)
npm run verify:content

# Desde Portfolio (reglas de build)
npm run validate:content
```

Desde la UI admin: botón **Validar ahora** → ejecuta `validate:content` en `PORTFOLIO_ROOT`.

## Reglas de proyectos

- **Slug canónico:** nombre del archivo sin extensión (`mi-proyecto.json` → slug `mi-proyecto`). No usar campo `slug` distinto en el JSON; el admin lo rechaza al guardar.
- **Proyectos nuevos:** siempre `.json` con plantilla bilingüe.
- **MDX existentes:** se reescribe solo frontmatter (body vacío); `markdownContent` bilingüe obligatorio.

## Producción

El admin es para uso local. Cambios en Vercel requieren commit + deploy. Rutas de proyectos nuevos dependen de `generateStaticParams` en build.
