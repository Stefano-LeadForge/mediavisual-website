# UI/UX Master Guide
**System instruction document — use as Claude design context for all Next Home UI work.**

> Estratto e sintetizzato da: UI/UX Pro Max v2.5.0 (nextlevelbuilder) + claudekit design-system + brand skill.
> Versione: 1.0 — 25 aprile 2026

---

## Indice

1. [Principi UI/UX Core](#1-principi-uiux-core)
2. [Design System: Token Architecture](#2-design-system-token-architecture)
3. [Tipografia Professionale](#3-tipografia-professionale)
4. [Palette Colori](#4-palette-colori)
5. [Segreti delle Animazioni — GSAP & Framer Motion](#5-segreti-delle-animazioni--gsap--framer-motion)
6. [Workflow Operativo: Tailwind CSS + GSAP/Framer Motion](#6-workflow-operativo-tailwind-css--gsapframer-motion)
7. [Checklist Pre-Consegna](#7-checklist-pre-consegna)

---

## 1. Principi UI/UX Core

### 1.1 Gerarchia Visiva

La gerarchia non si costruisce con il colore — si costruisce con **dimensione, spaziatura e contrasto**.

| Strumento | Uso corretto |
|-----------|-------------|
| Dimensione font | H1 > H2 > H3 > body — mai saltare livelli |
| Peso tipografico | Bold (700) per heading, Regular (400) per body, Medium (500) per label |
| Spaziatura | Più spazio = più importanza. Sezioni principali: `gap-16` / `gap-24` |
| Contrasto | Testo primario `slate-900 on white`; secondario `gray-500` |
| Una sola CTA primaria | Ogni schermata ha un solo bottone primario — gli altri sono secondari o ghost |

**Regola d'oro:** se rimuovi tutti i colori dal design e la gerarchia collassa, significa che stai usando il colore come stampella.

### 1.2 Spacing Scale (sistema 4dp/8dp)

Usa esclusivamente multipli di 4. Mai valori arbitrari.

```
4px  — micro: icone, badge padding, separatori
8px  — xs: gap tra elementi inline
12px — sm: padding interni piccoli
16px — md: padding standard componenti (base unit)
24px — lg: gap tra card, padding sezioni
32px — xl: spaziatura tra blocchi di contenuto
48px — 2xl: separazione tra sezioni pagina
64px — 3xl: hero padding, spaziatura macro-layout
96px — 4xl: padding verticale sezioni principali
```

In Tailwind: `p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px, `p-12` = 48px, `p-16` = 64px.

**Ritmo verticale:** usa sempre lo stesso tiers per la stessa semantica. Sezioni = `py-24`, componenti = `py-6`, elementi = `py-3`.

### 1.3 Accessibilità (CRITICA — priorità 1)

Non è opzionale. Questi sono requisiti non negoziabili.

| Regola | Standard | Valore minimo |
|--------|----------|---------------|
| Contrasto testo normale | WCAG AA | 4.5:1 |
| Contrasto testo grande (≥18px) | WCAG AA | 3:1 |
| Contrasto UI components | WCAG AA | 3:1 |
| Touch target size | Apple HIG / Material | 44×44px |
| Gap tra target touch | Material Design | 8px |
| Focus ring | Visibile, 2–4px | Sempre presente |

```css
/* Focus ring standard — non rimuovere mai */
.focusable:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px hsl(var(--background)),
    0 0 0 4px hsl(var(--ring));
}
```

**Regole imprescindibili:**
- Non trasmettere informazioni con il solo colore — aggiungi sempre icona o testo
- Gerarchia heading sequenziale: `h1 → h2 → h3`, mai saltare livelli
- `aria-label` su tutti i pulsanti icon-only
- `prefers-reduced-motion`: rispetta sempre, disabilita o riduce animazioni
- Minimo `16px` per il body text (sotto `14px` è consentito solo per caption, mai per contenuto lungo)

### 1.4 Layout & Responsive

```
Mobile-first — sempre. Parti da 375px, poi scala.

Breakpoints:
  sm:  640px  — smartphone grandi
  md:  768px  — tablet portrait
  lg: 1024px  — tablet landscape / laptop
  xl: 1280px  — desktop
 2xl: 1536px  — large desktop

max-w:
  Contenuto testo: max-w-[65ch] o max-w-prose
  Layout principale: max-w-6xl (1152px)
  Sezioni hero: max-w-7xl (1280px)
```

**Anti-pattern da evitare:**
- Scroll orizzontale su mobile
- `100vh` su mobile (usa `min-h-dvh`)
- Container con `px` fissi invece di `%` o `max-w` + `mx-auto`
- Zoom disabilitato (`user-scalable=no`)

### 1.5 Interaction States — Priorità

Quando si sovrappongono più stati, questa è la precedenza (dal più forte):

```
disabled > loading > active > focus > hover > default
```

| Stato | Durata transizione | Easing |
|-------|-------------------|--------|
| Color / background | 150ms | ease-in-out |
| Transform | 200ms | ease-out |
| Shadow | 200ms | ease-out |
| Opacity | 150ms | ease |

---

## 2. Design System: Token Architecture

### 2.1 Il Sistema a Tre Layer

```
┌──────────────────────────────────────┐
│  LAYER 3 — Component Tokens          │  Per-component override
│  --button-bg, --card-padding         │
├──────────────────────────────────────┤
│  LAYER 2 — Semantic Tokens           │  Alias per scopo/significato
│  --color-primary, --spacing-section  │
├──────────────────────────────────────┤
│  LAYER 1 — Primitive Tokens          │  Valori grezzi
│  --color-blue-600, --space-4         │
└──────────────────────────────────────┘
```

**Regola fondamentale:** mai usare hex raw nei componenti. Sempre e solo `var(--token)`.

### 2.2 Layer 1 — Primitive Tokens

```css
:root {
  /* Colors */
  --color-gray-50:  #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-500: #6B7280;
  --color-gray-900: #111827;
  --color-blue-500: #3B82F6;
  --color-blue-600: #2563EB;
  --color-blue-700: #1D4ED8;

  /* Spacing (base 4px) */
  --space-1: 0.25rem;   /* 4px  */
  --space-2: 0.5rem;    /* 8px  */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */

  /* Radius */
  --radius-sm:  0.25rem;
  --radius-md:  0.5rem;
  --radius-lg:  0.75rem;
  --radius-xl:  1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm:  0 1px 2px rgb(0 0 0 / 0.05);
  --shadow-md:  0 4px 6px rgb(0 0 0 / 0.07);
  --shadow-lg:  0 10px 15px rgb(0 0 0 / 0.1);

  /* Duration */
  --duration-fast:   150ms;
  --duration-normal: 200ms;
  --duration-slow:   300ms;
}
```

### 2.3 Layer 2 — Semantic Tokens

```css
:root {
  /* Background / Foreground */
  --color-background:  var(--color-gray-50);
  --color-foreground:  var(--color-gray-900);
  --color-surface:     #FFFFFF;

  /* Primary */
  --color-primary:           var(--color-blue-600);
  --color-primary-hover:     var(--color-blue-700);
  --color-primary-foreground: #FFFFFF;

  /* Secondary */
  --color-secondary:            var(--color-gray-100);
  --color-secondary-foreground: var(--color-gray-900);

  /* Muted */
  --color-muted:            var(--color-gray-100);
  --color-muted-foreground: var(--color-gray-500);

  /* Semantic */
  --color-success:     #22C55E;
  --color-warning:     #F59E0B;
  --color-error:       #EF4444;
  --color-info:        #3B82F6;
  --color-border:      var(--color-gray-200);
  --color-ring:        var(--color-blue-500);

  /* Spacing semantici */
  --spacing-component: var(--space-4);
  --spacing-section:   var(--space-6);
}

/* Dark mode — override solo il layer semantico */
.dark {
  --color-background:  #0F172A;
  --color-foreground:  #F8FAFC;
  --color-surface:     #1E293B;
  --color-muted:       #1E293B;
  --color-muted-foreground: #94A3B8;
  --color-border:      #334155;
}
```

### 2.4 Layer 3 — Component Tokens

```css
:root {
  /* Button */
  --button-bg:        var(--color-primary);
  --button-fg:        var(--color-primary-foreground);
  --button-hover-bg:  var(--color-primary-hover);
  --button-padding-x: var(--space-4);
  --button-padding-y: var(--space-2);
  --button-radius:    var(--radius-md);

  /* Input */
  --input-bg:         var(--color-surface);
  --input-border:     var(--color-border);
  --input-focus-ring: var(--color-ring);
  --input-radius:     var(--radius-md);

  /* Card */
  --card-bg:      var(--color-surface);
  --card-border:  var(--color-border);
  --card-padding: var(--space-6);
  --card-radius:  var(--radius-lg);
  --card-shadow:  var(--shadow-md);
}
```

### 2.5 Convention di naming

```
--{categoria}-{elemento}-{variante}-{stato}

Esempi:
  --color-primary           → categoria-elemento
  --color-primary-hover     → categoria-elemento-stato
  --button-bg-hover         → componente-proprietà-stato
  --space-section-sm        → categoria-semantica-variante
```

---

## 3. Tipografia Professionale

### 3.1 Type Scale (Major Third — ratio 1.25)

| Livello | rem | px | Peso | Line-height | Lettera |
|---------|-----|----|------|-------------|---------|
| Display | 3.815 | 61 | 700 | 1.1 | -0.02em |
| H1 | 3.052 | 49 | 700 | 1.2 | -0.02em |
| H2 | 2.441 | 39 | 600 | 1.25 | 0 |
| H3 | 1.953 | 31 | 600 | 1.3 | 0 |
| H4 | 1.563 | 25 | 600 | 1.35 | 0 |
| H5 | 1.25 | 20 | 600 | 1.4 | 0 |
| Body Large | 1.125 | 18 | 400 | 1.6 | 0 |
| Body | 1 | 16 | 400 | 1.5 | 0 |
| Small | 0.875 | 14 | 400 | 1.5 | 0 |
| Caption | 0.75 | 12 | 400 | 1.4 | 0.05em |

### 3.2 Font Pairing Consigliati

| Stile | Heading | Body | Stack |
|-------|---------|------|-------|
| Clean / Modern | Inter | Inter | Sans-sans |
| Professional | Playfair Display | Source Sans Pro | Serif-sans |
| Startup / Tech | Poppins | Open Sans | Sans-sans |
| Editorial | Merriweather | Lato | Serif-sans |
| Luxury | Cormorant Garant | Montserrat | Serif-sans |
| Corporate | DM Sans | DM Sans | Mono-sans |

### 3.3 CSS Variables Tipografici

```css
:root {
  --font-heading: 'Inter', system-ui, -apple-system, sans-serif;
  --font-body:    'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

  /* Scale */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;
  --text-4xl:  2.25rem;
  --text-5xl:  3rem;
  --text-6xl:  3.75rem;

  /* Weights */
  --font-normal:   400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;

  /* Line heights */
  --leading-tight:   1.25;
  --leading-snug:    1.375;
  --leading-normal:  1.5;
  --leading-relaxed: 1.625;
}
```

### 3.4 Regole Tipografiche Imprescindibili

- Body text: minimo `16px` su mobile (impedisce auto-zoom iOS)
- Line-length: `65–75 caratteri` per riga (`max-w-prose` o `max-w-[65ch]`)
- Mai giustificato (`text-justify`) — usa sempre `text-left`
- Non usare font-weight < 400 a dimensioni piccole
- Headings: `letter-spacing: -0.02em` per display e h1
- Tabular figures per numeri in tabelle: `font-variant-numeric: tabular-nums`

### 3.5 Tailwind Config Tipografia

```typescript
// tailwind.config.ts
theme: {
  fontFamily: {
    heading: ['Inter', 'system-ui', 'sans-serif'],
    body:    ['Inter', 'system-ui', 'sans-serif'],
    mono:    ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs:   ['0.75rem',  { lineHeight: '1rem' }],
    sm:   ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem',     { lineHeight: '1.5rem' }],
    lg:   ['1.125rem', { lineHeight: '1.75rem' }],
    xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
    '2xl':['1.5rem',   { lineHeight: '2rem' }],
    '3xl':['1.875rem', { lineHeight: '2.25rem' }],
    '4xl':['2.25rem',  { lineHeight: '2.5rem' }],
    '5xl':['3rem',     { lineHeight: '1.1' }],
    '6xl':['3.75rem',  { lineHeight: '1.1' }],
  },
}
```

---

## 4. Palette Colori

### 4.1 Struttura Palette (regola 60-30-10)

```
Primary (60%) — colore dominante: background, superfici
Secondary (30%) — colore di supporto: card, sezioni alternate
Accent (10%) — CTA, link, highlight
```

Mai più di 2–3 colori in un singolo componente.

### 4.2 Palette per Settore (Next Home = Real Estate)

**Professional / Corporate (raccomandato):**
```css
--color-brand-primary:   #1E40AF;  /* Navy     — autorevolezza, fiducia */
--color-brand-secondary: #475569;  /* Slate    — neutralità, professionalità */
--color-brand-accent:    #0EA5E9;  /* Sky      — modernità, trasparenza */
--color-brand-bg:        #F8FAFC;  /* Bianco warm */
--color-brand-text:      #0F172A;  /* Quasi-nero */
```

**Alternativa Luxury / Premium:**
```css
--color-brand-primary:   #1C1C1E;  /* Near-black — eleganza */
--color-brand-secondary: #D4AF37;  /* Gold      — lusso */
--color-brand-accent:    #FFFFFF;  /* White     — spazio */
--color-brand-bg:        #F5F5F0;  /* Warm white */
--color-brand-text:      #1C1C1E;
```

### 4.3 Colori Semantici (fissi in ogni progetto)

```css
:root {
  --color-success:             #22C55E;
  --color-success-foreground:  #FFFFFF;
  --color-warning:             #F59E0B;
  --color-warning-foreground:  #1F2937;
  --color-error:               #EF4444;
  --color-error-foreground:    #FFFFFF;
  --color-info:                #3B82F6;
  --color-info-foreground:     #FFFFFF;
}
```

### 4.4 Integrazione Tailwind con CSS Variables (formato HSL)

Il formato HSL spazio-separato permette i modificatori di opacità di Tailwind:

```css
/* globals.css */
@layer base {
  :root {
    --background:          0 0% 98%;
    --foreground:          222 47% 11%;
    --primary:             217 91% 40%;
    --primary-foreground:  0 0% 100%;
    --secondary:           215 25% 27%;
    --secondary-foreground:0 0% 98%;
    --muted:               220 14% 96%;
    --muted-foreground:    220 9% 46%;
    --border:              220 13% 91%;
    --ring:                217 91% 60%;
    --radius:              0.5rem;
  }

  .dark {
    --background:          222 47% 4%;
    --foreground:          210 40% 98%;
    --primary:             217 91% 60%;
    --primary-foreground:  0 0% 100%;
    --secondary:           217 33% 17%;
    --secondary-foreground:210 40% 98%;
    --muted:               217 33% 17%;
    --muted-foreground:    215 20% 65%;
    --border:              217 33% 17%;
    --ring:                217 91% 60%;
  }
}
```

```tsx
/* In Tailwind — grazie al formato HSL si ottengono i modificatori */
<div className="bg-primary/50">   {/* 50% opacity */}
<div className="text-primary/80"> {/* 80% opacity */}
```

### 4.5 Regole di Accessibilità Colore

| Combinazione | Ratio minimo | Note |
|-------------|-------------|------|
| Testo normale su sfondo | 4.5:1 | WCAG AA |
| Testo grande (≥18px bold, ≥24px regular) | 3:1 | WCAG AA |
| Componenti UI (border, icone) | 3:1 | WCAG AA |
| Mai usare solo colore per comunicare stato | — | Aggiungere icona o testo |

---

## 5. Segreti delle Animazioni — GSAP & Framer Motion

### 5.1 Principi Fondamentali (dalla skill UI/UX Pro Max)

**Regola #1 — Ogni animazione ha uno scopo:**
Le animazioni devono esprimere una relazione causa-effetto, non essere decorative. Se non trasmette significato, non aggiungerla.

**Regola #2 — Solo `transform` e `opacity`:**
```
✅ transform: translate, scale, rotate
✅ opacity
❌ width, height, top, left, margin, padding
```
Animare proprietà geometriche causa layout reflow e jank.

**Regola #3 — Durate:**
```
Micro-interazioni (hover, click):    150–200ms
Transizioni di stato:                200–300ms
Transizioni di pagina:               300–400ms
Animazioni complesse / hero:         ≤600ms
Mai superare:                        700ms (sembra lento)
```

**Regola #4 — Exit più veloce dell'enter:**
```
Enter duration: 300ms
Exit duration:  180–200ms (60–70% dell'enter)
```
L'uscita rapida dà la sensazione di responsività.

**Regola #5 — Stagger su liste/grid:**
```
Ritardo tra item: 30–50ms
Mai: tutti insieme (appaiono di colpo)
Mai: > 60ms per item (troppo lento)
```

### 5.2 Easing Corretto

```javascript
// Entering — ease-out (parte veloce, rallenta)
ease: "power2.out"        // GSAP
ease: [0.0, 0.0, 0.2, 1] // cubic-bezier CSS/Framer

// Exiting — ease-in (parte lenta, accelera)
ease: "power2.in"         // GSAP
ease: [0.4, 0.0, 1, 1]   // cubic-bezier CSS/Framer

// Spring — per interazioni naturali (fisica)
// Framer Motion:
transition: { type: "spring", stiffness: 260, damping: 20 }
// GSAP: usa elasticità manuale con timeline

// Linear — solo per loop decorativi (spinner, progress)
// NON usare per transizioni UI
```

### 5.3 GSAP — Best Practices Avanzate

#### Timeline: il pattern fondamentale

```javascript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Pattern base: timeline con riferimento per cleanup
const tl = gsap.timeline({
  defaults: {
    duration: 0.6,
    ease: "power2.out",
  },
});

// Stagger su elementi multipli
tl.from(".hero-title", { y: 40, opacity: 0 })
  .from(".hero-subtitle", { y: 30, opacity: 0 }, "-=0.3")  // overlap 300ms
  .from(".hero-cta", { y: 20, opacity: 0, scale: 0.95 }, "-=0.2");
```

#### ScrollTrigger — configurazione ottimale

```javascript
// Pattern ScrollTrigger performante
gsap.fromTo(
  ".section-card",
  {
    y: 60,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    duration: 0.7,
    ease: "power2.out",
    stagger: 0.08,  // 80ms tra ogni card
    scrollTrigger: {
      trigger: ".cards-wrapper",
      start: "top 80%",    // inizia quando il top dell'elemento è all'80% del viewport
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      // "play none none reverse" = play on enter, reverse on leave-back
      // toggleActions: "onEnter onLeave onEnterBack onLeaveBack"
    },
  }
);
```

#### ScrollTrigger — opzioni `toggleActions`

```
"play none none none"    → play solo all'entrata, non si resetta
"play pause resume reset"→ pausa quando esce, riprende se rientra
"play none none reverse" → play in avanti, reverse tornando indietro ✅ consigliato
"restart none none reset"→ riparte ogni volta che si entra
```

#### Cleanup obbligatorio in React

```javascript
// In un componente React / Next.js
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AnimatedSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Tutte le animazioni qui dentro vengono raccolte nel context
      gsap.from(".card", {
        y: 50,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef); // scope: solo gli elementi dentro sectionRef

    return () => ctx.revert(); // cleanup totale su unmount
  }, []);

  return <div ref={sectionRef}>...</div>;
}
```

#### Performance: evitare layout thrashing

```javascript
// ❌ SBAGLIATO — legge e scrive il DOM alternando (thrashing)
elements.forEach(el => {
  const height = el.offsetHeight;
  el.style.height = height + 'px';
});

// ✅ CORRETTO — batch reads poi batch writes
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => {
  gsap.set(el, { height: heights[i] });
});

// ✅ GSAP gestisce già internamente il batching con gsap.set()
```

#### Preservare il ritmo del layout (anti-CLS)

```javascript
// Inizializzare sempre gli stati di partenza PRIMA del paint
// per evitare il flash di contenuto non animato (FOUC animato)
gsap.set(".animated-element", {
  opacity: 0,
  y: 30,
});

// Poi anima
gsap.to(".animated-element", {
  opacity: 1,
  y: 0,
  duration: 0.5,
  ease: "power2.out",
  scrollTrigger: { ... },
});
```

#### Hero Sequence — il pattern professionale

```javascript
// Sequenza hero con timeline orchestrata
function initHeroAnimation() {
  const tl = gsap.timeline({ delay: 0.1 });

  tl.from("[data-hero-tag]",   { y: 20, opacity: 0, duration: 0.4 })
    .from("[data-hero-title]", { y: 40, opacity: 0, duration: 0.6 }, "-=0.1")
    .from("[data-hero-desc]",  { y: 30, opacity: 0, duration: 0.5 }, "-=0.2")
    .from("[data-hero-cta]",   { y: 20, opacity: 0, scale: 0.97, duration: 0.4 }, "-=0.15")
    .from("[data-hero-image]", { scale: 1.05, opacity: 0, duration: 0.8, ease: "power1.out" }, "-=0.5");

  return tl;
}
```

### 5.4 Framer Motion — Best Practices

#### Varianti: il pattern dichiarativo

```typescript
import { motion } from "framer-motion";

// Pattern varianti — separa la logica dall'implementazione
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,    // 80ms tra figli
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.0, 0.0, 0.2, 1], // ease-out
    },
  },
};

