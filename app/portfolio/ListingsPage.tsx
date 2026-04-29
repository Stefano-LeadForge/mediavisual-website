'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import PropertyCard from '@/components/PropertyCard';
import { fetchAnnunci } from './data';
import type { Annuncio } from '@/components/PropertyCard';

interface Props {
  tipologia: 'vendita' | 'affitto';
  eyebrow: string;
  title: string;
  subtitle: string;
}

export default function ListingsPage({ tipologia, eyebrow, title, subtitle }: Props) {
  const [annunci, setAnnunci] = useState<Annuncio[]>([]);

  useEffect(() => {
    fetchAnnunci(tipologia).then(setAnnunci);
  }, [tipologia]);

  useEffect(() => {
    if (!annunci.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('.property-card', { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
      .from('.inner-hero-eyebrow', { opacity: 0, y: 16, duration: 0.7 })
      .from('.inner-hero-title',   { opacity: 0, y: 24, duration: 0.9 }, '-=0.45')
      .from('.inner-hero-subtitle',{ opacity: 0, y: 16, duration: 0.8 }, '-=0.55');

    gsap.fromTo(
      '.property-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.75, ease: 'power3.out', delay: 0.35 }
    );

    return () => { tl.kill(); };
  }, [annunci.length]);

  return (
    <main className="portfolio-page">
      <div className="inner-hero">
        <div className="inner-hero-eyebrow">
          <div className="inner-hero-eyebrow-line" />
          <span>{eyebrow}</span>
        </div>
        <h1 className="inner-hero-title">{title}</h1>
        <p className="inner-hero-subtitle">{subtitle}</p>
      </div>

      <div className="portfolio-page-grid">
        {annunci.map((annuncio) => (
          <PropertyCard key={annuncio.id} annuncio={annuncio} />
        ))}
      </div>
    </main>
  );
}
