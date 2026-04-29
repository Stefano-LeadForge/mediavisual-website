'use client';

import { useEffect, useRef } from 'react';
import { getImageProps } from 'next/image';
import { useLenis } from '@/components/SmoothScrolling';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Computed once at module level — avoids re-running on every render
// SOSTITUIRE i path con le immagini hero del progetto
const { props: heroDesktopProps } = getImageProps({
  src: '/hero.jpg',
  alt: 'Hero image',
  width: 1920,
  height: 1080,
  sizes: '100vw',
  quality: 80,
  priority: true,
});
const { props: heroMobileProps } = getImageProps({
  src: '/hero-mobile.png',
  alt: 'Hero image mobile',
  width: 828,
  height: 1792,
  sizes: '100vw',
  quality: 75,
  priority: true,
});

export default function HomePage() {
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const lenisCtx = useLenis();
  const lenisRef = useRef(lenisCtx);
  lenisRef.current = lenisCtx; // always current inside effect closures

  useEffect(() => {
    const scrollCue = scrollCueRef.current;
    if (!scrollCue) return;
    const cue = scrollCue; // const alias — TS can't narrow refs through closures

    /* ── REDUCED MOTION: skip all animations ── */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(['#nav', '#eyebrow', '#title', '#ctas', '#mediaCard'], {
        opacity: 1, y: 0, clearProps: 'transform',
      });
      cue.classList.add('visible');
      return;
    }

    /* ── ENTRANCE or IMMEDIATE SET depending on initial scroll ── */
    const isScrolled = window.scrollY > 0;

    if (isScrolled) {
      gsap.set('#nav',       { opacity: 1, y: 0 });
      gsap.set('#eyebrow',   { opacity: 1, y: 0 });
      gsap.set('#title',     { opacity: 1, y: 0 });
      gsap.set('#ctas',      { opacity: 1, y: 0 });
      gsap.set('#mediaCard', { opacity: 1 });
      cue.classList.add('visible');
    } else {
      const enter = gsap.timeline({ defaults: { ease: 'power3.out' } });
      enter
        .to('#nav',       { opacity: 1, y: 0, duration: 0.9 })
        .to('#eyebrow',   { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
        .to('#title',     { opacity: 1, y: 0, duration: 1.0 }, '-=0.5')
        .to('#ctas',      { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to('#mediaCard', { opacity: 1, duration: 0.6 }, '-=0.3')
        .to('#scrollCue', { opacity: 1, duration: 0.5 }, '-=0.1');
      enter.add(() => { cue.classList.add('visible'); }, '+=0.3');
    }

    /* ═══════════════════════════════════════════════════
       SCROLL MEDIA EXPANSION — responsive via matchMedia
       Desktop: card centered in right half → fullscreen
       Mobile:  card in lower half → fullscreen
    ═══════════════════════════════════════════════════ */
    const card       = document.getElementById('mediaCard');
    const imgOverlay = document.getElementById('imgOverlay');
    const wallText   = document.getElementById('wallText');

    const mm = gsap.matchMedia();

    // Card uses .to() so GSAP reads the CSS resting position directly — no risk
    // of conflicting with percent-based transforms (xPercent) that fromTo() can
    // mis-read as pixel offsets when combined with the to-state's x:0/y:0.
    // Text/overlay elements use .fromTo() to lock the at-top from-state explicitly,
    // which fixes the re-entry bug (scrub reverse always restores opacity:1).
    function buildExpandTl(scrub: number, wallDelay: number) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=120%',
          scrub,
          onUpdate: (self) => {
            if (self.progress > 0.02) cue.classList.remove('visible');
            else                      cue.classList.add('visible');
          },
        },
      });

      tl
        /* card expands to fullscreen — .to() reads CSS state safely */
        .to(card, {
          width: '100%', height: '100%',
          top: 0, left: 0,
          xPercent: 0, yPercent: 0,
          x: 0, y: 0,
          borderRadius: 0,
          ease: 'power2.inOut', duration: 0.6, force3D: true,
        }, 0)
        /* dissolve UI — explicit from so reverse always restores to opacity:1 */
        .fromTo('#eyebrow',   { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.35, ease: 'power2.in', force3D: true }, 0)
        .fromTo('#title',     { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.35, ease: 'power2.in', force3D: true }, 0.04)
        .fromTo('#ctas',      { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.28, ease: 'power2.in', force3D: true }, 0.12)
        .fromTo('#scrollCue', { opacity: 1 },        { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0)
        /* overlay settles */
        .fromTo(imgOverlay,   { opacity: 0 },        { opacity: 1, duration: 0.2, ease: 'power1.out' }, 0.6)
        /* wall text once fully fullscreen */
        .fromTo(wallText,     { opacity: 0 },        { opacity: 1, duration: 0.3, ease: 'power2.out' }, wallDelay);

      return () => tl.kill();
    }

    /* desktop: lower scrub matches Lenis lerp timing → consistent feel page-wide */
    mm.add('(min-width: 769px)', () => {
      const cleanupExpand = buildExpandTl(0.5, 0.62);
      const exitTween = gsap.to('#heroWrap', {
        y: () => -window.innerHeight * 0.45,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#nextSection',
          start: 'top bottom',
          end: 'top 55%',
          scrub: 0.4,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });
      return () => { cleanupExpand(); exitTween.kill(); };
    });
    /* mobile: keep original scrub values — mobile feel is already correct */
    mm.add('(max-width: 768px)', () => {
      const cleanupExpand = buildExpandTl(1.5, 0.75);
      const exitTween = gsap.to('#heroWrap', {
        y: () => -window.innerHeight * 0.45,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#nextSection',
          start: 'top bottom',
          end: 'top 55%',
          scrub: 1.0,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });
      return () => { cleanupExpand(); exitTween.kill(); };
    });

    /* ── NAV SOLID BACKGROUND after 50px scroll ── */
    const navEl = document.getElementById('nav');
    function onNavScroll() {
      navEl?.classList.toggle('nav--solid', window.scrollY > 50);
    }
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();

    /* ── RECALC on resize ── */
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    /* ── SCROLL TO FULLSCREEN helper ── */
    function scrollToFullscreen(e: Event) {
      e.preventDefault();
      const target = window.innerHeight * 1.2;
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { duration: 3.6, easing: (x: number) => x });
      } else {
        gsap.to(window, { scrollTo: { y: target, autoKill: false }, duration: 3.6, ease: 'none' });
      }
    }

    const ctaBtn  = document.getElementById('ctaScroll');
    ctaBtn?.addEventListener('click', scrollToFullscreen);

    /* ── MOBILE MENU ── */
    const hamburgerEl   = document.getElementById('hamburger');
    const mobileMenuEl  = document.getElementById('mobileMenu');
    const mobileLinks   = mobileMenuEl ? Array.from(mobileMenuEl.querySelectorAll('a')) : [];
    let menuOpen        = false;

    function openMenu() {
      menuOpen = true;
      hamburgerEl?.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (mobileMenuEl) mobileMenuEl.style.pointerEvents = 'auto';
      gsap.to(mobileMenuEl, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(
        mobileLinks,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out', delay: 0.18 }
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

    const cueTimer = setTimeout(() => { cue.classList.add('visible'); }, 1800);

    return () => {
      mm.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener('scroll', onNavScroll);
      window.removeEventListener('resize', onResize);
      ctaBtn?.removeEventListener('click', scrollToFullscreen);
      hamburgerEl?.removeEventListener('click', onHamburgerClick);
      document.body.style.overflow = '';
      clearTimeout(cueTimer);
    };
  }, []);

  return (
    <div className="home-page">
      {/* Preload mobile hero — React 19 hoists to <head>, browser preload-scans it immediately */}
      <link
        rel="preload"
        as="image"
        media="(max-width: 768px)"
        imageSrcSet={heroMobileProps.srcSet}
        imageSizes="100vw"
        fetchPriority="high"
      />

      {/* ══ FIXED NAV — outside heroWrap so position:fixed works correctly ══ */}
      <nav id="nav">
        <div className="logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-icon" src="/logo.png" alt="Logo" />
          <div className="logo-divider" />
          <div className="logo-text">
            {/* BRAND_NAME */}
            {/* BRAND_TAGLINE */}
          </div>
        </div>
        <ul className="nav-links">
          {/* INSERIRE QUI I LINK DI NAVIGAZIONE DESKTOP */}
          {/* <li><a href="/">Link 1</a></li> */}
          {/* <li><a href="/">Link 2</a></li> */}
        </ul>
        {/* <a href="/" className="nav-btn">CTA_BUTTON</a> */}
        <button className="hamburger" id="hamburger" aria-label="Apri menu">
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      {/* ══ MOBILE MENU OVERLAY ══ */}
      <div className="mobile-menu" id="mobileMenu">
        <ul className="mobile-menu-list">
          {/* INSERIRE QUI I LINK DEL MENU MOBILE */}
          {/* <li><a href="/" className="mobile-menu-link">Link 1</a></li> */}
        </ul>
        <div className="mobile-menu-divider" />
        {/* <a href="/" className="mobile-menu-cta-link">CTA_BUTTON</a> */}
      </div>

      {/* ══ STICKY HERO — struttura richiesta dall'engine GSAP/Lenis ══ */}
      <div className="hero-sticky-wrap" id="heroWrap">

        <div className="hero-bg" />

        {/* HERO TEXT — gli ID #eyebrow, #title, #ctas sono richiesti dall'engine GSAP */}
        <div className="hero-inner">
          <div className="hero-top">
            <div className="hero-text-block">

              {/* INSERIRE QUI L'EYEBROW DEL HERO */}
              {/*
                <div className="hero-eyebrow" id="eyebrow">
                  <div className="eyebrow-line" />
                  <span className="eyebrow-text">EYEBROW_TEXT</span>
                </div>
              */}
              <div className="hero-eyebrow" id="eyebrow" />

              {/* INSERIRE QUI IL TITOLO H1 DEL HERO */}
              {/*
                <h1 className="hero-title" id="title">
                  HERO_HEADLINE
                </h1>
              */}
              <h1 className="hero-title" id="title" />

              <div className="hero-cta-group" id="ctas">
                {/* INSERIRE QUI IL CTA SCROLL ARROW (o altri CTA) */}
                <a href="#" className="hero-scroll-arrow" id="ctaScroll" aria-label="Scorri">
                  <span className="hero-scroll-arrow-icon" />
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* MEDIA EXPANSION — l'ID #mediaCard è richiesto dall'engine GSAP */}
        <div className="media-expand-wrap" id="mediaCard">
          <picture>
            <source media="(max-width: 768px)" srcSet={heroMobileProps.srcSet} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              {...heroDesktopProps}
              decoding="async"
              className="media-img"
              style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
            />
          </picture>
          <div className="media-overlay" id="imgOverlay" />

          {/* WALL TEXT — visibile quando l'hero è a fullscreen; #wallText richiesto dall'engine */}
          <div className="nh360-wall-text" id="wallText">
            {/* INSERIRE QUI IL CONTENUTO WALL TEXT (titolo + sottotitolo + CTA fullscreen) */}
            {/*
              <span className="nh360-wall-title">WALL_TITLE</span>
              <span className="nh360-wall-sub">WALL_SUBTITLE</span>
              <a href="/" className="nh360-wall-btn">
                <span>WALL_CTA_TEXT</span>
                <span className="arr" />
              </a>
            */}
          </div>
        </div>

        {/* SCROLL CUE */}
        <div className="scroll-cue" id="scrollCue" ref={scrollCueRef}>
          <span className="scroll-cue-text">Scorri</span>
          <div className="scroll-cue-line" />
        </div>

      </div>
      {/* /sticky hero */}

      {/* INSERIRE QUI LE SEZIONI DELLA HOME */}
      {/* Creare o importare un componente con le sezioni (portfolio, blog, CTA, ecc.) */}

    </div>
  );
}
