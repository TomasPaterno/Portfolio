# 3. Routing System

## 3.1 Modelo de rutas

| URL pública | Archivo | Tipo render |
|-------------|---------|-------------|
| `/` | — | Redirect → `/es` (middleware) |
| `/es` | `app/[locale]/page.tsx` | SSG |
| `/en` | idem | SSG |
| `/es/projects` | `app/[locale]/projects/page.tsx` | SSG |
| `/es/projects/{slug}` | `app/[locale]/projects/[slug]/page.tsx` | SSG (params) |
| `/es/about` | `app/[locale]/about/page.tsx` | SSG |
| `/es/contact` | `app/[locale]/contact/page.tsx` | SSG |

Patrón EN: reemplazar prefijo `/en`.

## 3.2 Configuración i18n

**Archivo:** `i18n/routing.ts`

```typescript
locales: ["es", "en"]
defaultLocale: "es"
localePrefix: "always"  // siempre /es/... y /en/...
```

## 3.3 Middleware

**Archivo:** `middleware.ts`

- Usa `createMiddleware` de `next-intl/middleware`.
- Matcher: `["/", "/(es|en)/:path*"]`.
- Efectos:
  - `/` → redirect a `/es` (o locale default),
  - rechaza locales inválidos,
  - preserva pathname al cambiar idioma (via `navigation.ts`).

**Deuda:** matcher hardcodea `(es|en)` — debe sincronizarse si se agrega un tercer locale.

## 3.4 Navegación locale-aware

**Archivo:** `navigation.ts`

Exporta: `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`.

**Regla:** nunca usar `next/link` directo para rutas internas; siempre `@/navigation` para mantener prefijo de locale.

Ejemplo:

```tsx
import { Link } from "@/navigation";
<Link href="/projects">...</Link>
// Renderiza /es/projects si locale actual es es
```

## 3.5 Language switcher

**Archivo:** `components/layout/language-switcher.tsx`

- `usePathname()` obtiene path **sin** locale.
- `Link href={pathname} locale={loc}` cambia solo el prefijo.
- No traduce slugs (no aplica — slug único).

## 3.6 generateStaticParams

| Layout/Page | Params emitidos |
|-------------|-----------------|
| `[locale]/layout.tsx` | `{ locale: "es" }`, `{ locale: "en" }` |
| `[locale]/projects/[slug]/page.tsx` | `{ locale, slug }` para cada proyecto × locale |

## 3.7 Slugs de proyecto

- **No hay** `/es/proyectos/controlador` vs `/en/projects/controller`.
- Un solo slug: `drone-flight-controller` → `/es/projects/drone-flight-controller` y `/en/projects/drone-flight-controller`.
- Título traducido viene del contenido, no de la URL.

**Implicación CMS:** el identificador estable es `slug` (filename), no el título en ningún idioma.

## 3.8 HTML `lang`

- Root `app/layout.tsx`: `lang="es"` estático.
- `LocaleHtmlLang` (client): actualiza `document.documentElement.lang` al locale activo.

**Mejora recomendada:** setear `lang` en server desde `[locale]/layout` sin depender de client effect.
