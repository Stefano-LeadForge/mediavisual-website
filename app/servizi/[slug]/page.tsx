'use client';

import { useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { serviziDetail } from '../data';

export default function ServizioPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug ?? '');
  const servizio = serviziDetail.find((s) => s.id === slug);

  useEffect(() => {
    if (!servizio) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.inner-hero-eyebrow',     { opacity: 0, y: 16, duration: 0.7 })
      .from('.inner-hero-title',       { opacity: 0, y: 24, duration: 0.9 }, '-=0.45')
      .from('.inner-hero-subtitle',    { opacity: 0, y: 16, duration: 0.8 }, '-=0.55')
      .from('.service-description',    { opacity: 0, y: 24, duration: 0.7 }, '-=0.4')
      .from('.service-feature-item',   { opacity: 0, x: -14, duration: 0.45, stagger: 0.07 }, '-=0.45')
      .from('.service-img-placeholder',{ opacity: 0, y: 20, duration: 0.55, stagger: 0.1 }, '-=0.5');

    return () => { tl.kill(); };
  }, [servizio]);

  if (!servizio) notFound();

  return (
    <main className="service-page">

      {/* ── Hero ── */}
      <section className="inner-hero">
        <div className="inner-hero-eyebrow">
          <span className="inner-hero-eyebrow-line" />
          <span className="inner-hero-eyebrow-text">{servizio.eyebrow}</span>
        </div>
        <h1 className="inner-hero-title">{servizio.title}</h1>
        <p className="inner-hero-subtitle">{servizio.subtitle}</p>
      </section>

      {/* ── Descrizione + feature list ── */}
      <section className="service-content-section">
        <div className="service-content-inner">
          <p className="service-description">{servizio.description}</p>
          <ul className="service-features">
            {servizio.features.map((f, i) => (
              <li key={i} className="service-feature-item">
                <span className="service-feature-dot" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Placeholder immagini ── */}
      <section className="service-img-section">
        <div className="service-img-grid">
          <div className="service-img-placeholder service-img-placeholder--large" />
          <div className="service-img-placeholder" />
          <div className="service-img-placeholder" />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="service-cta-section">
        <div className="service-cta-inner">
          <span className="service-cta-label">Lavoriamo insieme</span>
          <div className="service-cta-actions">
            <Link href="/contatti" className="cta-primary">
              <span>Richiedi Preventivo</span>
              <span className="arr" />
            </Link>
            <Link href="/servizi" className="service-back-link">
              ← Tutti i servizi
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
