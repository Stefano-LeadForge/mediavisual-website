'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import { useLenis } from '@/components/SmoothScrolling';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);


export default function HomePage() {
  const lenisCtx  = useLenis();
  const lenisRef  = useRef(lenisCtx);
  lenisRef.current = lenisCtx;

  const heroRef         = useRef<HTMLElement>(null);
  const mallBgRef       = useRef<HTMLImageElement>(null);
  const contentRef      = useRef<HTMLDivElement>(null);
  const scrollCueRef    = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);

  /* ── STAND: Framer Motion entrance + scroll zoom ── */
  const standOpacityEntrance = useMotionValue(0);
  const standY               = useMotionValue(20);

  const { scrollY } = useScroll();

  /* Non-linear scale: slow 1→1.3 nella prima metà, poi accelera a 8 */
  const scrollScale = useTransform(
    scrollY,
    [0, 120, 240, 360, 480],
    [1, 1.07, 1.3, 3.5, 8],
    { clamp: true },
  );

  /* Fade-out attivo solo nella fase veloce finale */
  const scrollFade = useTransform(scrollY, [270, 460], [1, 0], { clamp: true });

  /* Opacità combinata: min(entrance, scrollFade) */
  const standOpacity = useTransform(
    [standOpacityEntrance, scrollFade],
    ([entry, fade]: number[]) => Math.min(entry, fade),
  );

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isScrolled     = window.scrollY > 0;

    /* ── STAND ENTRANCE (Framer Motion) ── */
    let entranceTimeout: ReturnType<typeof setTimeout> | null = null;
    if (prefersReduced || isScrolled) {
      standOpacityEntrance.set(1);
      standY.set(0);
    } else {
      /* Appare 300 ms dopo heroContent (che inizia a t=1.1 s) */
      entranceTimeout = setTimeout(() => {
        animate(standOpacityEntrance, 1, { duration: 1.0, ease: [0.23, 1, 0.32, 1] });
        animate(standY,               0, { duration: 1.0, ease: [0.23, 1, 0.32, 1] });
      }, 1400);
    }

    /* ── REDUCED MOTION ── */
    if (prefersReduced) {
      gsap.set(['#nav', '#heroContent'], { opacity: 1, y: 0 });
      return () => {
        if (entranceTimeout !== null) clearTimeout(entranceTimeout);
      };
    }

    /* ── POWER-ON ENTRANCE ─────────────────────────────────────────────── */
    gsap.set('#nav',         { opacity: 0, y: -12 });
    gsap.set('#heroContent', { opacity: 0, y: 40  });
    gsap.set('#scanline',    { y: 0, opacity: 0   });

    if (isScrolled) {
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

    /* ── SCROLL ZOOM ── */
    const tl = gsap.timeline({ paused: true })
      .to(contentRef.current,      { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in' }, 0)
      .to(scrollCueRef.current,    { opacity: 0, duration: 0.25, ease: 'power1.in' }, 0)
      .to(mallBgRef.current,       { scale: 1.10, opacity: 0.3, duration: 1, ease: 'none' }, 0)
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
      if (entranceTimeout !== null) clearTimeout(entranceTimeout);
      st.kill();
      tl.kill();
      window.removeEventListener('scroll', onNavScroll);
      document.getElementById('ctaScroll')?.removeEventListener('click', scrollToNext);
      hamburgerEl?.removeEventListener('click', onHamburgerClick);
      document.body.style.overflow = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-page">

      {/* ══ NAV ════════════════════════════════════════════════════════════ */}
      <nav id="nav">
        <a href="/" className="nav-wordmark" aria-label="Mediavisual — Homepage">
          MEDIA<span>VISUAL</span>
        </a>
        <ul className="nav-links">
          <li><a href="/servizi">Servizi</a></li>
          <li><a href="/realizzazioni">Realizzazioni</a></li>
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
          <li><a href="/servizi"        className="mobile-menu-link">Servizi</a></li>
          <li><a href="/realizzazioni"  className="mobile-menu-link">Realizzazioni</a></li>
          <li><a href="/chi-siamo" className="mobile-menu-link">Chi Siamo</a></li>
          <li><a href="/contatti"  className="mobile-menu-link">Contatti</a></li>
        </ul>
        <div className="mobile-menu-divider" />
        <a href="/contatti" className="mobile-menu-cta-link">Richiedi Preventivo</a>
      </div>

      {/* ══ HERO ════════════════════════════════════════════════════════════
          Layer 1 — mall background (hero-mall.png): full-screen cover
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

        {/* ── Layer 2: stand centrato — animato con Framer Motion ── */}
        <div className="hero-stand-positioner" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/hero-stand-trasp.png"
            alt=""
            className="hero-stand-img"
            draggable={false}
            style={{ scale: scrollScale, opacity: standOpacity, y: standY }}
          />
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
              src="/logo-mediavisual-trasp.png"
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
