'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/components/SmoothScrolling';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export default function HomePage() {
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const lenisCtx     = useLenis();
  const lenisRef     = useRef(lenisCtx);
  lenisRef.current   = lenisCtx; // sempre aggiornato nelle closure dell'effect

  useEffect(() => {
    const scrollCue = scrollCueRef.current;
    if (!scrollCue) return;
    const cue = scrollCue;

    /* ── REDUCED MOTION: salta tutte le animazioni ── */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(['#nav', '#eyebrow', '#title', '#ctas'], {
        opacity: 1, y: 0, scaleY: 1, clearProps: 'transform',
      });
      cue.classList.add('visible');
      return;
    }

    /* ── STATO INIZIALE GSAP ────────────────────────────────────────────
       GSAP possiede tutti i transform degli elementi hero.
       Non impostare transform via CSS su questi elementi — conflitterebbe.
       Questi set() definiscono la posizione di partenza dell'animazione.
    ─────────────────────────────────────────────────────────────────── */
    gsap.set('#nav',      { opacity: 0, y: -12 });
    gsap.set('#eyebrow',  { opacity: 0, y: 60 });
    gsap.set('#title',    { opacity: 0, y: 80, scaleY: 0.92, transformOrigin: 'bottom center' });
    gsap.set('#ctas',     { opacity: 0, y: 40 });
    gsap.set('#scanline', { y: 0, opacity: 0 });

    const isScrolled = window.scrollY > 0;

    if (isScrolled) {
      /* ── RELOAD SCROLLATO: salta l'animazione, imposta lo stato finale ── */
      gsap.set('#nav',       { opacity: 1, y: 0 });
      gsap.set('#eyebrow',   { opacity: 1, y: 0 });
      gsap.set('#title',     { opacity: 1, y: 0, scaleY: 1 });
      gsap.set('#ctas',      { opacity: 1, y: 0 });
      cue.classList.add('visible');
    } else {
      /* ═══════════════════════════════════════════════════════════════════
         POWER-ON SEQUENCE — "schermo LED che si accende"

         Fasi:
           0.0s  → 0.9s : Nav scende dall'alto (frame primo)
           0.2s  → 1.4s : Scanline scorre dall'alto in basso (effetto CRT)
           1.0s  → 1.9s : Eyebrow si eleva (totem che sale)
           1.15s → 2.2s : Titolo si eleva con scaleY (struttura che si estende)
           1.45s → 2.2s : CTA group appare
           2.2s         : Scroll cue diventa visibile

         ── COME MODIFICARE ──
         Timing: cambia il valore float (offset) alla fine di ogni .to()
         Easing entrée: power3.out = morbido-fisico; power4.out = più drammatico
         Scanline: modifica height/box-shadow in globals.css → .hero-scanline
         Elevation: modifica scaleY (0.92 = sottile, 0.75 = drammatico)
         Per rimuovere la scanline: elimina il blocco SCANLINE qui sotto
           e il div .hero-scanline nel JSX.
      ═══════════════════════════════════════════════════════════════════ */
      const powerOn = gsap.timeline({ defaults: { ease: 'power3.out' } });

      powerOn
        /* NAV — prima cosa visibile, scende da sopra */
        .to('#nav', { opacity: 1, y: 0, duration: 0.9 }, 0)

        /* ── SCANLINE: wipe CRT top → bottom ── */
        .to('#scanline', { opacity: 1, duration: 0.05 }, 0.2)
        .to('#scanline', { y: '100vh', duration: 1.2, ease: 'power2.inOut' }, 0.2)
        .to('#scanline', { opacity: 0, duration: 0.08 }, 1.38)

        /* EYEBROW — si eleva come un pannello montato */
        .to('#eyebrow', { opacity: 1, y: 0, duration: 0.9 }, 1.0)

        /* TITOLO — struttura che si estende verticalmente (scaleY) */
        .to('#title', { opacity: 1, y: 0, scaleY: 1, duration: 1.1, ease: 'power3.out' }, 1.15)

        /* CTA — ultimo, leggero */
        .to('#ctas', { opacity: 1, y: 0, duration: 0.7 }, 1.45)

        /* SCROLL CUE — dopo che tutto si è assestato */
        .add(() => { cue.classList.add('visible'); }, 2.2);
    }

    /* ── NAV: trasparente → solido dopo 50px di scroll ── */
    const navEl = document.getElementById('nav');
    function onNavScroll() {
      navEl?.classList.toggle('nav--solid', window.scrollY > 50);
    }
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();

    /* ── SCROLL CUE: si nasconde allo scroll ── */
    function onCueScroll() {
      if (window.scrollY > 20) cue.classList.remove('visible');
    }
    window.addEventListener('scroll', onCueScroll, { passive: true });

    /* ── SCROLL TO NEXT: clic sulla scroll-arrow ── */
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
      window.removeEventListener('scroll', onCueScroll);
      document.getElementById('ctaScroll')?.removeEventListener('click', scrollToNext);
      hamburgerEl?.removeEventListener('click', onHamburgerClick);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="home-page">
      {/* ══ NAV — fixed, fuori da heroWrap per position:fixed corretto ══ */}
      <nav id="nav">
        {/* Wordmark testuale — sostituire con logo SVG quando disponibile */}
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
      <div
        className="mobile-menu"
        id="mobileMenu"
        style={{ pointerEvents: 'none', opacity: 0 }}
      >
        <ul className="mobile-menu-list">
          <li><a href="/prodotti"  className="mobile-menu-link">Prodotti</a></li>
          <li><a href="/progetti"  className="mobile-menu-link">Progetti</a></li>
          <li><a href="/chi-siamo" className="mobile-menu-link">Chi Siamo</a></li>
          <li><a href="/contatti"  className="mobile-menu-link">Contatti</a></li>
        </ul>
        <div className="mobile-menu-divider" />
        <a href="/contatti" className="mobile-menu-cta-link">Richiedi Preventivo</a>
      </div>

      {/* ══ HERO ═════════════════════════════════════════════════════════
          DOM IDs richiesti dall'engine GSAP — NON rinominare né rimuovere:
          #heroWrap    → container hero
          #eyebrow     → animato dalla Power-On sequence
          #title       → animato dalla Power-On sequence (scaleY elevation)
          #ctas        → animato dalla Power-On sequence
          #scrollCue   → indicatore scroll
          #nextSection → sezione successiva (target dello scroll-arrow)
      ══ */}
      <div className="hero-sticky-wrap" id="heroWrap">

        {/* Sfondo: gradiente industriale + griglia a punti (via CSS ::after) */}
        <div className="hero-bg" />

        {/* ── SCANLINE ─────────────────────────────────────────────────────
            Effetto CRT power-on. GSAP anima y: 0 → 100vh.
            Per rimuovere: elimina questo div e il blocco "SCANLINE" nel useEffect.
            Per cambiare colore/spessore: vedi .hero-scanline in globals.css.
        ─────────────────────────────────────────────────────────────────── */}
        <div className="hero-scanline" id="scanline" aria-hidden="true" />

        {/* ── HERO TEXT LAYER ── */}
        <div className="hero-inner">
          <div className="hero-top">
            <div className="hero-text-block">

              {/* EYEBROW — GSAP: parte da y:60, opacity:0 */}
              <div className="hero-eyebrow" id="eyebrow">
                <div className="eyebrow-line" />
                <span className="eyebrow-text">Totem · Stand · Display</span>
              </div>

              {/* TITOLO — GSAP: parte da y:80, scaleY:0.92, opacity:0
                  <em> forza il line-break e colora il secondo verso in accent.
                  Per cambiare il copy: modifica solo il testo dentro i tag. */}
              <h1 className="hero-title" id="title">
                Costruiamo
                <em>Visibilità.</em>
              </h1>

              {/* CTA — GSAP: parte da y:40, opacity:0 */}
              <div className="hero-cta-group" id="ctas">
                <a href="/progetti" className="cta-primary">
                  <span>Scopri i Progetti</span>
                  <span className="arr" />
                </a>
                <a
                  href="#"
                  className="hero-scroll-arrow"
                  id="ctaScroll"
                  aria-label="Scorri per vedere il portfolio"
                >
                  <span className="hero-scroll-arrow-icon" />
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* ── MEDIA CARD ───────────────────────────────────────────────────
            Si espande da pannello flottante → fullscreen con lo scroll.
            Desktop: posizionato al centro-destra (left:58%).
            Mobile:  metà inferiore del viewport.
            SOSTITUIRE hero.jpg con un'immagine di totem/LED wall reale.
        ─────────────────────────────────────────────────────────────────── */}
        <div className="media-expand-wrap" id="mediaCard">
          {/* Vignette bordi — effetto "pannello incassato" */}
          <div className="media-overlay" id="imgOverlay" />

          {/* Wall text — visibile quando l'hero è a fullscreen */}
          <div className="nh360-wall-text" id="wallText">
            <span className="nh360-wall-title">
              I Tuoi Spazi<br />Parlano.
            </span>
            <span className="nh360-wall-sub">
              Soluzioni Display · Dal Progetto all&apos;Installazione
            </span>
            <a href="/contatti" className="nh360-wall-btn">
              <span>Inizia il Progetto</span>
              <span className="arr" />
            </a>
          </div>
        </div>

        {/* Indicatore scroll */}
        <div className="scroll-cue" id="scrollCue" ref={scrollCueRef}>
          <span className="scroll-cue-text">Scorri</span>
          <div className="scroll-cue-line" />
        </div>

      </div>
      {/* /hero sticky */}

      {/* ══ PRIMA SEZIONE ══════════════════════════════════════════════════
          #nextSection è il DOM trigger per l'animazione di uscita dell'hero.
          Deve esistere nel DOM anche se è vuoto — non rimuoverlo.
          Inserire qui le sezioni di contenuto (prodotti, progetti, CTA, ecc.)
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
