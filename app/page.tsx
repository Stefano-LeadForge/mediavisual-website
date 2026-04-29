'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLenis } from '@/components/SmoothScrolling';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/* ── PANEL GEOMETRY (must match --panel-inset in globals.css) ──────────
   Pannello bianco del totem in hero-stand.png:
     left 18% · right 50% · top 10% · bottom 90%
     center X = 34%  ·  center Y = 50%
   Scale minima per coprire il viewport (bordo destro): (100-34)/16 = 4.1×
   Si usa 5.5× per margine.
──────────────────────────────────────────────────────────────────────── */
const PANEL = { top: 10, right: 50, bottom: 10, left: 18 } as const;

/** Lerp lineare */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/** Ease-out cubic */
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisCtx     = useLenis();
  const lenisRef     = useRef(lenisCtx);
  lenisRef.current   = lenisCtx;

  /* ── FRAMER MOTION: scroll progress ────────────────────────────────────
     offset ['start start', 'end end']:
       0 = top del container allineato al top del viewport
       1 = bottom del container allineato al bottom del viewport
     Con container 250vh e viewport 100vh → animazione su 150vh di scroll.
  ────────────────────────────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* ── ZOOM verso il pannello bianco del totem ────────────────────────────
     transformOrigin = object-position = --hero-zoom-origin (34% 50%).
     Il CSS garantisce che il punto 34%/50% dell'immagine coincida
     esattamente con il punto 34%/50% del viewport → zoom matematicamente
     centrato sul pannello.
     Scale 5.5: il bordo destro del pannello (50%) raggiunge il 100% del
     viewport a scale ≈ 4.1; 5.5 garantisce piena copertura.
  ─────────────────────────────────────────────────────────────────────── */
  const scale = useTransform(scrollYProgress, [0, 1], [1, 5.5]);

  /* Testo hero: opacity 1 → 0 nel primo 35% dello scroll */
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  /* Scroll cue: scompare nel primo 12% */
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  /* ── PANEL BURST: clip-path inset() da rettangolo-pannello a viewport ────
     La clip parte identica ai bordi del pannello bianco nel totem.
     Mentre l'utente scorre:
       – l'immagine di sfondo ha già riempito il viewport di bianco (scale > 4)
       – il burst si apre come un'iride, rivelando la sezione successiva
     Il teaser (testo dentro la clip iniziale) crea l'effetto "anteprima
     nello schermo del totem".

     Timing:
       0.55 → 1.00  clip si apre (45% dello scroll travel = ~67vh)
       0.52 → 0.65  teaser appare in fade-in
       0.85 → 0.98  teaser scompare in fade-out (prima del passaggio sezione)
  ─────────────────────────────────────────────────────────────────────── */
  const burstClipPath = useTransform(scrollYProgress, (p: number) => {
    const t  = Math.max(0, Math.min(1, (p - 0.55) / 0.45));
    const te = easeOut(t);
    const top   = lerp(PANEL.top,    0, te).toFixed(2);
    const right = lerp(PANEL.right,  0, te).toFixed(2);
    const bot   = lerp(PANEL.bottom, 0, te).toFixed(2);
    const left  = lerp(PANEL.left,   0, te).toFixed(2);
    return `inset(${top}% ${right}% ${bot}% ${left}%)`;
  });

  const teaserOpacity = useTransform(
    scrollYProgress,
    [0.52, 0.65, 0.85, 0.98],
    [0, 1, 1, 0],
  );

  useEffect(() => {
    /* ── REDUCED MOTION ── */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(['#nav', '#heroContent'], { opacity: 1, y: 0, clearProps: 'transform' });
      return;
    }

    /* ── STATO INIZIALE ─────────────────────────────────────────────────
       Solo nav e heroContent — GSAP non tocca l'immagine (gestita da FM).
    ─────────────────────────────────────────────────────────────────────  */
    gsap.set('#nav',         { opacity: 0, y: -12 });
    gsap.set('#heroContent', { opacity: 0, y: 40 });
    gsap.set('#scanline',    { y: 0, opacity: 0 });

    if (window.scrollY > 0) {
      gsap.set('#nav',         { opacity: 1, y: 0 });
      gsap.set('#heroContent', { opacity: 1, y: 0 });
      return;
    }

    /* ═══════════════════════════════════════════════════════════════════
       POWER-ON SEQUENCE
         0.0s  → 0.9s : Nav scende dall'alto
         0.2s  → 1.4s : Scanline CRT wipe
         1.1s  → 2.1s : Logo + titolo si elevano in blocco
    ═══════════════════════════════════════════════════════════════════ */
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to('#nav',         { opacity: 1, y: 0, duration: 0.9 }, 0)
      .to('#scanline',    { opacity: 1, duration: 0.05 }, 0.2)
      .to('#scanline',    { y: '100vh', duration: 1.2, ease: 'power2.inOut' }, 0.2)
      .to('#scanline',    { opacity: 0, duration: 0.08 }, 1.38)
      .to('#heroContent', { opacity: 1, y: 0, duration: 1.0 }, 1.1);

    /* ── NAV: diventa solido dopo 50px di scroll ── */
    const navEl = document.getElementById('nav');
    function onNavScroll() {
      navEl?.classList.toggle('nav--solid', window.scrollY > 50);
    }
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();

    /* ── SCROLL ARROW → #nextSection ── */
    function scrollToNext(e: Event) {
      e.preventDefault();
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo('#nextSection', { duration: 1.4, easing: (x: number) => x * (2 - x) });
      } else {
        gsap.to(window, { scrollTo: { y: '#nextSection', autoKill: false }, duration: 1.4, ease: 'power2.inOut' });
      }
    }
    document.getElementById('ctaScroll')?.addEventListener('click', scrollToNext);

    /* ── MOBILE MENU ── */
    const hamburgerEl  = document.getElementById('hamburger');
    const mobileMenuEl = document.getElementById('mobileMenu');
    const mobileLinks  = mobileMenuEl ? Array.from(mobileMenuEl.querySelectorAll('a')) : [];
    let menuOpen = false;

    function openMenu() {
      menuOpen = true;
      hamburgerEl?.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (mobileMenuEl) mobileMenuEl.style.pointerEvents = 'auto';
      gsap.to(mobileMenuEl, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(mobileLinks,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out', delay: 0.18 },
      );
    }
    function closeMenu(cb?: () => void) {
      menuOpen = false;
      hamburgerEl?.classList.remove('is-open');
      document.body.style.overflow = '';
      gsap.to(mobileLinks, { opacity: 0, y: 16, duration: 0.22, ease: 'power2.in', stagger: 0.04 });
      gsap.to(mobileMenuEl, {
        opacity: 0, duration: 0.28, delay: 0.18, ease: 'power2.in',
        onComplete: () => {
          if (mobileMenuEl) mobileMenuEl.style.pointerEvents = 'none';
          cb?.();
        },
      });
    }
    function onHamburgerClick() { menuOpen ? closeMenu() : openMenu(); }
    hamburgerEl?.addEventListener('click', onHamburgerClick);

    return () => {
      window.removeEventListener('scroll', onNavScroll);
      document.getElementById('ctaScroll')?.removeEventListener('click', scrollToNext);
      hamburgerEl?.removeEventListener('click', onHamburgerClick);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="home-page">

      {/* ══ NAV — fixed, fuori dal container hero ════════════════════════ */}
      <nav id="nav">
        <a href="/" className="nav-wordmark" aria-label="Mediavisual — Homepage">
          MEDIA<span>VISUAL</span>
        </a>
        <ul className="nav-links">
          <li><a href="/prodotti">Prodotti</a></li>
          <li><a href="/progetti">Progetti</a></li>
          <li><a href="/chi-siamo">Chi Siamo</a></li>
          <li><a href="/contatti">Contatti</a></li>
        </ul>
        <a href="/contatti" className="nav-btn">Richiedi Preventivo</a>
        <button className="hamburger" id="hamburger" aria-label="Apri menu">
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      {/* ══ MOBILE MENU OVERLAY ══ */}
      <div className="mobile-menu" id="mobileMenu" style={{ pointerEvents: 'none', opacity: 0 }}>
        <ul className="mobile-menu-list">
          <li><a href="/prodotti"  className="mobile-menu-link">Prodotti</a></li>
          <li><a href="/progetti"  className="mobile-menu-link">Progetti</a></li>
          <li><a href="/chi-siamo" className="mobile-menu-link">Chi Siamo</a></li>
          <li><a href="/contatti"  className="mobile-menu-link">Contatti</a></li>
        </ul>
        <div className="mobile-menu-divider" />
        <a href="/contatti" className="mobile-menu-cta-link">Richiedi Preventivo</a>
      </div>

      {/* ══ IMMERSIVE ZOOM HERO ══════════════════════════════════════════════
          containerRef (250vh) crea lo scroll room per Framer Motion.
          hero-sticky-inner rimane fisso mentre il container scorre.

          ── COME CALIBRARE ──────────────────────────────────────────────────
          1. Apri DevTools, ispeziona .hero-zoom-img
          2. Misura il centro del pannello bianco come % di width/height
          3. Aggiorna --hero-zoom-origin e PANEL in page.tsx
          4. Aggiorna --panel-inset in globals.css con i nuovi bordi
      ══ */}
      <div ref={containerRef} className="hero-scroll-container">
        <div className="hero-sticky-inner">

          {/* CRT scanline — power-on entrance */}
          <div className="hero-scanline" id="scanline" aria-hidden="true" />

          {/* ── BACKGROUND: zoom verso il pannello bianco ─────────────────
              object-position = transformOrigin = --hero-zoom-origin:
              lo stesso punto fisso garantisce che il pannello bianco sia
              sempre il baricentro dello zoom, indipendentemente dalle
              dimensioni del viewport. */}
          <motion.div
            className="hero-zoom-bg"
            style={{
              scale,
              transformOrigin: 'var(--hero-zoom-origin, 34% 50%)',
              willChange: 'transform',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-stand.png"
              alt="Mediavisual — stand pubblicitario"
              className="hero-zoom-img"
              draggable={false}
            />
          </motion.div>

          {/* Gradiente scuro lato sinistro — leggibilità testo */}
          <div className="hero-tint" />

          {/* ── CONTENT: opacity guidata dallo scroll (FM) ──
              L'inner #heroContent è l'obiettivo GSAP per la power-on entrance.
              I due layer (FM opacity outer / GSAP opacity inner) non si sovrappongono. */}
          <motion.div className="hero-content-layer" style={{ opacity: textOpacity }}>
            <div id="heroContent" className="hero-content-block">

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-mediavisual.jpeg"
                alt="Mediavisual"
                className="hero-logo"
              />

              <h1 className="hero-headline">
                il tuo brand,<br />
                <em>al centro dell&apos;attenzione.</em>
              </h1>

              <div className="hero-cta-row">
                <a href="/contatti" className="cta-primary">
                  <span>Richiedi un Progetto</span>
                  <span className="arr" />
                </a>
                <a
                  href="#nextSection"
                  className="hero-scroll-arrow"
                  id="ctaScroll"
                  aria-label="Scorri alla sezione successiva"
                >
                  <span className="hero-scroll-arrow-icon" />
                </a>
              </div>

            </div>
          </motion.div>

          {/* Scroll cue — Framer Motion gestisce il fade-out */}
          <motion.div className="scroll-cue visible" style={{ opacity: cueOpacity }}>
            <span className="scroll-cue-text">Scorri</span>
            <div className="scroll-cue-line" />
          </motion.div>

          {/* ══ PANEL BURST ═══════════════════════════════════════════════
              Il clip-path inset() parte dai bordi esatti del pannello bianco
              del totem e si apre fino a coprire l'intero viewport.

              Mentre l'immagine di sfondo zooma verso il pannello (z-index 0),
              il burst overlay (z-index 25) si apre dalla stessa area con un
              clip animato, rivelando il contenuto della sezione successiva.

              Il .hero-panel-teaser è posizionato DENTRO i bordi iniziali
              del clip (18–50% X, 10–90% Y), così appare come anteprima
              "nello schermo del totem" durante l'apertura.
          ══ */}
          <motion.div
            className="hero-panel-burst"
            style={{ clipPath: burstClipPath }}
            aria-hidden="true"
          >
            <motion.div className="hero-panel-teaser" style={{ opacity: teaserOpacity }}>
              <div className="section-eyebrow">
                <div className="section-eyebrow-line" />
                <span className="section-eyebrow-text">Chi Siamo</span>
              </div>
              <h2 className="section-title">
                Progettiamo e installiamo<br />strutture ad alto impatto visivo.
              </h2>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ══ PRIMA SEZIONE ════════════════════════════════════════════════
          #nextSection è il target dello scroll-arrow e il confine
          post-zoom. Il background bianco continua dal burst overlay.
      ══ */}
      <section className="next-section" id="nextSection">
        <div className="section-eyebrow">
          <div className="section-eyebrow-line" />
          <span className="section-eyebrow-text">Chi Siamo</span>
        </div>
        <h2 className="section-title">
          Progettiamo e installiamo<br />strutture ad alto impatto visivo.
        </h2>
      </section>

    </div>
  );
}
