'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const ease = [0.16, 1, 0.3, 1] as const;
const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};


function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="nh360-list">
      {items.map((item, i) => (
        <li key={i} className="nh360-list-item">
          <span className="nh360-list-bullet" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function NextHome360Page() {
  return (
    <main className="nh360-page">

      {/* ── COVER HERO ── */}
      <div className="nh360-cover">
        <Image
          src="/brand_assets/copertina-next-home-360.png"
          alt="Next Home 360 — servizio esclusivo"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.8)' }}
        />
        <div className="nh360-cover-overlay" />
        <div className="nh360-cover-content">
          <span className="nh360-cover-tag">Il nostro servizio esclusivo</span>
          <h1 className="inner-hero-title">
            Next Home 360: <br />
            vendi il tuo immobile mentre genera reddito con gli affitti brevi
          </h1>
          <p className="inner-hero-subtitle">
            Next Home 360 è il servizio esclusivo di Next Home pensato per i proprietari
            che vogliono vendere casa a Milano senza lasciare l&apos;immobile fermo.
          </p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="nh360-content">

        {/* Intro */}
        <div className="nh360-intro">
          <h2 className="nh360-intro-title">
            Come puoi valorizzare al massimo il tuo appartamento mentre è sul mercato?
          </h2>
          <p className="nh360-lead">
            Attraverso una gestione professionale con la formula degli affitti brevi,
            tramite le principali piattaforme come <strong>Airbnb e Booking</strong>,
            trasformiamo il tempo di attesa in un&apos;opportunità concreta di reddito.
          </p>
          <blockquote className="nh360-double-box">
            Il risultato è un <strong>doppio vantaggio</strong>: da un lato l&apos;immobile
            produce entrate, dall&apos;altro può presentarsi sul mercato con un potenziale di
            redditività più alto rispetto a una locazione tradizionale, supportato da un report
            di business chiaro e professionale.
          </blockquote>
        </div>

        {/* ── Un servizio unico ── */}
        <motion.section
          className="nh360-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
        >
          <h2 className="nh360-h2">Un servizio unico tra vendita immobiliare e affitti brevi</h2>
          <p className="nh360-body">
            La maggior parte delle agenzie si occupa di vendita. Altri operatori si occupano di
            short stay. <strong>Next Home 360 unisce entrambe le competenze in un unico servizio.</strong>
          </p>
          <p className="nh360-body">
            Next Home è un&apos;agenzia immobiliare che conosce da vicino sia il mercato delle
            compravendite sia quello degli affitti brevi a Milano, con decine di appartamenti
            attualmente in gestione. Questo ci permette di lavorare su più livelli:
          </p>
          <BulletList items={[
            'valorizzazione commerciale dell\'immobile',
            'posizionamento corretto sul mercato della vendita',
            'ottimizzazione della redditività nel breve periodo',
            'gestione operativa professionale',
            'costruzione di una narrazione più forte anche per il potenziale acquirente',
          ]} />
          <p className="nh360-statement">
            Non stiamo parlando di una teoria.<br />
            Stiamo parlando di un modello già applicato sul campo.
          </p>
        </motion.section>

        {/* ── 5 vantaggi ── */}
        <motion.section
          className="nh360-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.06 }}
        >
          <h2 className="nh360-h2">Perché Next Home 360 aumenta il valore dell&apos;operazione</h2>

          <div className="nh360-advantages">

            <div className="nh360-advantage">
              <span className="nh360-advantage-num">01</span>
              <div>
                <p className="nh360-advantage-title">
                  Il tuo immobile non resta fermo mentre è in vendita
                </p>
                <p className="nh360-advantage-text">
                  Uno degli errori più comuni è lasciare un appartamento inutilizzato per mesi,
                  sostenendo costi senza generare alcun ritorno. Con Next Home 360, il periodo
                  di vendita può diventare un periodo di messa a reddito.
                </p>
              </div>
            </div>

            <div className="nh360-advantage">
              <span className="nh360-advantage-num">02</span>
              <div>
                <p className="nh360-advantage-title">
                  Gli affitti brevi possono aumentare l&apos;attrattività economica dell&apos;immobile
                </p>
                <p className="nh360-advantage-text">
                  Se ben gestito, un appartamento destinato ad affitti brevi può esprimere una
                  redditività più interessante rispetto a un affitto tradizionale. Questo rende
                  l&apos;immobile più appetibile anche per un potenziale investitore, soprattutto
                  in una città come Milano, dove il mercato continua a mostrare forza sia sul
                  lato immobiliare sia su quello turistico.
                </p>
              </div>
            </div>

            <div className="nh360-advantage">
              <span className="nh360-advantage-num">03</span>
              <div>
                <p className="nh360-advantage-title">
                  Puoi mostrare un report di business concreto
                </p>
                <p className="nh360-advantage-text">
                  Uno dei punti più forti del servizio è la possibilità di presentare
                  l&apos;immobile con un report di business che evidenzia andamento, potenziale
                  e logica di redditività. Questo cambia la percezione del bene: non solo casa
                  da acquistare, ma anche asset capace di generare valore.
                </p>
              </div>
            </div>

            <div className="nh360-advantage">
              <span className="nh360-advantage-num">04</span>
              <div>
                <p className="nh360-advantage-title">
                  Il potenziale acquirente può vivere davvero l&apos;esperienza dell&apos;appartamento
                </p>
                <p className="nh360-advantage-text">
                  Un conto è visitare un immobile per pochi minuti. Un altro è sperimentare
                  realmente come si vive dentro quell&apos;appartamento: i volumi, la luce, il
                  comfort, il quartiere, i servizi, l&apos;atmosfera. Quando aumenta la
                  percezione di &quot;casa&quot;, aumenta anche la disponibilità emotiva ed
                  economica a spendere di più.
                </p>
              </div>
            </div>

            <div className="nh360-advantage">
              <span className="nh360-advantage-num">05</span>
              <div>
                <p className="nh360-advantage-title">
                  Hai un solo partner per vendita e gestione short stay
                </p>
                <p className="nh360-advantage-text">
                  Con Next Home 360 non devi coordinare agenzia immobiliare, property manager,
                  consulenti e operatori separati. Hai un solo interlocutore che gestisce
                  strategia, valorizzazione e operatività.
                </p>
              </div>
            </div>

          </div>
        </motion.section>

        {/* ── Milano ── */}
        <motion.section
          className="nh360-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
        >
          <h2 className="nh360-h2">Perché Milano rende questo servizio ancora più interessante</h2>
          <p className="nh360-body">
            Milano resta uno dei mercati più solidi d&apos;Italia, con prezzi delle abitazioni
            in crescita e una domanda ancora forte, specialmente nelle aree centrali e ben
            collegate. ISTAT segnala che nel quarto trimestre 2025 Milano è stata tra i grandi
            comuni con gli aumenti di prezzo più marcati, mentre la Banca d&apos;Italia evidenzia
            per la Lombardia una ripresa del mercato immobiliare già consolidata nel 2025.
          </p>
          <p className="nh360-body">
            Allo stesso tempo, la città continua a esprimere un&apos;elevata attrattività
            turistica, fattore che sostiene il settore degli affitti brevi a Milano. Questo rende
            particolarmente strategico un servizio che combina:
          </p>
          <BulletList items={[
            'vendita appartamento',
            'gestione Airbnb e Booking',
            'massimizzazione del rendimento',
            'valorizzazione dell\'immobile in ottica investimento',
          ]} />
        </motion.section>

        {/* ── Affitti brevi professionali ── */}
        <motion.section
          className="nh360-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
        >
          <h2 className="nh360-h2">Affitti brevi su Airbnb e Booking, ma con gestione professionale</h2>
          <p className="nh360-body">
            Pubblicare un appartamento su Airbnb o Booking non basta. Per ottenere risultati
            servono competenze precise:
          </p>
          <BulletList items={[
            'analisi del potenziale dell\'immobile',
            'pricing dinamico',
            'posizionamento corretto sugli annunci',
            'qualità della presentazione fotografica',
            'gestione operativa',
            'esperienza utente',
            'rispetto delle regole e degli obblighi normativi',
          ]} />
          <p className="nh360-body" style={{ marginTop: '1.5rem' }}>
            Dal <strong>1° gennaio 2025</strong>, il CIN è obbligatorio per gli immobili destinati
            a locazione breve o turistica. Anche questo conferma che oggi gli affitti brevi vanno
            affrontati con un approccio serio, strutturato e professionale.
          </p>
        </motion.section>

        {/* ── A chi è dedicato ── */}
        <motion.section
          className="nh360-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
        >
          <h2 className="nh360-h2">A chi è dedicato Next Home 360</h2>
          <p className="nh360-body">Next Home 360 è pensato per proprietari che vogliono:</p>
          <BulletList items={[
            'vendere un appartamento senza lasciarlo inutilizzato',
            'generare reddito durante il periodo di commercializzazione',
            'aumentare l\'appeal dell\'immobile anche verso investitori',
            'presentare la proprietà con dati economici più forti',
            'affidarsi a un\'agenzia che conosce davvero sia il lato vendita sia il lato affitti brevi',
          ]} />
        </motion.section>

        {/* ── Perché scegliere ── */}
        <motion.section
          className="nh360-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
        >
          <h2 className="nh360-h2">Perché scegliere Next Home</h2>
          <p className="nh360-body">
            Scegliere Next Home 360 significa affidarsi a un&apos;agenzia che non si limita a
            mettere un immobile sul mercato. Significa lavorare con un team che sa:
          </p>
          <BulletList items={[
            'vendere casa a Milano',
            'gestire affitti brevi in modo professionale',
            'valorizzare un appartamento su Airbnb e Booking',
            'trasformare il rendimento in un argomento di vendita più forte',
            'costruire un\'esperienza più convincente per il potenziale acquirente',
          ]} />
          <p className="nh360-statement">
            È questa combinazione che rende Next Home 360 un servizio esclusivo.
          </p>
        </motion.section>

        {/* ── Conclusione ── */}
        <motion.section
          className="nh360-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
        >
          <hr className="nh360-hr" />
          <span className="nh360-conclusion-label">Conclusione</span>
          <p className="nh360-lead">
            Con Next Home 360, il tuo immobile non aspetta semplicemente di essere venduto.
            Nel frattempo può:
          </p>
          <BulletList items={[
            'generare reddito',
            'rafforzare il suo posizionamento',
            'mostrare una redditività più interessante',
            'offrire ai potenziali clienti un\'esperienza reale di vita nell\'appartamento',
            'aumentare il proprio valore percepito',
          ]} />
          <div className="nh360-closer">
            <p>Non è solo un servizio di vendita.</p>
            <p>Non è solo una gestione di affitti brevi.</p>
            <p>È una strategia completa per massimizzare il potenziale del tuo immobile a Milano.</p>
          </div>
        </motion.section>

        {/* ── CTA ── */}
        <motion.div
          className="nh360-cta-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className="nh360-cta-eyebrow">Next Home 360</span>
          <h2 className="nh360-cta-headline">
            Il tuo appartamento è adatto<br />a Next Home 360?
          </h2>
          <p className="nh360-cta-text">
            Richiedi una valutazione riservata con Next Home. Analizziamo insieme
            il potenziale del tuo immobile, sia sul lato vendita sia sul lato affitti brevi.
          </p>
          <a href="/valuta-casa" className="nh360-cta-btn">
            <span>Richiedi una valutazione</span>
            <span className="arr" />
          </a>
          <p className="nh360-cta-micro">* gratuita e senza impegno</p>
        </motion.div>

      </div>
    </main>
  );
}
