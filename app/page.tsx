'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, animate, transform as fmTransform } from 'framer-motion';
import { useLenis } from '@/components/SmoothScrolling';
import ThemeToggle from '@/components/ThemeToggle';
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
  const arrowRef        = useRef<HTMLButtonElement>(null);

  /* ── STAND: Framer Motion entrance + scroll zoom ── */
  const standOpacityEntrance = useMotionValue(0);
  const standY               = useMotionValue(20);

  /* ── ARROW: entrance + scroll scale (first half) + fade (second half) ── */
  const arrowOpacityEntrance = useMotionValue(0);

  const { scrollY } = useScroll();

  /* Non-linear scale: desktop 300 px, mobile 520 px — pin termina quando lo stand riempie lo schermo */
  const scrollScale = useTransform(() => {
    const sy  = scrollY.get();
    const mob = typeof window !== 'undefined' && window.innerWidth < 768;
    if (mob) {
      return fmTransform(sy, [0, 75, 150, 225, 300], [1, 1.30, 2.00, 3.50, 5.50], { clamp: true });
    }
    return fmTransform(sy, [0, 70, 140, 210, 280], [1, 1.07, 1.30, 3.50, 8.00], { clamp: true });
  });

  /* Arrow: scala lievissima + sparisce presto */
  const arrowScale = useTransform(() => {
    const sy  = scrollY.get();
    const mob = typeof window !== 'undefined' && window.innerWidth < 768;
    return fmTransform(sy, [0, mob ? 90 : 50], [1, 1.05], { clamp: true });
  });

  const arrowOpacity = useTransform(() => {
    const sy        = scrollY.get();
    const mob       = typeof window !== 'undefined' && window.innerWidth < 768;
    const fadeStart = mob ? 50  : 25;
    const fadeEnd   = mob ? 150 : 80;
    const scrollFade = sy <= fadeStart ? 1 : fmTransform(sy, [fadeStart, fadeEnd], [1, 0], { clamp: true });
    return arrowOpacityEntrance.get() * scrollFade;
  });


  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isScrolled     = window.scrollY > 0;

    /* ── STAND + ARROW ENTRANCE (Framer Motion) ── */
    let entranceTimeout: ReturnType<typeof setTimeout> | null = null;
    let arrowEntranceTimeout: ReturnType<typeof setTimeout> | null = null;
    if (prefersReduced || isScrolled) {
      standOpacityEntrance.set(1);
      standY.set(0);
      arrowOpacityEntrance.set(1);
    } else {
      /* Stand appare 300 ms dopo heroContent (che inizia a t=1.1 s) */
      entranceTimeout = setTimeout(() => {
        animate(standOpacityEntrance, 1, { duration: 1.0, ease: [0.23, 1, 0.32, 1] });
        animate(standY,               0, { duration: 1.0, ease: [0.23, 1, 0.32, 1] });
      }, 1400);
      /* Freccia appare dopo lo stand */
      arrowEntranceTimeout = setTimeout(() => {
        animate(arrowOpacityEntrance, 1, { duration: 0.7, ease: [0.23, 1, 0.32, 1] });
      }, 1900);
    }

    /* ── REDUCED MOTION ── */
    if (prefersReduced) {
      gsap.set(['#nav', '#heroContent'], { opacity: 1, y: 0 });
      return () => {
        if (entranceTimeout !== null) clearTimeout(entranceTimeout);
        if (arrowEntranceTimeout !== null) clearTimeout(arrowEntranceTimeout);
      };
    }

    /* ── POWER-ON ENTRANCE ─────────────────────────────────────────────── */
    gsap.set('#nav',         { opacity: 0, y: -12 });
    gsap.set('#heroContent', { opacity: 0, y: 40  });

    if (isScrolled) {
      gsap.set('#nav',         { opacity: 1, y: 0 });
      gsap.set('#heroContent', { opacity: 1, y: 0 });
    } else {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('#nav',         { opacity: 1, y: 0, duration: 0.9 }, 0)
        .to('#heroContent', { opacity: 1, y: 0, duration: 1.0 }, 1.1);
    }

    /* ── SCROLL ZOOM ── */
    const tl = gsap.timeline({ paused: true })
      .to(contentRef.current,      { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in' }, 0)
      .to(scrollCueRef.current,    { opacity: 0, duration: 0.25, ease: 'power1.in' }, 0)
      .to(mallBgRef.current,       { scale: 1.10, opacity: 0.3, duration: 1, ease: 'none' }, 0)
      .to(whiteOverlayRef.current, { opacity: 1, duration: 0.6, ease: 'power2.in' }, 0.40);

    /* Pin termina quando lo stand riempie lo schermo */
    const pinDist = window.innerWidth < 768 ? 300 : 280;

    const st = ScrollTrigger.create({
      trigger:   heroRef.current,
      start:     'top top',
      end:       `+=${pinDist}`,
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
    arrowRef.current?.addEventListener('click', scrollToNext);

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
      if (arrowEntranceTimeout !== null) clearTimeout(arrowEntranceTimeout);
      st.kill();
      tl.kill();
      window.removeEventListener('scroll', onNavScroll);
      arrowRef.current?.removeEventListener('click', scrollToNext);
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mediavisual-trasp.png" alt="Mediavisual" className="nav-logo-img" />
        </a>
        <ul className="nav-links">
          <li><a href="/servizi">Servizi</a></li>
          <li><a href="/realizzazioni">Realizzazioni</a></li>
          <li><a href="/chi-siamo">Chi Siamo</a></li>
          <li><a href="/contatti">Contatti</a></li>
        </ul>
        <a href="/contatti" className="nav-btn">Richiedi Preventivo</a>
        <ThemeToggle />
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

        {/* ── Layer 1: centro commerciale — desktop/mobile responsive ── */}
        <picture>
          <source media="(max-width: 767px)" srcSet="/hero-mall-mobile-full.png" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={mallBgRef}
            src="/hero-mall-desktop.png"
            alt=""
            className="hero-mall-bg"
            aria-hidden="true"
            draggable={false}
          />
        </picture>

        {/* Gradiente scuro sinistra per leggibilità testo */}
        <div className="hero-tint" aria-hidden="true" />

        {/* ── Layer 2: stand + logo brand — gruppo animato con Framer Motion ── */}
        <div className="hero-stand-positioner" aria-hidden="true">
          <motion.div
            className="hero-stand-group"
            style={{ scale: scrollScale, opacity: standOpacityEntrance, y: standY }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-stand-trasp.png"
              alt=""
              className="hero-stand-img hero-stand-img--light"
              draggable={false}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-stand-trasp-dark.png"
              alt=""
              className="hero-stand-img hero-stand-img--dark"
              draggable={false}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mediavisual-trasp.png"
              alt=""
              className="hero-stand-logo"
              draggable={false}
            />
          </motion.div>
        </div>

        {/* ── Freccia scroll: design minimale per stand pubblicitario ── */}
        <motion.button
          ref={arrowRef}
          type="button"
          className="hero-arrow-down"
          aria-label="Scorri alla sezione successiva"
          style={{ scale: arrowScale, opacity: arrowOpacity, x: '-50%' }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="1.5" />
            <polyline points="15,21 25,31 35,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

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

            <h1 className="hero-headline">
              il tuo brand,<br />
              <em>al centro dell&apos;attenzione.</em>
            </h1>

            <div className="hero-cta-row">
              <a href="/contatti" className="cta-primary">
                <span>Richiedi un Progetto</span>
                <span className="arr" />
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
          <span className="section-eyebrow-text">Cosa Facciamo</span>
        </div>
        <h2 className="section-title">
          Progettiamo e installiamo<br />strutture ad alto impatto visivo.
        </h2>
      </section>

    </div>
  );
}
