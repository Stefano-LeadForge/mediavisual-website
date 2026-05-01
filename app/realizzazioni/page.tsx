'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

type Categoria = 'tutti' | 'stand' | 'totem' | 'extra';

interface Progetto {
  id: string;
  categoria: Omit<Categoria, 'tutti'>;
  src: string;
  titolo: string;
  luogo: string;
  anno: string;
}

const progetti: Progetto[] = [
  // STAND
  { id: 's1',  categoria: 'stand', src: '/realizzazioni/stand1.webp',  titolo: 'Stand Sportswear Expo',      luogo: 'Milano',            anno: '2024' },
  { id: 's2',  categoria: 'stand', src: '/realizzazioni/stand2.webp',  titolo: 'Allestimento Fashion Week',   luogo: 'Milano',            anno: '2024' },
  { id: 's3',  categoria: 'stand', src: '/realizzazioni/stand3.webp',  titolo: 'Stand Fiera del Mobile',      luogo: 'Salone del Mobile', anno: '2023' },
  { id: 's4',  categoria: 'stand', src: '/realizzazioni/stand4.webp',  titolo: 'Area Promozionale Retail',    luogo: 'Torino',            anno: '2023' },
  { id: 's5',  categoria: 'stand', src: '/realizzazioni/stand5.webp',  titolo: 'Stand Espositivo Brand',      luogo: 'Milano',            anno: '2024' },
  { id: 's6',  categoria: 'stand', src: '/realizzazioni/stand6.webp',  titolo: 'Allestimento B2B Expo',       luogo: 'Bologna',           anno: '2024' },
  { id: 's7',  categoria: 'stand', src: '/realizzazioni/stand7.webp',  titolo: 'Stand Corporate Event',      luogo: 'Roma',              anno: '2023' },
  { id: 's10', categoria: 'stand', src: '/realizzazioni/stand10.webp', titolo: 'Allestimento Trade Show',    luogo: 'Rimini',            anno: '2024' },
  { id: 's11', categoria: 'stand', src: '/realizzazioni/stand11.webp', titolo: 'Stand Fiera Tecnologica',     luogo: 'Milano',            anno: '2023' },
  { id: 's12', categoria: 'stand', src: '/realizzazioni/stand12.webp', titolo: 'Spazio Espositivo Retail',    luogo: 'Firenze',           anno: '2023' },
  { id: 's13', categoria: 'stand', src: '/realizzazioni/stand13.webp', titolo: 'Area Brand Experience',       luogo: 'Torino',            anno: '2024' },
  // TOTEM
  { id: 't1',  categoria: 'totem', src: '/realizzazioni/totem1.webp',  titolo: 'Totem LED Centro Città',      luogo: 'Roma',              anno: '2024' },
  { id: 't2',  categoria: 'totem', src: '/realizzazioni/totem2.webp',  titolo: 'Totem Bifacciale Galleria',   luogo: 'Napoli',            anno: '2024' },
  { id: 't3',  categoria: 'totem', src: '/realizzazioni/totem3.webp',  titolo: 'Insegna Luminosa Flagship',   luogo: 'Milano',            anno: '2023' },
  // EXTRA
  { id: 'e1',  categoria: 'extra', src: '/realizzazioni/extra1.webp',  titolo: 'Segnaletica Centro Comm.',    luogo: 'Genova',            anno: '2024' },
  { id: 'e2',  categoria: 'extra', src: '/realizzazioni/extra2.webp',  titolo: 'Installazione Artistica',     luogo: 'Venezia',           anno: '2024' },
  { id: 'e3',  categoria: 'extra', src: '/realizzazioni/extra3.webp',  titolo: 'Arredo Urbano Brandizzato',   luogo: 'Firenze',           anno: '2023' },
  { id: 'e4',  categoria: 'extra', src: '/realizzazioni/extra4.webp',  titolo: 'Display Vetrina Flagship',    luogo: 'Bologna',           anno: '2023' },
  { id: 'e5',  categoria: 'extra', src: '/realizzazioni/extra5.webp',  titolo: 'Allestimento Showroom',       luogo: 'Milano',            anno: '2024' },
  { id: 'e6',  categoria: 'extra', src: '/realizzazioni/extra6.webp',  titolo: 'Visual Merchandising',        luogo: 'Roma',              anno: '2024' },
  { id: 'e7',  categoria: 'extra', src: '/realizzazioni/extra7.webp',  titolo: 'Progetto Comunicazione',      luogo: 'Torino',            anno: '2023' },
  { id: 'e8',  categoria: 'extra', src: '/realizzazioni/extra8.webp',  titolo: 'Installazione Espositiva',    luogo: 'Bari',              anno: '2023' },
  { id: 'e9',  categoria: 'extra', src: '/realizzazioni/extra9.webp',  titolo: 'Progetto Extra',              luogo: 'Padova',            anno: '2024' },
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
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('categoria');
    if (cat && ['stand', 'totem', 'extra'].includes(cat)) {
      setAttiva(cat as Categoria);
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.inner-hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 })
      .to('.inner-hero-title',   { opacity: 1, y: 0, duration: 0.9 }, '-=0.45')
      .to('.inner-hero-subtitle',{ opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
      .from('.real-filters',     { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
      .from('.real-item',        { opacity: 0, y: 32, duration: 0.6, stagger: 0.07 }, '-=0.3');

    return () => { tl.kill(); };
  }, []);

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
          <span className="inner-hero-eyebrow-text">Il nostro portfolio</span>
        </div>
        <h1 className="inner-hero-title">Realizzazioni</h1>
        <p className="inner-hero-subtitle">
          Ogni progetto è la sintesi di progettazione tecnica, qualità costruttiva
          e identità di brand. Scopri gli allestimenti, i totem e le insegne
          realizzati per spazi commerciali in tutta Italia.
        </p>
      </section>

      {/* ── Galleria ── */}
      <section className="real-gallery-section">

        {/* Filtri: select su mobile */}
        <div className="real-filter-select-wrap">
          <select
            className="real-filter-select"
            value={attiva}
            onChange={(e) => handleFilter(e.target.value as Categoria)}
          >
            {categorie.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <span className="real-filter-select-arrow" />
        </div>

        {/* Filtri: button su desktop */}
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
                <Image
                  src={p.src}
                  alt={p.titolo}
                  fill
                  className="real-item-photo"
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
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
