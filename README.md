# Embedded Systems Portfolio

Production-grade Next.js portfolio for firmware, robotics, and electronics engineers. Dark, premium UI with JSON-first project management.

## Tech stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS v4** + shadcn/ui patterns
- **Framer Motion** for scroll and hover animations
- **Zod** content validation
- **MDX** (optional) via `next-mdx-remote`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Add a new project

1. Create `content/projects/your-project.json` (see [content/projects/README.md](content/projects/README.md))
2. Add images to `public/images/projects/your-project/`
3. Optional: set `"featured": true` for the homepage

No code changes required — routes and listings update automatically.

## Customize branding

Edit [`config/site.ts`](config/site.ts):

- `name`, `title`, `description`, `email`
- `nav` links
- `social` URLs

Set production URL:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## Customize theme

Edit CSS variables in [`app/globals.css`](app/globals.css):

- `--primary` — accent color (cyan by default)
- `--background`, `--card`, `--border` — surfaces

Skills on the homepage: [`config/skills.ts`](config/skills.ts).

## Add a homepage section

1. Create `components/sections/your-section.tsx`
2. Import it in [`app/page.tsx`](app/page.tsx)

Use `SectionWrapper`, `ScrollReveal`, and `StaggerChildren` for consistent layout and motion.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | TypeScript check |

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variable: `NEXT_PUBLIC_SITE_URL` = your production URL
5. Deploy

Zero custom build configuration required.

## Project structure

```
app/              # Routes (home, projects, about, contact)
components/       # UI, layout, sections, motion, projects
content/projects/ # JSON / MDX project files
config/           # Site + skills config
lib/content/      # Schema + project loader
public/images/    # Static assets
```

## License

Private portfolio — customize freely for personal use.
