'use client';

import { useState, useEffect } from 'react';
import gsap from 'gsap';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const SERVIZI_OPTIONS = [
  'Totem Pubblicitari',
  'Stand Espositivi',
  'Insegne e Segnaletica',
  'Display e Schermi Digitali',
  'Progettazione e Installazione',
  'Altro',
];

export default function ContattiPage() {
  const [form, setForm] = useState({
    nome: '', cognome: '', email: '', telefono: '',
    azienda: '', servizio: '', messaggio: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.inner-hero-eyebrow',  { opacity: 1, y: 0, duration: 0.7 })
      .to('.inner-hero-title',    { opacity: 1, y: 0, duration: 0.9 }, '-=0.45')
      .to('.inner-hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
      .from('.contatti-grid',     { opacity: 0, y: 28, duration: 0.8 }, '-=0.4');
    return () => { tl.kill(); };
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contatti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Errore durante l'invio.");
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('Errore di rete. Riprova più tardi.');
      setStatus('error');
    }
  }

  return (
    <main className="contatti-page">

      {/* ── Hero ── */}
      <section className="inner-hero">
        <div className="inner-hero-eyebrow">
          <span className="inner-hero-eyebrow-line" />
          <span className="inner-hero-eyebrow-text">Parliamo del tuo progetto</span>
        </div>
        <h1 className="inner-hero-title">Richiedi un Preventivo</h1>
        <p className="inner-hero-subtitle">
          Raccontaci le tue esigenze. Il nostro team valuterà il progetto e ti
          risponderà entro 24 ore con un preventivo personalizzato, senza impegno.
        </p>
      </section>

      {/* ── Form section ── */}
      <section className="contatti-form-section">
        <div className="contatti-form-inner">
          <div className="contatti-grid">

            {/* Info laterale */}
            <aside className="contatti-info">
              <div className="contatti-info-block">
                <span className="contatti-info-label">Email</span>
                <a href="mailto:info@mediavisual.it" className="contatti-info-value">
                  info@mediavisual.it
                </a>
              </div>
              <div className="contatti-info-block">
                <span className="contatti-info-label">Telefono</span>
                <a href="tel:+390000000000" className="contatti-info-value">
                  +39 000 000 0000
                </a>
              </div>
              <div className="contatti-info-block">
                <span className="contatti-info-label">Risposta garantita</span>
                <span className="contatti-info-value">Entro 24 ore lavorative</span>
              </div>
            </aside>

            {/* Form */}
            <div className="contatti-form-wrap">
              {status === 'success' ? (
                <div className="contatti-success">
                  <div className="contatti-success-icon">✓</div>
                  <h2 className="contatti-success-title">Messaggio inviato</h2>
                  <p className="contatti-success-text">
                    Grazie per averci contattato. Ti risponderemo entro 24 ore lavorative.
                  </p>
                </div>
              ) : (
                <form className="contatti-form" onSubmit={handleSubmit} noValidate>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nome" className="form-label">
                        Nome <span className="form-req">*</span>
                      </label>
                      <input
                        id="nome" name="nome" type="text" required
                        className="form-input" value={form.nome}
                        onChange={handleChange} placeholder="Mario"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cognome" className="form-label">
                        Cognome <span className="form-req">*</span>
                      </label>
                      <input
                        id="cognome" name="cognome" type="text" required
                        className="form-input" value={form.cognome}
                        onChange={handleChange} placeholder="Rossi"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email <span className="form-req">*</span>
                      </label>
                      <input
                        id="email" name="email" type="email" required
                        className="form-input" value={form.email}
                        onChange={handleChange} placeholder="mario.rossi@azienda.it"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="telefono" className="form-label">Telefono</label>
                      <input
                        id="telefono" name="telefono" type="tel"
                        className="form-input" value={form.telefono}
                        onChange={handleChange} placeholder="+39 333 000 0000"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="azienda" className="form-label">Azienda</label>
                      <input
                        id="azienda" name="azienda" type="text"
                        className="form-input" value={form.azienda}
                        onChange={handleChange} placeholder="Nome azienda (opzionale)"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="servizio" className="form-label">Servizio richiesto</label>
                      <select
                        id="servizio" name="servizio"
                        className="form-input form-select"
                        value={form.servizio} onChange={handleChange}
                      >
                        <option value="">Seleziona…</option>
                        {SERVIZI_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="messaggio" className="form-label">
                      Messaggio <span className="form-req">*</span>
                    </label>
                    <textarea
                      id="messaggio" name="messaggio" required rows={5}
                      className="form-input form-textarea" value={form.messaggio}
                      onChange={handleChange}
                      placeholder="Descrivici il tuo progetto, lo spazio disponibile e le tue necessità…"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="form-error-msg">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    className="form-submit"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Invio in corso…' : 'Invia richiesta'}
                  </button>

                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
