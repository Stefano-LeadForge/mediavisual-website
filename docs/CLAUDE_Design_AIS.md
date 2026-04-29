# CLAUDE_Design_AIS.md — Frontend UI/UX Pro Max Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

---

## Stack
- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 (CSS-first config via `@import "tailwindcss"` in `globals.css`)
- **Animation:** Framer Motion — always import from `"framer-motion"`
- **Entry point:** `app/page.tsx` — all top-level design lives here
- All interactive/animated components must be `"use client"`

---

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Use placeholder content (`https://placehold.co/`). Do not improvise or add to the design.
- If no reference: design from scratch with maximum craft (see guardrails below).
- Screenshot → compare → fix → re-screenshot. Minimum 2 rounds. Stop only when no visible diff remains or user says so.

---

## Local Dev Server
- Start: `npm run dev` — serves at `http://localhost:3000`
- Always screenshot from `localhost:3000`, never from `file:///`
- If server is already running, do not start a second instance.

---

## Screenshot Workflow
- Puppeteer is installed in `node_modules` (`screenshot.mjs` in project root).
- `node screenshot.mjs http://localhost:3000` → saves to `./temporary screenshots/screenshot-N.png`
- Optional label: `node screenshot.mjs http://localhost:3000 label` → `screenshot-N-label.png`
- After screenshotting, read the PNG with the Read tool and analyze it directly.
- Be specific when comparing: "heading is 32px but reference shows ~24px", "gap is 16px but should be 24px"
- Check: spacing, font size/weight/line-height, exact hex colors, alignment, border-radius, shadows, image sizing.

---

## Brand Assets
- Always check `brand_assets/` before designing.
- If a logo exists, use it. If a palette is defined, use those exact values — never invent brand colors.
- Use `next/image` for all images in `brand_assets/` or project assets.

---

## Animation Rules (Framer Motion)
- Only animate `transform` (x, y, scale, rotate) and `opacity`. Never animate layout properties.
- Never use `transition-all` in Tailwind — use specific transition utilities or Framer Motion.
- Use spring-style easing: `[0.22, 1, 0.36, 1]` for entrances, `[0.4, 0, 0.2, 1]` for exits.
- Stagger children with `staggerChildren` in `variants` — never hardcode individual delays.
- Use `useInView` + `whileInView` for scroll-triggered animations. Set `once: true`.
- Page-level transitions: wrap content in `<motion.main>` with `initial/animate/exit`.
- `LayoutGroup` for shared layout animations between list items or tabs.
- Never animate more than 3 properties on the same element simultaneously.

```tsx
// Canonical entrance variant
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
```

---

## Typography Pro Max
- Never use the same font for headings and body. Pair: display/serif + clean sans.
- Load fonts via `next/font/google` in `layout.tsx` — never via CDN `<link>`.
- Large headings: `tracking-tight` (`-0.03em`), `font-feature-settings: "ss01", "cv01"`.
- Body: `leading-[1.7]`, `text-base` or `text-lg`.
- Scale: use a strict type scale — `text-sm`, `text-base`, `text-lg`, `text-2xl`, `text-4xl`, `text-6xl`. Skip steps only intentionally.
- Avoid `font-bold` everywhere — use weight contrast (`font-light` heading + `font-medium` body) for elegance.

```tsx
// In app/layout.tsx — sostituire con i font scelti per il progetto:
// MAIN_SERIF_FONT → font display/serif per heading (es. Cormorant_Garamond, Playfair_Display, Lora)
// MAIN_SANS_FONT  → font sans-serif per body      (es. DM_Sans, Inter, Geist, Plus_Jakarta_Sans)
import { MAIN_SERIF_FONT, MAIN_SANS_FONT } from 'next/font/google';

const serifFont = MAIN_SERIF_FONT({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const sansFont  = MAIN_SANS_FONT({ subsets: ['latin'], variable: '--font-sans',  display: 'swap' });
```

---

