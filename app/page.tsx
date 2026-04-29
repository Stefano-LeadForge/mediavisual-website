'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/components/SmoothScrolling';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── PANEL GEOMETRY (hero-stand.png) ──────────────────────────────────
   Il pannello bianco del totem occupa queste frazioni dell'immagine PNG.
   Misurato dall'analisi visiva dell'immagine con sfondo trasparente.
   L'immagine è landscape (4:3 circa); il pannello è centrato.
     left  16%  right  84%  → larghezza pannello 68% dell'immagine
     top    3%  bottom 80%  → altezza pannello   77% dell'immagine
     center X = 50%   center Y = 41.5%
   Questi valori guidano: transformOrigin, scale dinamico, posizione preview.
──────────────────────────────────────────────────────────────────────── */
const PANEL = {
  left:   0.16,
  right:  0.84,
  top:    0.03,
  bottom: 0.80,
  cx:     0.50,
  cy:     0.415,
} as const;

export default function HomePage() {
  const lenisCtx  = useLenis();
  const lenisRef  = useRef(lenisCtx);
  lenisRef.current = lenisCtx;

  const heroRef      = useRef<HTMLElement>(null);
  const mallBgRef    = useRef<HTMLImageElement>(null);
  const standWrapRef = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const previewRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── REDUCED MOTION ── */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(['#nav', '#heroContent'], { opacity: 1, y: 0 });
      return;
    }

    /* ── POWER-ON ENTRANCE ───────────────────────────────────────────────
       Nav scende dall'alto; scanline CRT percorre il viewport;
       il blocco contenuto si eleva. Solo se la pagina parte da top.
    ─────────────────────────────────────────────────────────────────────  */
    gsap.set('#nav',         { opacity: 0, y: -12 });
    gsap.set('#heroContent', { opacity: 0, y: 40  });
    gsap.set('#scanline',    { y: 0, opacity: 0   });

    if (window.scrollY > 0) {
      gsap.set('#nav',         { opacity: 1, y: 0 });
      gsap.set('#heroContent', { opacity: 1, y: 0 });
    } else {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('#nav',         { opacity: 1, y: 0, duration: 0.9 }, 0)
        .to('#scanline',    { opacity: 1, duration: 0.05 }, 0.2)
        .to('#scanline',    { y: '100vh', duration: 1.2, ease: 'power2.inOut' }, 0.2)
        .to('#scanline',    { opacity: 0, duration: 0.08 }, 1.38)
        .to('#heroContent', { opacity: 1, y: 0, duration: 1.0 }, 1.1);
    }

    /* ── SCROLL-DRIVEN ZOOM ──────────────────────────────────────────────
       Calcola dinamicamente lo scale necessario affinché il pannello bianco
       del totem riempia esattamente il viewport.

       Meccanica:
       1. Lo stand PNG ha sfondo trasparente: solo il pannello è opaco.
       2. Con transformOrigin al centro del pannello (50% 41.5%), lo scale
          espande l'immagine tenendo fermo quel punto.
       3. Quando il pannello raggiunge i bordi del viewport, le zone
          trasparenti (pali, piedi) sono già fuori dal viewport → clippate.
       4. Il risultato è bianco puro che riempie tutto il viewport.
    ─────────────────────────────────────────────────────────────────────  */
    const standWrap = standWrapRef.current;
    if (!standWrap) return;

    const computeScale = () => {
      const rect = standWrap.getBoundingClientRect();
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;
      const panelW = (PANEL.right - PANEL.left) * rect.width;
      const panelH = (PANEL.bottom - PANEL.top) * rect.height;
      /* Prendiamo il maggiore dei due fattori per coprire entrambe le dimensioni */
      return Math.max(vw / panelW, vh / panelH) * 1.08; // 8% safety margin
    };

    /* Transform origin: centro del pannello bianco come % dell'elemento */
    gsap.set(standWrap, {
      transformOrigin: `${PANEL.cx * 100}% ${PANEL.cy * 100}%`,
    });

    const buildTimeline = () => gsap.timeline({ paused: true })
      /* contenuto hero: svanisce e sale leggermente */
      .to(contentRef.current,   { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in' }, 0)
      .to(scrollCueRef.current, { opacity: 0, duration: 0.2 }, 0)
      /* sfondo mall: zoom leggero + attenuazione */
      .to(mallBgRef.current,    { scale: 1.12, opacity: 0.35, duration: 1, ease: 'none' }, 0)
      /* stand: zoom verso il pannello bianco */
      .to(standWrap,            { scale: computeScale(), duration: 1, ease: 'none' }, 0);

    const tl = buildTimeline();

    const st = ScrollTrigger.create({
      trigger:   heroRef.current,
      start:     'top top',
      end:       '+=380',           /* ~380px di scroll effettivo */
      pin:       true,
      scrub:     0.6,
      animation: tl,
    });

    /* ── NAV: diventa solido dopo 50px ── */
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
    function closeMenu() {
      menuOpen = false;
      hamburgerEl?.classList.remove('is-open');
      document.body.style.overflow = '';
      gsap.to(mobileLinks, { opacity: 0, y: 16, duration: 0.22, ease: 'power2.in', stagger: 0.04 });
      gsap.to(mobileMenuEl, {
        opacity: 0, duration: 0.28, delay: 0.18, ease: 'power2.in',
        onComplete: () => { if (mobileMenuEl) mobileMenuEl.style.pointerEvents = 'none'; },
      });
    }
    function onHamburgerClick() { menuOpen ? closeMenu() : openMenu(); }
    hamburgerEl?.addEventListener('click', onHamburgerClick);

    return () => {
      st.kill();
      tl.kill();
      window.removeEventListener('scroll', onNavScroll);
      document.getElementById('ctaScroll')?.removeEventListener('click', scrollToNext);
      hamburgerEl?.removeEventListener('click', onHamburgerClick);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="home-page">

      {/* ══ NAV ════════════════════════════════════════════════════════════ */}
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

      {/* ══ MOBILE MENU ════════════════════════════════════════════════════ */}
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

      {/* ══ HERO ════════════════════════════════════════════════════════════
          Due layer separati: mall background + stand foreground PNG.
          ScrollTrigger pinna la sezione e zooma lo stand finché il
          pannello bianco riempie il viewport — poi la sezione successiva
          (sfondo bianco) continua naturalmente.
      ══ */}
      <section className="hero-section" ref={heroRef} id="heroSection">

        {/* CRT scanline — power-on entrance */}
        <div className="hero-scanline" id="scanline" aria-hidden="true" />

        {/* ── LAYER 1: sfondo centro commerciale ──────────────────────────
            Copre l'intero viewport. GSAP lo zooma e attenua leggermente
            durante lo scroll, creando profondità. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={mallBgRef}
          src="/hero-mall.png"
          alt=""
          className="hero-mall-bg"
          aria-hidden="true"
          draggable={false}
        />

        {/* Gradiente scuro sinistra — leggibilità testo */}
        <div className="hero-tint" aria-hidden="true" />

        {/* ── LAYER 2: stand pubblicitario (PNG trasparente) ───────────────
            Posizionato in basso al centro. GSAP zooma l'intera immagine
            con transformOrigin al centro del pannello bianco (50% 41.5%).
            Le zone trasparenti si allargano oltre il viewport: rimane
            visibile solo il pannello bianco, che diventa lo sfondo della
            sezione successiva.

            .hero-stand-positioner — solo per l'allineamento CSS
            .hero-stand-wrap       — target GSAP per lo scale */}
        <div className="hero-stand-positioner">
          <div className="hero-stand-wrap" ref={standWrapRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-stand.png"
              alt="Stand pubblicitario Mediavisual"
              className="hero-stand-img"
              draggable={false}
            />

            {/* ── PREVIEW nella zona bianca del pannello ─────────────────
                Posizionata con le stesse % di PANEL: top 3%, left 16%,
                width 68%, height 77%. Mentre lo stand zooma, questa
                preview zooma proporzionalmente — l'utente percepisce
                di "entrare" nel pannello. Svanisce nella sezione reale. */}
            <div
              className="hero-panel-preview"
              ref={previewRef}
              aria-hidden="true"
            >
              <div className="section-eyebrow preview-eyebrow">
                <div className="section-eyebrow-line" />
                <span className="section-eyebrow-text">Chi Siamo</span>
              </div>
              <h2 className="section-title preview-title">
                Progettiamo e installiamo<br />strutture ad alto impatto visivo.
              </h2>
            </div>
          </div>
        </div>

        {/* ── CONTENT: headline + CTA ─────────────────────────────────────
            GSAP dissolve durante lo zoom (opacity 0, y -24). */}
        <div className="hero-content-layer" ref={contentRef}>
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
        </div>

        {/* Scroll cue */}
        <div className="scroll-cue visible" ref={scrollCueRef} aria-hidden="true">
          <span className="scroll-cue-text">Scorri</span>
          <div className="scroll-cue-line" />
        </div>

      </section>

      {/* ══ SECONDA SEZIONE ═════════════════════════════════════════════════
          Sfondo bianco: continua naturalmente dal pannello bianco del totem.
          La transizione è invisibile — bianco su bianco.
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
