'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const ease = [0.16, 1, 0.3, 1] as const;

export default function ValutaCasaPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefono: '',
    indirizzo: '',
    note: '',
  });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
      .from('.inner-hero-eyebrow', { opacity: 0, y: 16, duration: 0.7 })
      .from('.inner-hero-title',   { opacity: 0, y: 24, duration: 0.9 }, '-=0.45')
      .from('.inner-hero-subtitle',{ opacity: 0, y: 16, duration: 0.8 }, '-=0.55');

    return () => { tl.kill(); };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/valutazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Errore durante l\'invio. Riprova più tardi.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Errore di rete. Controlla la connessione e riprova.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="valuta-page">
      <div className="inner-hero">
        <div className="inner-hero-eyebrow">
          <div className="inner-hero-eyebrow-line" />
          <span>Consulenza gratuita</span>
        </div>
        <h1 className="inner-hero-title">Valuta la tua casa</h1>
        <p className="inner-hero-subtitle">
          Un&apos;analisi professionale e riservata del tuo immobile, condotta dai nostri
          esperti. Gratuita, senza impegno, con dati reali di mercato.
        </p>
      </div>

      <div className="valuta-form-section">
        {submitted ? (
          <motion.div
            className="valuta-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="valuta-success-icon" />
            <h2 className="valuta-success-title">Richiesta inviata</h2>
            <p className="valuta-success-text">
              Ti contatteremo entro 24 ore per fissare la tua valutazione gratuita.
            </p>
          </motion.div>
        ) : (
          <motion.form
            className="valuta-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
          >
            <div className="valuta-row">
              <div className="valuta-field">
                <label className="valuta-label" htmlFor="nome">Nome e Cognome</label>
                <input
                  id="nome" name="nome" type="text"
                  className="valuta-input"
                  placeholder="Mario Rossi"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="valuta-field">
                <label className="valuta-label" htmlFor="telefono">Telefono</label>
                <input
                  id="telefono" name="telefono" type="tel"
                  className="valuta-input"
                  placeholder="+39 02 0000000"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="valuta-field">
              <label className="valuta-label" htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email"
                className="valuta-input"
                placeholder="mario@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="valuta-field">
              <label className="valuta-label" htmlFor="indirizzo">
                Indirizzo dell&apos;immobile
              </label>
              <input
                id="indirizzo" name="indirizzo" type="text"
                className="valuta-input"
                placeholder="Via Roma 1, Milano"
                value={form.indirizzo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="valuta-field">
              <label className="valuta-label" htmlFor="note">
                Note aggiuntive{' '}
                <em style={{ opacity: 0.5, fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>
                  (facoltativo)
                </em>
              </label>
              <textarea
                id="note" name="note"
                className="valuta-textarea"
                placeholder="Tipologia dell'immobile, metratura, eventuale urgenza..."
                value={form.note}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div>
              {error && (
                <p className="valuta-error">{error}</p>
              )}
              <button type="submit" className="valuta-submit" disabled={loading}>
                <span>{loading ? 'Invio in corso…' : 'Richiedi la valutazione'}</span>
                {!loading && <span className="arr" />}
              </button>
              <span className="valuta-submit-note">* gratuita e senza impegno</span>
            </div>
          </motion.form>
        )}
      </div>
    </main>
  );
}
