# Editable Parameters Catalog

Catálogo exhaustivo de **cada valor editable**, dónde vive, cómo fluye, efectos secundarios, y cómo debería editarlo un CMS futuro.

---

## UI Messages (`messages/`)

| Key path | ES file | EN file | Usado en | CMS field ID sugerido |
|----------|---------|---------|----------|------------------------|
| `nav.home` | ✓ | ✓ | SiteHeader | `ui.nav.home` |
| `nav.projects` | ✓ | ✓ | SiteHeader | `ui.nav.projects` |
| `nav.about` | ✓ | ✓ | SiteHeader | `ui.nav.about` |
| `nav.contact` | ✓ | ✓ | SiteHeader | `ui.nav.contact` |
| `nav.getInTouch` | ✓ | ✓ | Header CTA | `ui.nav.getInTouch` |
| `nav.embeddedTag` | ✓ | ✓ | Header logo suffix | `ui.nav.embeddedTag` |
| `nav.menu` | ✓ | ✓ | Mobile sheet title | `ui.nav.menu` |
| `hero.eyebrow` | ✓ | ✓ | Hero | `ui.hero.eyebrow` |
| `hero.viewProjects` | ✓ | ✓ | Hero CTA | `ui.hero.viewProjects` |
| `hero.aboutMe` | ✓ | ✓ | Hero CTA secondary | `ui.hero.aboutMe` |
| `featured.*` | ✓ | ✓ | FeaturedProjects | `ui.featured.*` |
| `skills.*` | ✓ | ✓ | SkillsMarquee | `ui.skills.*` |
| `cta.*` | ✓ | ✓ | CtaStrip | `ui.cta.*` |
| `projects.*` | ✓ | ✓ | Projects pages | `ui.projects.*` |
| `status.*` | ✓ | ✓ | Cards, sidebar | `ui.status.*` |
| `projectDetail.*` | ✓ | ✓ | Detail sections | `ui.projectDetail.*` |
| `about.*` | ✓ | ✓ | About page | `ui.about.*` |
| `contact.*` | ✓ | ✓ | Contact page | `ui.contact.*` |
| `footer.builtWith` | ✓ | ✓ | Footer | `ui.footer.builtWith` |
| `meta.*` | ✓ | ✓ | **NO USADO** | eliminar o wire |

**Propagación:** `next-intl` carga JSON por locale → `t('key')` en componentes.

**Side effects:** clave faltante en un locale → runtime error / missing message.

**CMS:** editor de pares clave-valor con namespace tree; CI diff ES vs EN.

---

## Site profile (`content/site.json`)

| Field | Bilingual | Consumido por | CMS ID |
|-------|-----------|---------------|--------|
| `name` | Yes | Hero H1, header logo, metadata, about meta | `site.name` |
| `title` | Yes | Hero subtitle, footer, metadata | `site.title` |
| `description` | Yes | Hero paragraph, footer, layout SEO | `site.description` |
| `author` | Yes | Footer copyright, metadata authors | `site.author` |
| `email` | No | Contact mailto | `site.email` |
| `url` | No (env) | metadataBase, sitemap | `site.url` (env) |
| `social.github` | No | Footer, contact | `site.social.github` |
| `social.linkedin` | No | Footer, contact | `site.social.linkedin` |
| `keywords` | Per locale fn | layout metadata | `site.keywords` |

**Nota:** Hero usa `site.description`, **no** `messages.hero` body.

**Deuda:** nombre ES "Paternó" vs EN "Paterno" — decisión editorial o typo.

**CMS:** formulario perfil con tabs ES/EN; email/social globales.

---

## Skills (`config/skills.ts`)

| Field | Bilingual | CMS ID |
|-------|-----------|--------|
| `name` (per category) | Yes | `skills.categories[].name` |
| `skills[]` | No (tech English) | `skills.categories[].skills` |

**Consumido por:** `SkillsMarquee` en home.

**CMS:** reorder categories, edit skill strings (shared both locales).

---

## About (`content/about.json`)

| Entity | Fields | Bilingual fields | CMS ID |
|--------|--------|------------------|--------|
| Timeline entry | year, role, org, detail | role, org, detail | `about.timeline[]` |
| Value | title, body | title, body | `about.values[]` |

**year:** string único — **no** bilingüe (`"2024 — Presente"` en ambos locales).

**Consumido por:** `app/[locale]/about/page.tsx` + `messages.about.intro` para párrafo intro.

---

## Projects (`content/projects/*`)

Ver [04-projects-system.md](./04-projects-system.md) y schema JSON.

| Field | CMS editable | Side effects |
|-------|--------------|--------------|
| `title` | ✓ | SEO title, H1, cards |
| `shortDescription` | ✓ | Cards, meta description |
| `description` | ✓ | Overview section |
| `tags` | ✓ | Filters (per locale!), detail header |
| `technologies` | ✓ | Badges (both locales same) |
| `coverImage` | ✓ | Card, hero, OG |
| `galleryImages` | ✓ | Gallery section |
| `featured` | ✓ | Home visibility |
| `date` | ✓ | Sort order |
| `status` | ✓ | Badge label via messages |
| `markdownContent` | ✓ | Write-up MDX |
| `technicalDetails` | ✓ | Spec table |
| `metrics` | ✓ | Metrics grid |
| `githubUrl` / `demoUrl` / `videoUrl` | ✓ | Sidebar / iframe |

**Slug rename:** requiere renombrar archivo + carpeta imágenes + actualizar links externos.

---

## Theme (`app/globals.css`)

| Token | CMS (futuro) |
|-------|--------------|
| `--primary`, `--background`, etc. | `theme.colors.*` |

**Side effect:** cambio global instantáneo en todo el sitio.

---

## Navigation items

**Hoy:** hardcoded array en `site-header.tsx`:

```typescript
const navHrefs = [
  { key: "home", href: "/" },
  { key: "projects", href: "/projects" },
  ...
];
```

**CMS futuro:** `site.navigation[]` con `{ labelKey, href, enabled }`.

---

## Environment

| Var | Editable en Vercel | Effect |
|-----|-------------------|--------|
| `NEXT_PUBLIC_SITE_URL` | ✓ | All absolute URLs SEO |

---

## Centralización recomendada (resumen)

| Hoy disperso | Centralizar en |
|--------------|----------------|
| site + meta messages | `content/site.json` |
| about TS | `content/about.json` |
| skills TS | `content/skills.json` |
| tags bilingües inconsistentes | `content/registries/tags.json` |
| technologies repetidas | `content/registries/technologies.json` |
