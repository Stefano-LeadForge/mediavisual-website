'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';

const ease = [0.16, 1, 0.3, 1] as const;

const ARTICLES = [
  {
    id: 1,
    href: '/blog/mercato-immobiliare-milano-2026',
    src: '/copertina-articolo-mercato.png',
    alt: 'Mercato Immobiliare Milano',
    category: 'Mercato',
    date: '12 Aprile 2026',
    title: 'Come sta evolvendo il mercato immobiliare a Milano nel 2026',
    excerpt:
      "Un'analisi approfondita delle tendenze attuali, dei prezzi per zona e delle opportunità per chi vuole comprare o vendere casa nel capoluogo lombardo.",
    delay: 0,
  },
  {
    id: 2,
    href: '/blog',
    src: '/copertina-articolo-bnb.png',
    alt: 'Affitti Brevi Milano',
    category: 'Affitti Brevi',
    date: '28 Marzo 2026',
    title: 'Affitti brevi: guida completa per massimizzare i tuoi ricavi',
    excerpt:
      'Tutto quello che devi sapere per gestire il tuo immobile su Airbnb e Booking: dalle fotografie professionali al pricing dinamico.',
    delay: 0.1,
  },
  {
    id: 3,
    href: '/blog',
    src: '/copertina-articolo-valutazione.png',
    alt: 'Valutazione Immobiliare',
    category: 'Guida',
    date: '10 Marzo 2026',
    title: 'Come valutare correttamente il prezzo della tua casa',
    excerpt:
      "I criteri che usano i professionisti per stimare il valore di un immobile: posizione, stato, metratura e i dati reali del mercato locale.",
    delay: 0.2,
  },
];

export default function BlogPage() {
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
    <main className="blog-page">
      <div className="inner-hero">
        <div className="inner-hero-eyebrow">
          <div className="inner-hero-eyebrow-line" />
          <span>Aggiornamenti e consigli</span>
        </div>
        <h1 className="inner-hero-title">Blog</h1>
        <p className="inner-hero-subtitle">
          Analisi approfondite, tendenze di mercato e guide pratiche redatte dai nostri
          consulenti per orientarti nel settore immobiliare milanese.
        </p>
      </div>

      <div className="blog-page-grid">
        <div className="blog-grid">
          {ARTICLES.map((article) => (
            <motion.a
              key={article.id}
              href={article.href}
              className="blog-card"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.9, delay: article.delay, ease }}
            >
              <div className="blog-thumb">
                <Image
                  src={article.src}
                  alt={article.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <span className="blog-category">{article.category}</span>
              </div>
              <div className="blog-body">
                <div className="blog-date">{article.date}</div>
                <h2 className="blog-card-title">{article.title}</h2>
                <p className="blog-excerpt">{article.excerpt}</p>
                <span className="blog-read-more">
                  Leggi l&apos;articolo <span className="arr" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </main>
  );
}