export function CardGrid({ items }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-3 gap-6"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          {/* contenuto card */}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

#### Transizioni di pagina (Next.js App Router)

```typescript
// components/page-transition.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
  initial:  { opacity: 0, y: 8 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0, 0, 0.2, 1] } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
```

#### Hover interattivo su card

```typescript
const cardVariants = {
  rest: { scale: 1, y: 0, boxShadow: "var(--shadow-md)" },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "var(--shadow-lg)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

<motion.div
  variants={cardVariants}
  initial="rest"
  whileHover="hover"
  whileTap="tap"
  className="rounded-xl bg-white p-6 cursor-pointer"
>
  ...
</motion.div>
```

#### `prefers-reduced-motion` — obbligatorio

```typescript
import { useReducedMotion } from "framer-motion";

export function AnimatedCard() {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.5,
      },
    },
  };

  return <motion.div variants={variants} initial="hidden" animate="visible" />;
}
```

### 5.5 Animazioni da Non Fare Mai

| Anti-pattern | Problema | Alternativa |
|-------------|---------|-------------|
| Animare `width` / `height` | Layout reflow, jank | `scaleX` / `scaleY` + `transform-origin` |
| Animare `top` / `left` | Layout reflow | `translateX` / `translateY` |
| Animare `margin` / `padding` | Layout reflow | `gap` + transform |
| `duration > 700ms` per UI | Sembra lento | Massimo 400ms per transizioni |
| Decorative-only animation | Distrae | Ogni animazione deve avere significato |
| `linear` easing su transizioni UI | Non naturale | ease-out (enter), ease-in (exit) |
| Animazioni senza `prefers-reduced-motion` | Inaccessibile | Sempre rispettare la preferenza |
| Bloccare l'input durante animazione | UX pessima | UI sempre interattiva durante le animazioni |
| Stagger > 60ms per item | Troppo lento | 30–50ms per item |

---

## 6. Workflow Operativo: Tailwind CSS + GSAP/Framer Motion

### 6.1 Setup Progetto Next.js (App Router)

```bash
# 1. Crea il progetto
npx create-next-app@latest my-project --typescript --tailwind --app

# 2. Installa le dipendenze di animazione
npm install gsap framer-motion

# 3. Installa shadcn/ui
npx shadcn@latest init

# 4. Aggiungi i componenti base
npx shadcn@latest add button card dialog input form badge
```

### 6.2 Struttura Token in `globals.css`

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* === PRIMITIVI === */
    --radius: 0.5rem;

    /* === SEMANTICI (formato HSL per Tailwind opacity modifiers) === */
    --background:          0 0% 98%;
    --foreground:          222 47% 11%;
    --primary:             214 100% 40%;
    --primary-foreground:  0 0% 100%;
    --secondary:           210 17% 95%;
    --secondary-foreground:222 47% 11%;
    --muted:               210 17% 95%;
    --muted-foreground:    215 16% 47%;
    --accent:              210 17% 95%;
    --accent-foreground:   222 47% 11%;
    --destructive:         0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border:              214 32% 91%;
    --input:               214 32% 91%;
    --ring:                214 100% 40%;
    --card:                0 0% 100%;
    --card-foreground:     222 47% 11%;

    /* === ANIMAZIONI === */
    --duration-fast:   150ms;
    --duration-normal: 250ms;
    --duration-slow:   400ms;
  }

  .dark {
    --background:     222 47% 4%;
    --foreground:     210 40% 98%;
    --primary:        214 100% 58%;
    --secondary:      217 33% 17%;
    --muted:          217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --border:         217 33% 17%;
    --card:           217 33% 12%;
    --card-foreground:210 40% 98%;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground font-body; }
  h1, h2, h3, h4, h5, h6 { @apply font-heading; }
}
```

### 6.3 `tailwind.config.ts` Completo

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border:  "hsl(var(--border))",
        input:   "hsl(var(--input))",
        ring:    "hsl(var(--ring))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionDuration: {
        fast:   "150ms",
        normal: "250ms",
        slow:   "400ms",
      },
      transitionTimingFunction: {
        "enter": "cubic-bezier(0.0, 0.0, 0.2, 1)",
        "exit":  "cubic-bezier(0.4, 0.0, 1, 1)",
        "spring":"cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      animation: {
        "fade-in":      "fadeIn 0.3s ease-out",
        "slide-up":     "slideUp 0.4s ease-out",
        "accordion-down":"accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### 6.4 Pattern di Composizione Componente

```typescript
// components/ui/animated-card.tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : 0.5,
        delay,
        ease: [0.0, 0.0, 0.2, 1],
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-xl border bg-card p-6 shadow-md",
        "transition-shadow duration-200",
        "hover:shadow-lg",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
