# 21–25. Scalability, Debt, Refactors, Security, Performance

## 21. Scalability analysis

### Escala bien hoy

- Decenas de proyectos (FS read en build es OK),
- 2 locales,
- Tráfico portfolio típico (SSG + CDN).

### Cuellos de botella futuros

| Área | Límite | Mitigación |
|------|--------|------------|
| Proyectos | ~100+ archivos | Index + cache + DB |
| MDX compile | CPU build time | Precompile en CMS o ISR |
| messages JSON | ~500 keys | Split namespaces / lazy |
| Tags filter | inconsistent ES/EN | Tag registry |
| Blog posts | no existe | Nuevo content type |

### Horizontal growth paths

1. **Blog** → `content/posts/{slug}.json` mismo pipeline.
2. **Case studies PDF** → asset links en project schema.
3. **Multi-region** → ya en Vercel edge; content sigue global.
4. **SaaS portfolios** → multi-tenant DB (otro producto).

---

## 22. Technical debt — **Resuelto (2026-05)**

| ID | Issue | Solución |
|----|-------|----------|
| D1 | `getProjectBySlug` re-parsea todos | `unstable_cache` + `Map` en `lib/content/projects.ts` |
| D2 | `messages.meta` duplicado | Eliminado; perfil en `content/site.json` |
| D3 | Tags distintos ES/EN | `content/registries/tags.json` + `tagIds` |
| D4 | `formatDate` no localizado | `formatDate(date, locale)` → `es-AR` / `en-US` |
| D5 | Sin validación imágenes | `scripts/validate-content.ts` + pre-build |
| D6 | About/Skills en TS | `content/about.json`, `content/skills.json` |
| D7 | Nav hardcoded | `navigation[]` en `site.json` |
| D8 | `siteConfig` deprecated en robots | `getSiteConfig(routing.defaultLocale)` |
| D9 | Sitemap lastModified | `updatedAt` opcional en proyectos |
| D10 | MDX body duplicado | Solo `markdownContent`; validación falla si hay body |
| D11 | Unused Radix deps | Removidos tooltip, navigation-menu, scroll-area |
| D12 | Código muerto | Eliminados `use-scroll-progress`, `slugify`, `parallaxY` |
| D13 | `Project.isMdx` | Eliminado del tipo y pipeline |
| D14 | Scroll spy | `useSectionSpy` + `ProjectDetailShell` |
| D15 | Labels contacto | `messages/contact.github` / `linkedin` |

**Nota middleware:** el `matcher` debe ser literal `(es|en)` por restricción de Next.js; mantener sincronizado con `i18n/routing.ts` al agregar locales.

---

## 23. Recommended refactors

### Fase 1 — CMS-ready content (sin API aún)

1. Migrar `config/site.ts` → `content/site.json` + loader.
2. Migrar `content/about.ts` → `content/about.json`.
3. Migrar `config/skills.ts` → `content/skills.json`.
4. Eliminar `messages.meta` o conectar a site loader.
5. Agregar `scripts/validate-content.ts` en CI.

### Fase 2 — Performance

```typescript
// lib/content/projects.ts
const cache = unstable_cache(
  async (locale) => loadAllProjectsUncached(locale),
  ["projects"],
  { tags: ["projects"] }
);

export async function getProjectBySlug(slug, locale) {
  const map = await getProjectsMap(locale);
  return map.get(slug) ?? null;
}
```

### Fase 3 — Normalización

**`content/registries/tags.json`:**

```json
{
  "aerospace": { "es": "aeroespacial", "en": "aerospace" },
  "control-systems": { "es": "control", "en": "control-systems" }
}
```

**Project:**

```json
"tagIds": ["aerospace", "control-systems", "stm32"]
```

**technologies registry** similar (STM32 aparece en muchos proyectos).

### Fase 4 — i18n quality

- `formatDate(date, locale)` usando `Intl` con `es-AR` / `en-US`.
- Timeline `year` bilingüe.
- `LocaleHtmlLang` → server-set `lang` en layout.

### Fase 5 — SEO

- JSON-LD Person + CreativeWork per project.
- `lastModified` from git or frontmatter `updatedAt`.
- Optional `seo` block in project schema.

---

## 24. Security considerations

| Vector | Estado | Recomendación |
|--------|--------|---------------|
| Admin API | No existe | Secret header, RBAC, audit log |
| MDX XSS | GFM only, no raw HTML by default | Sanitize if CMS allows HTML |
| SVG upload | Allowed in next/image | Restrict CMS uploads to raster or sanitize SVG |
| Env leak | `NEXT_PUBLIC_*` only public vars | Never put secrets in NEXT_PUBLIC |
| Dependency | npm audit moderate | Track Dependabot |
| Contact form | mailto only | Si Formspree, CAPTCHA |
| Git write token | N/A | Scoped repo permissions for CMS bot |

**Principio:** el sitio público es **read-only**; todo write pasa por CMS/backend autenticado.

---

## 25. Performance considerations

| Métrica | Estado | Nota |
|---------|--------|------|
| LCP | Hero + cover images | `priority` en hero/cards |
| CLS | next/image fill | definir sizes |
| JS bundle | Client islands moderados | Revisar framer-motion tree-shake |
| Font | next/font Geist | display swap default |
| SSG | Mayoría rutas | Bueno para portfolio |
| Middleware | Pequeño overhead | next-intl en edge |

**Lighthouse targets:** mantener imágenes WebP en producción; reducir motion si `prefers-reduced-motion` (ya implementado).

**Vercel:** Image Optimization CDN para raster; SVG served as-is.

---

## Normalization analysis summary

| Entity | Duplicated today? | Proposal |
|--------|-------------------|----------|
| Technologies | Same strings copy-pasted | Registry + IDs |
| Tags | Different per locale | Registry + IDs |
| Site description | site.ts + messages.meta | Single site.json |
| Keywords | site fn + messages.meta | site.json only |
| Social URLs | site.ts only | OK centralized |
| Project slugs | filename | OK |
| Cover paths | per project | OK; validate exists |
| Status labels | enum + messages | OK pattern |
| Nav labels | messages only | OK; hrefs hardcoded |

---

## Efficiency verdict (editing system)

| Criterio | Score | Comentario |
|----------|-------|------------|
| Agregar proyecto JSON bilingüe | **Alto** | Mejor parte del sistema |
| Editar UI copy | **Medio** | Doble archivo JSON manual |
| Editar perfil | **Bajo-Medio** | TS + duplicación meta |
| Consistencia traducciones | **Medio-Bajo** | 3 capas, tags split |
| Automatización CMS | **Medio** | Schema Zod listo; falta API |
| Escalar a blog | **Bajo** hoy | Replicar pattern projects |

**Conclusión:** el sistema actual es **eficiente para proyectos**, **ineficiente para el resto del contenido editable**. Los refactors de Fase 1 en [23](#23-recommended-refactors) son el camino crítico hacia un admin app sin tocar código.
