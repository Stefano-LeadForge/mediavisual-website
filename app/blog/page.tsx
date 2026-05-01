'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const ease = [0.16, 1, 0.3, 1] as const;

const ARTICLES = [
  {
    id: 1,
    href: '/blog',
    category: 'Guide',
    date: 'Aprile 2026',
    title: 'Come scegliere il totem pubblicitario giusto per il tuo spazio',
    excerpt:
      'Formato, materiali, retroilluminazione: i criteri tecnici ed estetici per scegliere la struttura che si adatta meglio al tuo centro commerciale o showroom.',
    delay: 0,
  },
  {
    id: 2,
    href: '/blog',
    category: 'Fiere',
    date: 'Marzo 2026',
    title: "Stand fieristici: come massimizzare l'impatto visivo in 6 m²",
    excerpt:
      "Struttura, grafica, illuminazione: come progettare uno stand espositivo che cattura l'attenzione e comunica il brand anche in spazi contenuti.",
    delay: 0.1,
  },
  {
    id: 3,
    href: '/blog',
    category: 'Digital Signage',
    date: 'Marzo 2026',
    title: 'Digital signage nei centri commerciali: dati e opportunità',
    excerpt:
      'I display digitali aumentano il tempo di permanenza dei visitatori e permettono di aggiornare i contenuti promozionali in tempo reale. Ecco i numeri.',
    delay: 0.2,
  },
];

export default function BlogPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.inner-hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 })
      .to('.inner-hero-title',   { opacity: 1, y: 0, duration: 0.9 }, '-=0.45')
      .to('.inner-hero-subtitle',{ opacity: 1, y: 0, duration: 0.8 }, '-=0.55');
    return () => { tl.kill(); };
  }, []);

  return (
    <main className="blog-page">

      <section className="inner-hero">
        <div className="inner-hero-eyebrow">
          <span className="inner-hero-eyebrow-line" />
          <span className="inner-hero-eyebrow-text">News e approfondimenti</span>
        </div>
        <h1 className="inner-hero-title">Blog</h1>
        <p className="inner-hero-subtitle">
          Aggiornamenti dal settore, casi studio e approfondimenti su
          comunicazione visiva, allestimenti espositivi e digital signage.
        </p>
      </section>

      <section className="blog-grid-section">
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
                <div className="blog-thumb-placeholder" />
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
      </section>

    </main>
  );
}
