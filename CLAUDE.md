# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at http://localhost:3000
npm run build     # production build
npm run lint      # ESLint via next lint
```

**Screenshot workflow** (Puppeteer must be installed; server must be running):
```bash
node screenshot.mjs http://localhost:3000
node screenshot.mjs http://localhost:3000 label   # saves as screenshot-N-label.png
```
Screenshots land in `./temporary screenshots/`. Read the PNG directly with the Read tool to analyze it.

**Environment variable required:**
```
RESEND_API_KEY=...   # contact form will fail without it
```

---

## Architecture

### Dual-nav system
Two separate navs co-exist — understanding which is active is critical:

- **Animated nav** (`app/page.tsx` `<nav id="nav">`) — used only on `/`. Starts at `opacity:0`, animated in by GSAP on mount. Goes solid (`nav--solid` class) after 50px scroll.
- **StaticNav** (`components/StaticNav.tsx`) — rendered via `layout.tsx` for every route. Returns `null` when `pathname === '/'` to avoid conflict with the animated nav.

### GSAP / Lenis scroll engine (`app/page.tsx` + `components/SmoothScrolling.tsx`)
The home page has a sticky-hero expand animation driven by GSAP ScrollTrigger. Several DOM IDs are **required** by the engine and must not be removed or renamed:

| ID | Role |
|---|---|
| `#heroWrap` | sticky hero container; GSAP exits it on scroll past next section |
| `#mediaCard` | the image card that expands to fullscreen |
| `#imgOverlay` | overlay that fades in at fullscreen |
| `#wallText` | text shown when hero is fullscreen |
| `#eyebrow`, `#title`, `#ctas` | dissolve out during expand |
| `#scrollCue` | fades out as user scrolls |
| `#nextSection` | scroll trigger point for hero exit tween |

**Lenis** (`@studio-freight/lenis`) is initialized in `SmoothScrolling.tsx` and driven by GSAP's ticker to keep them frame-perfect. Access it in any client component via `useLenis()`. Programmatic scrolls: `lenis.scrollTo('#id', { duration, easing })`.

`SmoothScrolling` wraps `{children}` and `<Footer />` inside `layout.tsx`; it is the scroll container for the entire site.

### Inner-page hero pattern
All inner pages (`/portfolio`, `/valuta-casa`, `/blog`, etc.) share `.inner-hero` CSS with GSAP entrance animations targeting `.inner-hero-eyebrow`, `.inner-hero-title`, `.inner-hero-subtitle`. Replicate this pattern for new inner pages.

### Contact form (`app/api/valutazione/route.ts`)
Server-side Route Handler using **Resend** (`resend` package). Flow:
1. `app/valuta-casa/page.tsx` — client form with controlled state → `POST /api/valutazione`
2. Route handler validates fields (required: `nome`, `email`, `telefono`, `indirizzo`; optional: `note`), builds an HTML email, sends via Resend.
3. `from`, `to`, and `replyTo` addresses must be updated per project. XSS escaping is handled by the `esc()` helper.

**Do not modify the validation or `esc()` logic** — they are the template's hardened base.

### Portfolio data layer (`app/portfolio/data.ts`)
`fetchAnnunci(tipologia?)` currently returns mock data. The file contains commented-out code for switching to the Immobiliare.it API. The `Annuncio` interface (defined in `components/PropertyCard.tsx`) is the shared data contract — update it there if the data shape changes.

### Styling
- **Tailwind v4** — CSS-first config via `@import "tailwindcss"` in `app/globals.css`. No `tailwind.config.js`.
- **CSS variables** defined in `:root` in `globals.css` are the design tokens. Component-level CSS is also in `globals.css` organized by section.
- **AVIF/WebP** is active via `next.config.ts` `images.formats`. Do not remove it.
- Hero images use `getImageProps` (called at module level in `page.tsx`) to generate the `srcSet` for the `<picture>` element manually — this is intentional for the GSAP-controlled media card.

### Fonts
Loaded via `next/font/google` in `app/layout.tsx`, exposed as CSS variables `--font-cormorant` (serif/display) and `--font-dm-sans` (body sans). Replace both per project; update the `body { font-family }` declaration in `globals.css` accordingly.

### Path alias
`@/*` maps to the repo root, so `import { useLenis } from '@/components/SmoothScrolling'` works from any file depth.