```

### 6.5 GSAP ScrollTrigger — Setup Next.js

```typescript
// hooks/use-gsap-scroll.ts
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapScroll<T extends HTMLElement>(
  animationFn: (scope: T) => gsap.core.Timeline | void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      animationFn(ref.current!);
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

// Uso nel componente:
// const sectionRef = useGsapScroll<HTMLDivElement>((scope) => {
//   gsap.from(scope.querySelectorAll(".item"), {
//     y: 40, opacity: 0, stagger: 0.06, duration: 0.6,
//     ease: "power2.out",
//     scrollTrigger: { trigger: scope, start: "top 80%" },
//   });
// });
```

### 6.6 Scelta tra GSAP e Framer Motion

| Scenario | Strumento | Perché |
|----------|-----------|--------|
| Animazioni scroll complesse (parallax, pin, timeline) | GSAP + ScrollTrigger | Controllo preciso, performance superiore |
| Transizioni di pagina / route | Framer Motion | Integrazione React nativa, AnimatePresence |
| Stagger su liste dinamiche | Entrambi | GSAP per precisione, Framer per semplicità |
| Hover / interazioni componenti | Framer Motion | `whileHover`, `whileTap` dichiarativi |
| Animazioni layout (dimensioni che cambiano) | Framer Motion | `layout` prop gestisce le transizioni auto |
| Sequenze cinematiche complesse | GSAP Timeline | Orchestrazione con `position parameters` |
| Componenti React riutilizzabili | Framer Motion | Incapsulato nel componente |

---

## 7. Checklist Pre-Consegna

### Accessibilità
- [ ] Contrasto testo normale ≥ 4.5:1 (light e dark mode)
- [ ] Contrasto testo grande ≥ 3:1
- [ ] Focus ring visibile su tutti gli elementi interattivi
- [ ] `aria-label` su tutti i pulsanti icon-only
- [ ] Gerarchia heading h1→h2→h3 senza salti
- [ ] Immagini con `alt` text descrittivo
- [ ] Colore non unico indicatore di stato (aggiunto icona o testo)
- [ ] `prefers-reduced-motion` rispettato in tutte le animazioni

### Design System
- [ ] Zero hex raw nei componenti — solo `var(--token)`
- [ ] Zero emoji come icone — solo SVG (Lucide, Heroicons)
- [ ] Spaziatura sempre multiplo di 4px
- [ ] Un solo bottone primario per schermata
- [ ] Spacing rhythm consistente per semantica (section, component, element)
- [ ] Dark mode testata separatamente

### Animazioni
- [ ] Nessuna animazione anima `width`, `height`, `top`, `left`
- [ ] Durata micro-interazioni: 150–300ms
- [ ] Durata transizioni di pagina: ≤ 400ms
- [ ] Exit duration ≈ 60–70% dell'enter duration
- [ ] Stagger tra item: 30–50ms
- [ ] Easing: ease-out per enter, ease-in per exit
- [ ] GSAP context cleanup su unmount (`ctx.revert()`)
- [ ] UI interattiva durante le animazioni (no blocking)

### Layout & Responsive
- [ ] Testato su 375px (small phone)
- [ ] Nessuno scroll orizzontale su mobile
- [ ] `min-h-dvh` invece di `100vh`
- [ ] Touch target ≥ 44×44px
- [ ] Gap tra touch target ≥ 8px
- [ ] Container `max-w-6xl` con `mx-auto` su desktop

### Tipografia
- [ ] Body text minimo `16px`
- [ ] Line-length ≤ 75 caratteri (`max-w-prose`)
- [ ] Line-height body: 1.5–1.625
- [ ] Letter-spacing heading: `-0.02em` su display e h1
- [ ] Font caricato con `font-display: swap`

---

*Documento generato da UI/UX Pro Max v2.5.0 (nextlevelbuilder) — Lead Forge per Next Home — 25 aprile 2026*
