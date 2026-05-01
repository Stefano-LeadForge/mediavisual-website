'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

export default function TerminiPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.inner-hero-eyebrow',  { opacity: 1, y: 0, duration: 0.7 })
      .to('.inner-hero-title',    { opacity: 1, y: 0, duration: 0.9 }, '-=0.45')
      .to('.inner-hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
      .from('.legal-content',     { opacity: 0, y: 20, duration: 0.6 }, '-=0.4');
    return () => { tl.kill(); };
  }, []);

  return (
    <main className="legal-page">

      <section className="inner-hero">
        <div className="inner-hero-eyebrow">
          <span className="inner-hero-eyebrow-line" />
          <span className="inner-hero-eyebrow-text">Informativa legale</span>
        </div>
        <h1 className="inner-hero-title">Termini e Condizioni</h1>
        <p className="inner-hero-subtitle">
          Condizioni generali di utilizzo del sito web e di fornitura dei
          servizi da parte di Mediavisual.
        </p>
      </section>

      <section className="legal-content">
        <p className="legal-placeholder">Documento in fase di redazione.</p>
      </section>

    </main>
  );
}
