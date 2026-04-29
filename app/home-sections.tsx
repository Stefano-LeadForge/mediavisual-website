'use client';

import { useLenis } from '@/components/SmoothScrolling';

export default function HomeSections() {
  const lenis = useLenis();
  void lenis; // disponibile per scroll programmático (lenis.scrollTo('#sectionId', ...))

  return (
    <>
      {/* ══ HERO EXIT ZONE — 120vh scroll space while hero stays pinned ══ */}
      {/* NON RIMUOVERE: serve all'engine GSAP per il trigger di uscita dell'hero */}
      <div className="hero-exit-zone" />

      {/* ══ PRIMA SEZIONE — l'ID #nextSection è il trigger GSAP per l'exit dell'hero ══ */}
      {/* INSERIRE QUI LA PRIMA SEZIONE */}
      {/*
        <section className="NOME-section" id="nextSection">
          ...
        </section>
      */}

      {/* INSERIRE QUI LA SECONDA SEZIONE */}
      {/*
        <section className="NOME-section" id="NOME-section">
          ...
        </section>
      */}

      {/* INSERIRE QUI LA SEZIONE CTA FINALE */}
      {/*
        <section className="cta-finale" id="ctaFinale">
          ...
        </section>
      */}
    </>
  );
}