## Color Pro Max
- Never use default Tailwind palette (indigo-500, blue-600, sky-400, etc.) as primary.
- Define a custom palette in `globals.css` using CSS variables:

```css
@layer base {
  :root {
    /* ── Sostituire con la palette del progetto ── */
    --color-primary:    PRIMARY_COLOR;    /* colore principale del brand         */
    --color-secondary:  SECONDARY_COLOR;  /* variante scura/chiara del primario  */
    --color-accent:     ACCENT_COLOR;     /* colore di accento/CTA               */
    --color-surface:    SURFACE_COLOR;    /* sfondo delle card/sezioni           */
    --color-text:       TEXT_COLOR;       /* colore base del testo               */
    --color-text-muted: TEXT_MUTED_COLOR; /* testo secondario/didascalie         */
  }
}
```

- Then use arbitrary values `bg-[var(--color-brand)]` or extend Tailwind v4 theme inline.
- Dark mode: use `@media (prefers-color-scheme: dark)` block in `:root` — not class-based unless explicitly requested.

---

## Shadows & Depth Pro Max
- Never use flat `shadow-md` or `shadow-lg` alone.
- Use layered shadows with color tint and low opacity:

```tsx
// Example: card shadow
style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04), 0 16px 48px -8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)" }}
```

- Surface layering system — every design must have 3 z-planes:
  - `base`: page background
  - `elevated`: cards, panels (subtle shadow + slight background shift)
  - `floating`: modals, tooltips, dropdowns (strong shadow, higher contrast bg)

---

## Gradients & Texture Pro Max
- Layer multiple `radial-gradient`s for depth — not a single linear.
- Add grain/noise texture via an SVG filter or a `before:` pseudo-element for organic feel.
- Gradient overlays on images: `bg-gradient-to-t from-black/60 to-transparent`.
- Color treatment layer on images: `mix-blend-multiply` with brand color tint.

---

## Spacing System
- Use intentional spacing tokens — not random Tailwind steps.
- Component internal padding: `p-4` (16px) or `p-6` (24px). Never `p-3` or `p-5` unless intentional.
- Section vertical rhythm: `py-16`, `py-24`, `py-32`. Be consistent.
- Grid gaps: `gap-4`, `gap-6`, `gap-8`. Avoid `gap-5`, `gap-7`.
- Max content width: `max-w-5xl` or `max-w-6xl` centered with `mx-auto px-4 sm:px-6 lg:px-8`.

---

## Interactive States Pro Max
- Every clickable element must have `hover:`, `focus-visible:`, and `active:` states. No exceptions.
- Focus rings: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2`.
- Hover on cards: combine scale + shadow lift with Framer Motion `whileHover`.
- Buttons: never just change color on hover — also shift shadow and subtle scale (`scale-[1.02]`).

---

## Next.js Specific Rules
- Use `next/image` for all images — set explicit `width` and `height` or `fill` with a relative parent.
- Use `next/link` for all internal navigation — never `<a href>`.
- Server components by default. Add `"use client"` only for components with state, effects, or Framer Motion.
- Never fetch data in `page.tsx` directly if it can be a server component — separate concerns.
- `metadata` export in every `page.tsx` and `layout.tsx` — always set `title` and `description`.

---

## Anti-Generic Guardrails
- **Colors:** Custom palette only — no default Tailwind colors as primary.
- **Shadows:** Layered, color-tinted, never flat.
- **Typography:** Two-font pairing, strict scale, weight contrast.
- **Gradients:** Multi-radial, add grain/texture for depth.
- **Animations:** `transform` + `opacity` only, spring easing, staggered.
- **Interactive:** hover + focus-visible + active on every interactive element.
- **Images:** Gradient overlay + color treatment layer.
- **Spacing:** Consistent tokens — no random steps.
- **Depth:** 3-plane layering system on every design.

---

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo/sky as primary color
- Do not use `<a href>` for internal links — always `next/link`
- Do not use `<img>` — always `next/image`
- Do not add `"use client"` to components that don't need it
- Do not import fonts via CDN — use `next/font`
