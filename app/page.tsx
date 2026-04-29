'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/components/SmoothScrolling';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── GEOMETRIA PANNELLO BIANCO (hero-stand.png 1672×941) ──────────────
   L'immagine è RGB 16:9, sfondo quasi-bianco (non trasparente).
   Il pannello del totem occupa approssimativamente:
     left 26%  right 74%  → larghezza ≈ 48% dell'immagine
     top   8%  bottom 70% → altezza   ≈ 62% dell'immagine
     center X = 50%   center Y ≈ 39%

   transformOrigin '50% 39%' mappa al centro del pannello che, con lo
   stand a 78vh ancorato al bottom, corrisponde ~al centro del viewport.
   Il bianco definitivo è garantito dall'overlay (non dallo scale esatto).
──────────────────────────────────────────────────────────────────────── */
const PANEL = {
  left:   0.26,
  right:  0.74,
  top:    0.08,
  bottom: 0.70,
  cx:     0.50,
  cy:     0.39,
} as const;

/* Scale fisso: garantisce copertura su qualsiasi viewport.
   A scale 5 il pannello (≈48% di 78vh) = 240% del viewport → overflow:hidden lo ritaglia. */
const ZOOM_SCALE = 5;

export default function HomePage() {
  const lenisCtx  = useLenis();
  const lenisRef  = useRef(lenisCtx);
  lenisRef.current = lenisCtx;

  const heroRef         = useRef<HTMLElement>(null);
  const mallBgRef       = useRef<HTMLImageElement>(null);
  const standWrapRef    = useRef<HTMLDivElement>(null);
  const contentRef      = useRef<HTMLDivElement>(null);
  const scrollCueRef    = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── REDUCED MOTION ── */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(['#nav', '#heroContent'], { opacity: 1, y: 0 });
      return;
    }

    /* ── POWER-ON ENTRANCE ─────────────────────────────────────────────── */
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

    /* ── SCROLL ZOOM ─────────────────────────────────────────────────────
       Timeline:
         0.00–0.35  contenuto hero svanisce e sale
         0.00–1.00  mall: zoom leggero + dissolvenza
         0.00–1.00  stand: zoom power3.in (lento→veloce), scale 1→5
         0.40–1.00  white overlay: fade-in → bianco totale

       Con scrub, la posizione del timeline segue lo scroll 1:1.
       L'ease 'power3.in' sullo stand fa sì che a metà scroll la scala
       sia ancora bassa, poi accelera bruscamente negli ultimi 30%.
    ─────────────────────────────────────────────────────────────────────  */
    const standWrap = standWrapRef.current;
    if (!standWrap) return;

    /* Il pannello bianco è al centro dell'immagine (X=50%).
       Verticalmente: 39% dall'alto dell'elemento. Con stand a 78vh
       ancorato al bottom, questo corrisponde circa al centro del viewport. */
    gsap.set(standWrap, {
      transformOrigin: `${PANEL.cx * 100}% ${PANEL.cy * 100}%`,
    });

    const tl = gsap.timeline({ paused: true })
      /* 1. contenuto scompare subito */
      .to(contentRef.current,      { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in' }, 0)
      .to(scrollCueRef.current,    { opacity: 0, duration: 0.25, ease: 'power1.in' }, 0)
      /* 2. mall: leggero zoom + attenuazione per dare profondità */
      .to(mallBgRef.current,       { scale: 1.10, opacity: 0.3, duration: 1, ease: 'none' }, 0)
      /* 3. stand: zoom lento→veloce verso il pannello bianco */
      .to(standWrap,               { scale: ZOOM_SCALE, duration: 1, ease: 'power3.in' }, 0)
      /* 4. overlay bianco: sale da 40% dello scroll, completo a 100% */
      .to(whiteOverlayRef.current, { opacity: 1, duration: 0.6, ease: 'power2.in' }, 0.40);

    const st = ScrollTrigger.create({
      trigger:   heroRef.current,
      start:     'top top',
      end:       '+=480',           /* 480px di scroll effettivo */
      pin:       true,
      scrub:     0.5,
      animation: tl,
    });

    /* Refresh dopo il caricamento delle immagini (in caso di cache miss) */
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

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
          Layer 1 — mall background (hero-mall.png): full-screen cover
          Layer 2 — stand PNG (hero-stand.png): foreground, bottom-center
          White overlay — fade-in al 40% dello scroll → bianco totale
          ScrollTrigger pinna la sezione per 480px di scroll effettivo.
      ══ */}
      <section className="hero-section" ref={heroRef} id="heroSection">

        {/* CRT scanline entrance */}
        <div className="hero-scanline" id="scanline" aria-hidden="true" />

        {/* ── Layer 1: centro commerciale ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={mallBgRef}
          src="/hero-mall.png"
          alt=""
          className="hero-mall-bg"
          aria-hidden="true"
          draggable={false}
        />

        {/* Gradiente scuro sinistra per leggibilità testo */}
        <div className="hero-tint" aria-hidden="true" />

        {/* ── Layer 2: stand pubblicitario ───────────────────────────────────
            .hero-stand-positioner  posiziona bottom-center via CSS
            .hero-stand-wrap        è il target GSAP (scale + transformOrigin)
            Dentro: img PNG + preview del contenuto nella zona del pannello */}
        <div className="hero-stand-positioner">
          <div className="hero-stand-wrap" ref={standWrapRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-stand.png"
              alt="Stand pubblicitario Mediavisual"
              className="hero-stand-img"
              draggable={false}
            />

            {/* Preview: posizionata alle coordinate del pannello bianco.
                PANEL: left 26%, top 8%, width 48%, height 62%.
                Scala proporzionalmente allo stand → effetto "entrata nel pannello". */}
            <div className="hero-panel-preview" aria-hidden="true">
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

        {/* ── White overlay ──────────────────────────────────────────────────
            Parte trasparente, fade-in al 40% dello scroll.
            A scroll completato è completamente bianco → passaggio invisibile
            alla seconda sezione che ha lo stesso sfondo. */}
        <div
          className="hero-white-overlay"
          ref={whiteOverlayRef}
          aria-hidden="true"
        />

        {/* ── Contenuto hero: logo + headline + CTA ── */}
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
          Sfondo #ffffff — continua naturalmente dall'overlay bianco finale.
          La transizione è invisibile: bianco → bianco.
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
