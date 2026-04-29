'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';

const ease = [0.16, 1, 0.3, 1] as const;

const NAV_CARDS = [
  {
    href: '/portfolio/vendite',
    src: '/copertina-vendita.png',
    alt: 'Immobili in vendita Milano',
    label: 'Residenziale',
    line1: 'Immobili in',
    line2: 'Vendita',
    cta: 'Sfoglia gli immobili',
    delay: 0.1,
  },
  {
    href: '/portfolio/affitti',
    src: '/copertina-affitto.png',
    alt: 'Immobili in affitto Milano',
    label: 'Residenziale',
    line1: 'Immobili in',
    line2: 'Affitto',
    cta: 'Sfoglia gli immobili',
    delay: 0.22,
  },
];

export default function PortfolioContent() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
      .from('.inner-hero-eyebrow', { opacity: 0, y: 16, duration: 0.7 })
      .from('.inner-hero-title',   { opacity: 0, y: 24, duration: 0.9 }, '-=0.45')
      .from('.inner-hero-subtitle',{ opacity: 0, y: 16, duration: 0.8 }, '-=0.55');

    return () => { tl.kill(); };
  }, []);

  return (
    <main className="portfolio-page">
      <div className="inner-hero">
        <div className="inner-hero-eyebrow">
          <div className="inner-hero-eyebrow-line" />
          <span>Le nostre proprietà</span>
        </div>
        <h1 className="inner-hero-title">Portfolio</h1>
        <p className="inner-hero-subtitle">
          Una selezione esclusiva di immobili a Milano — residenze di pregio, attici con terrazza
          e appartamenti di design nelle zone più ambite della città. Scegli la categoria
          che fa per te.
        </p>
      </div>

      <div className="portfolio-nav-wrap">
        <div className="portfolio-grid">
          {NAV_CARDS.map(({ href, src, alt, label, line1, line2, cta, delay }) => (
            <motion.a
              key={href}
              href={href}
              className="portfolio-card"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay, ease }}
            >
              <Image
                className="portfolio-card-img"
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="portfolio-card-overlay" />
              <div className="portfolio-card-content">
                <div className="portfolio-card-label">{label}</div>
                <h2 className="portfolio-card-title">
                  {line1}<br /><em>{line2}</em>
                </h2>
                <span className="portfolio-card-cta">
                  {cta}
                  <span className="arr" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </main>
  );
}
