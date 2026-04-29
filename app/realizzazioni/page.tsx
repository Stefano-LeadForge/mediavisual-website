'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

type Categoria = 'tutti' | 'stand' | 'totem' | 'extra';

interface Progetto {
  id: string;
  categoria: Omit<Categoria, 'tutti'>;
  titolo: string;
  luogo: string;
  anno: string;
}

const progetti: Progetto[] = [
  { id: 'p1',  categoria: 'stand',  titolo: 'Stand Sportswear Expo',    luogo: 'Milano',  anno: '2024' },
  { id: 'p2',  categoria: 'stand',  titolo: 'Allestimento Fashion Week', luogo: 'Milano',  anno: '2024' },
  { id: 'p3',  categoria: 'stand',  titolo: 'Stand Fiera del Mobile',    luogo: 'Salone del Mobile', anno: '2023' },
  { id: 'p4',  categoria: 'stand',  titolo: 'Area Promozionale Retail',  luogo: 'Torino',  anno: '2023' },
  { id: 'p5',  categoria: 'totem',  titolo: 'Totem LED Centro Città',    luogo: 'Roma',    anno: '2024' },
  { id: 'p6',  categoria: 'totem',  titolo: 'Totem Bifacciale Galleria', luogo: 'Napoli',  anno: '2024' },
  { id: 'p7',  categoria: 'totem',  titolo: 'Insegna Luminosa Flagship', luogo: 'Milano',  anno: '2023' },
  { id: 'p8',  categoria: 'totem',  titolo: 'Totem Digitale Aeroporto',  luogo: 'Malpensa', anno: '2023' },
  { id: 'p9',  categoria: 'extra',  titolo: 'Segnaletica Centro Comm.',  luogo: 'Genova',  anno: '2024' },
  { id: 'p10', categoria: 'extra',  titolo: 'Installazione Artistica',   luogo: 'Venezia', anno: '2024' },
  { id: 'p11', categoria: 'extra',  titolo: 'Arredo Urbano Brandizzato', luogo: 'Firenze', anno: '2023' },
  { id: 'p12', categoria: 'extra',  titolo: 'Display Vetrina Flagship',  luogo: 'Bologna', anno: '2023' },
];

const categorie: { id: Categoria; label: string }[] = [
  { id: 'tutti',  label: 'Tutti' },
  { id: 'stand',  label: 'Stand' },
  { id: 'totem',  label: 'Totem' },
  { id: 'extra',  label: 'Progetti Extra' },
];

export default function RealizzazioniPage() {
  const [attiva, setAttiva] = useState<Categoria>('tutti');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.inner-hero-eyebrow', { opacity: 0, y: 16, duration: 0.7 })
      .from('.inner-hero-title',   { opacity: 0, y: 24, duration: 0.9 }, '-=0.45')
      .from('.inner-hero-subtitle',{ opacity: 0, y: 16, duration: 0.8 }, '-=0.55')
      .from('.real-filters',       { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
      .from('.real-item',          { opacity: 0, y: 32, duration: 0.6, stagger: 0.07 }, '-=0.3');

    return () => { tl.kill(); };
  }, []);

  /* Animazione griglia al cambio filtro */
  function handleFilter(cat: Categoria) {
    if (cat === attiva) return;
    gsap.to('.real-item', {
      opacity: 0, y: 16, duration: 0.22, stagger: 0.03, ease: 'power2.in',
      onComplete: () => {
        setAttiva(cat);
        gsap.fromTo('.real-item',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out' },
        );
      },
    });
  }

  const visibili = attiva === 'tutti'
    ? progetti
    : progetti.filter((p) => p.categoria === attiva);

  return (
    <main className="real-page">

      {/* ── Hero ── */}
      <section className="inner-hero">
        <div className="inner-hero-eyebrow">
          <span className="inner-hero-eyebrow-line" />
          <span className="inner-hero-eyebrow-text">Portfolio</span>
        </div>
        <h1 className="inner-hero-title">Realizzazioni</h1>
        <p className="inner-hero-subtitle">
          Una selezione dei nostri lavori in tutta Italia: stand, totem, insegne
          e installazioni speciali per brand, centri commerciali e spazi retail.
        </p>
      </section>

      {/* ── Galleria ── */}
      <section className="real-gallery-section">

        {/* Filtri categoria */}
        <div className="real-filters">
          {categorie.map((c) => (
            <button
              key={c.id}
              className={`real-filter-btn${attiva === c.id ? ' is-active' : ''}`}
              onClick={() => handleFilter(c.id)}
              type="button"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Griglia immagini */}
        <div className="real-grid">
          {visibili.map((p) => (
            <div key={p.id} className={`real-item real-item--${p.categoria}`}>
              <div className="real-item-img">
                {/* Placeholder: sostituire con <img src=... /> al ricevimento delle immagini */}
                <div className="real-item-placeholder" />
                <div className="real-item-overlay">
                  <span className="real-item-cat">{p.categoria}</span>
                  <h3 className="real-item-title">{p.titolo}</h3>
                  <p className="real-item-meta">{p.luogo} · {p.anno}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA contatti */}
        <div className="real-cta-row">
          <p className="real-cta-text">Vuoi un progetto simile?</p>
          <a href="/contatti" className="cta-primary">
            <span>Contattaci</span>
            <span className="arr" />
          </a>
        </div>

      </section>
    </main>
  );
}
