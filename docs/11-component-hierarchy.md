# 14. Component Hierarchy

## 14.1 Árbol global

```
RootLayout (app/layout.tsx)
└── [locale]/Layout
    ├── LocaleHtmlLang
    ├── NextIntlClientProvider
    ├── SiteHeader
    │   ├── Link × nav
    │   ├── LanguageSwitcher
    │   └── Sheet (mobile)
    ├── main
    │   └── [Page]
    └── SiteFooter
```

## 14.2 Home components

```
HomePage
├── Hero
│   └── AnimatedBackground
│       └── Parallax → grid-fade
├── FeaturedProjects
│   ├── SectionWrapper
│   ├── ScrollReveal
│   └── ProjectGrid
│       └── StaggerChildren
│           └── ProjectCard × n
├── SkillsMarquee
│   ├── SectionWrapper
│   ├── ScrollReveal
│   └── StaggerChildren → skill cards
└── CtaStrip
    └── SectionWrapper, ScrollReveal, Button
```

## 14.3 Projects list

```
ProjectsPage
└── SectionWrapper
    ├── ScrollReveal (header copy)
    └── ProjectsFilter (client)
        ├── Filter chips (status, tags)
        └── ProjectGrid → ProjectCard
```

## 14.4 Project detail

```
ProjectDetailPage
├── Back Link (navigation)
├── Cover Image block (inline page)
└── SectionWrapper
    ├── ProjectContent (server)
    │   ├── ScrollReveal sections
    │   ├── MetricsBlock
    │   ├── ProjectGallery (client)
    │   └── MDX article
    └── ProjectSidebar (client)
        ├── status, date
        ├── anchor nav
        ├── github/demo buttons
        └── TechBadges
```

## 14.5 Props / data contracts

| Component | Props | Data source |
|-----------|-------|-------------|
| `Hero` | — | `useLocale`, `getSiteConfig`, `useTranslations("hero")` |
| `FeaturedProjects` | `{ locale }` | `getFeaturedProjects(locale)` |
| `SkillsMarquee` | `{ locale }` | `getSkillCategories(locale)` |
| `ProjectCard` | `{ project, priority? }` | Resolved `Project` |
| `ProjectsFilter` | `{ projects }` | `getAllProjects` from page |
| `ProjectContent` | `{ project }` | Resolved + MDX compile |
| `ProjectSidebar` | `{ project, activeSection? }` | Resolved |
| `TechBadges` | `{ technologies, tags? }` | strings |
| `SectionWrapper` | `{ id?, narrow?, className?, children }` | layout only |

## 14.6 UI primitives (shadcn)

| Component | Variants usados |
|-----------|-----------------|
| Button | default, outline, ghost, secondary; sizes sm, lg, icon |
| Card | contact cards |
| Badge | default, outline, muted |
| Sheet | mobile nav |
| Separator | footer, sidebar |

**Instalados pero no usados en páginas:** tooltip, navigation-menu, scroll-area (deps presentes).
