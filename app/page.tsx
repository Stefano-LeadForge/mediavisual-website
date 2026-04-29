'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLenis } from '@/components/SmoothScrolling';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisCtx     = useLenis();
  const lenisRef     = useRef(lenisCtx);
  lenisRef.current   = lenisCtx;

  /* ── FRAMER MOTION: scroll-driven zoom ──────────────────────────────────
     containerRef è il div outer (250vh).
     offset ['start start', 'end end']:
       0 = top del container allineato al top del viewport
       1 = bottom del container allineato al bottom del viewport
     → l'animazione dura ~150vh di scroll reale.
  ─────────────────────────────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* ── ZOOM verso il rettangolo bianco del totem ──────────────────────────
     scale 1 → 9: calibra maxScale se il bianco non copre (aumenta) o
     copre troppo presto (riduci).
     transformOrigin è impostato via CSS var --hero-zoom-origin.
  ─────────────────────────────────────────────────────────────────────── */
  const scale = useTransform(scrollYProgress, [0, 1], [1, 9]);

  /* Testo: opacity 1 → 0 nel primo 35% dello scroll */
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  /* Scroll cue: scompare nel primo 12% */
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

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

       ── COME MODIFICARE ──
       Per rimuovere la scanline: cancella i 3 .to('#scanline', ...)
         e il div .hero-scanline nel JSX.
       Per cambiare timing: modifica l'offset float in ogni .to().
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

          ── CALIBRAZIONE PUNTO DI ZOOM ──────────────────────────────────────
          La variabile CSS --hero-zoom-origin controlla il transformOrigin
          dell'immagine, cioè il punto verso cui lo zoom converge.

          Per trovare le coordinate esatte del rettangolo bianco del totem:
          1. Apri DevTools → ispeziona l'immagine
          2. Misura la posizione del centro del rettangolo bianco
             come % della larghezza e altezza totale dell'immagine
          3. Aggiorna --hero-zoom-origin nel :root di globals.css

          Valori di default: 68% 48% (da calibrare sull'immagine reale)
      ══ */}
      <div ref={containerRef} className="hero-scroll-container">
        <div className="hero-sticky-inner">

          {/* CRT scanline — power-on entrance */}
          <div className="hero-scanline" id="scanline" aria-hidden="true" />

          {/* ── BACKGROUND: Framer Motion scrub zoom ──
              willChange:'transform' forza il compositing su GPU.
              transformOrigin punta al rettangolo bianco del totem. */}
          <motion.div
            className="hero-zoom-bg"
            style={{
              scale,
              transformOrigin: 'var(--hero-zoom-origin, 68% 48%)',
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

              {/* Logo brand — reso bianco via CSS filter */}
              {/* Sostituire con <img src="/logo-mediavisual.jpeg" /> all'arrivo del file */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-mediavisual.jpeg"
                alt="Mediavisual"
                className="hero-logo"
              />

              {/* Headline principale */}
              <h1 className="hero-headline">
                il tuo brand,<br />
                <em>al centro dell&apos;attenzione.</em>
              </h1>

              {/* CTA */}
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

        </div>
      </div>

      {/* ══ PRIMA SEZIONE ════════════════════════════════════════════════
          #nextSection è il target dello scroll-arrow e il confine
          post-zoom. Inserire qui le sezioni di contenuto.
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
