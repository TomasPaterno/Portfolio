# 6. Theme System & 7. Animation System

## 6. Theme system

### 6.1 Ubicación

| Archivo | Rol |
|---------|-----|
| `app/globals.css` | Tokens CSS, utilities, prose |
| `components.json` | shadcn: new-york, zinc, cssVariables |
| `app/layout.tsx` | `className="dark"` en html |
| `components/ui/*` | Consumen variables shadcn |

### 6.2 Tokens principales (`:root`)

| Variable | Uso | Valor aproximado |
|----------|-----|------------------|
| `--background` | Fondo página | HSL 240 6% 6% |
| `--foreground` | Texto | casi blanco |
| `--primary` | Acento cyan | HSL 199 89% 48% |
| `--card`, `--secondary`, `--muted` | Superficies | grises azulados |
| `--border`, `--ring` | Bordes, focus | |
| `--radius` | Border radius base | 0.75rem |

Tailwind v4 mapea via `@theme inline { --color-primary: hsl(var(--primary)); ... }`.

### 6.3 Utilities custom

| Class | Efecto |
|-------|--------|
| `text-gradient` | Gradiente texto neutro |
| `text-gradient-accent` | Gradiente a primary |
| `glass-panel` | blur + borde semitransparente |
| `grid-fade` | Grid ingeniería con mask radial |
| `glow-hover` | Sombra primary en hover |
| `section-padding` | py-24 / md:py-32 |
| `prose-engineering` | Typography plugin overrides |

### 6.4 CMS theme editing (futuro)

Propuesta `content/theme.json`:

```json
{
  "colors": {
    "primary": "199 89% 48%",
    "background": "240 6% 6%"
  },
  "radius": "0.75rem",
  "darkMode": true
}
```

Build step genera fragmento CSS o setea variables en layout.

**Hoy:** editar `globals.css` manualmente.

---

## 7. Animation system

### 7.1 Librería

**framer-motion** en componentes client marcados `"use client"`.

### 7.2 Variants centralizados

**Archivo:** `lib/animations/variants.ts`

| Export | Uso |
|--------|-----|
| `fadeIn` | opacidad |
| `fadeInUp` | opacidad + translateY |
| `staggerContainer` / `staggerItem` | listas |
| `scaleOnHover` | ProjectCard |
| `parallaxY` | **no usado** |

**Archivo:** `lib/animations/transitions.ts` — `viewportOnce`, easings.

### 7.3 Componentes motion

| Componente | Comportamiento |
|------------|----------------|
| `ScrollReveal` | whileInView once, fadeInUp |
| `FadeIn` | fade simple |
| `StaggerChildren` | stagger grid; si child es array, wrap each |
| `Parallax` | scroll-linked Y en AnimatedBackground |

### 7.4 Reduced motion

`hooks/use-reduced-motion.ts` escucha `prefers-reduced-motion: reduce` y desactiva animaciones (render estático).

### 7.5 Secciones animadas

| Sección | Animación |
|---------|-----------|
| Hero | stagger + fadeInUp (o estático si reduced) |
| AnimatedBackground | gradientes CSS + parallax grid + orbes motion |
| Featured / Skills | ScrollReveal + StaggerChildren |
| Project cards | scale 1.02 hover |

### 7.6 CMS implications

Animaciones **no son content-driven**. Toggle futuro podría ser site flag:

```json
{ "motion": { "enabled": true, "intensity": "subtle" } }
```

Requiere pasar prop desde layout o context — no implementado.
