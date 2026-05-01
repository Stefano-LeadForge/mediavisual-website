'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

const servizi = [
  {
    id: 'totem',
    eyebrow: 'Comunicazione verticale',
    title: 'Totem Pubblicitari',
    description:
      'Strutture autoportanti ad alto impatto visivo, ideali per ingressi di centri commerciali, showroom e spazi espositivi. Disponibili in diverse altezze e configurazioni — monofacciali, bifacciali o a 360° — con pannelli retroilluminati LED, schermi digitali integrati o superfici grafiche intercambiabili.',
    cta: 'Scopri i totem',
    href: '/servizi/totem',
    accent: '#c8c0b0',
  },
  {
    id: 'stand',
    eyebrow: 'Presenza a pavimento',
    title: 'Stand Espositivi',
    description:
      'Stand modulari e personalizzati per esposizioni temporanee, eventi e punti vendita. Strutture leggere ma solide, montaggio rapido, trasportabili. Perfetti per fiere, showroom e campagne promozionali in-store. Personalizzabili con grafica brandizzata su ogni superficie.',
    cta: 'Scopri gli stand',
    href: '/servizi/stand',
    accent: '#6b8fa3',
  },
  {
    id: 'insegne',
    eyebrow: 'Identità visiva',
    title: 'Insegne e Segnaletica',
    description:
      'Insegne luminose, insegne a plancia, lettere scatolate e segnaletica direzionale per ambienti commerciali e corporate. Progettazione su misura dal disegno alla posa in opera, con attenzione alla normativa vigente e all\'impatto estetico nella struttura ospitante.',
    cta: 'Scopri le insegne',
    href: '/servizi/insegne',
    accent: '#c8c0b0',
  },
  {
    id: 'digital',
    eyebrow: 'Tecnologia LED',
    title: 'Display e Schermi Digitali',
    description:
      'Schermi LED e LCD di grandi dimensioni per vetrine, gallerie commerciali e spazi pubblici. Contenuti gestiti da remoto via CMS dedicato, aggiornabili in tempo reale. Dalla singola postazione a reti multi-schermo sincronizzate. Assistenza tecnica e manutenzione inclusi.',
    cta: 'Scopri i display',
    href: '/servizi/digital',
    accent: '#6b8fa3',
  },
  {
    id: 'progettazione',
    eyebrow: 'Dal concept alla posa',
    title: 'Progettazione e Installazione',
    description:
      'Un servizio chiavi in mano: analisi dello spazio, progettazione tecnica e grafica, produzione, trasporto e posa in opera con personale specializzato. Gestiamo l\'intero processo in modo da ridurre al minimo i tempi di fermo del tuo punto vendita.',
    cta: 'Scopri il servizio',
    href: '/servizi/progettazione',
    accent: '#c8c0b0',
  },
];

export default function ServiziPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.inner-hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 })
      .to('.inner-hero-title',   { opacity: 1, y: 0, duration: 0.9 }, '-=0.45')
      .to('.inner-hero-subtitle',{ opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
      .from('.servizi-card',     { opacity: 0, y: 40, duration: 0.7, stagger: 0.12 }, '-=0.3');

    return () => { tl.kill(); };
  }, []);

  return (
    <main className="servizi-page">

      {/* ── Hero ── */}
      <section className="inner-hero">
        <div className="inner-hero-eyebrow">
          <span className="inner-hero-eyebrow-line" />
          <span className="inner-hero-eyebrow-text">Dal concept alla posa</span>
        </div>
        <h1 className="inner-hero-title">Le Nostre Soluzioni</h1>
        <p className="inner-hero-subtitle">
          Progettiamo e realizziamo sistemi di comunicazione visiva per centri
          commerciali, spazi retail e ambienti corporate. Dall&apos;idea iniziale
          all&apos;installazione finale, ogni progetto è affidato a un team
          specializzato e seguito in ogni fase.
        </p>
      </section>

      {/* ── Card grandi ── */}
      <section className="servizi-grid-section">
        <div className="servizi-grid">
          {servizi.map((s) => (
            <a key={s.id} href={s.href} className="servizi-card" aria-label={s.title}>

              {/* Placeholder immagine */}
              <div className="servizi-card-img-wrap">
                <div className="servizi-card-img-placeholder" />
                <div className="servizi-card-overlay" />
              </div>

              {/* Testo */}
              <div className="servizi-card-body">
                <span className="servizi-card-eyebrow">{s.eyebrow}</span>
                <h2 className="servizi-card-title">{s.title}</h2>
                <p className="servizi-card-desc">{s.description}</p>
                <span className="servizi-card-cta">
                  {s.cta}
                  <span className="servizi-card-arrow" />
                </span>
              </div>

            </a>
          ))}
        </div>
      </section>

      {/* ── CTA finale ── */}
      <section className="servizi-cta-section">
        <div className="servizi-cta-inner">
          <div className="inner-hero-eyebrow" style={{ opacity: 1, transform: 'none' }}>
            <span className="inner-hero-eyebrow-line" />
            <span className="inner-hero-eyebrow-text">Lavoriamo insieme</span>
          </div>
          <h2 className="servizi-cta-title">
            Hai un progetto in mente?
          </h2>
          <p className="servizi-cta-sub">
            Contattaci per un sopralluogo gratuito e un preventivo senza impegno.
          </p>
          <a href="/contatti" className="cta-primary">
            <span>Richiedi Preventivo</span>
            <span className="arr" />
          </a>
        </div>
      </section>

    </main>
  );
}
