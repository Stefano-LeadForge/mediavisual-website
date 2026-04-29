'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function ArticoloMercatoPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
      .from('.article-cover',         { opacity: 0, duration: 0.7 })
      .from('.article-cover-content', { opacity: 0, y: 24, duration: 0.9 }, '-=0.25')
      .from('.article-content',       { opacity: 0, y: 28, duration: 1.0 }, '-=0.55');

    return () => { tl.kill(); };
  }, []);

  return (
    <main className="article-page">

      {/* ── COVER ── */}
      <div className="article-cover">
        <Image
          src="/copertina-articolo-mercato.png"
          alt="Mercato Immobiliare Milano 2026"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className="article-cover-gradient" />
        <div className="article-cover-content">
          <span className="article-cover-cat">Mercato</span>
          <h1 className="article-cover-title">
            Come sta evolvendo il mercato immobiliare a Milano nel 2026
          </h1>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="article-content">
        <div className="article-meta-row">
          <span>12 Aprile 2026</span>
          <span className="article-meta-sep">·</span>
          <span>~8 min di lettura</span>
          <span className="article-meta-sep">·</span>
          <a href="/blog" className="article-meta-back">← Torna al blog</a>
        </div>

        <div className="article-text">

          <p className="article-lead">
            Il mercato immobiliare di Milano ha iniziato il 2026 con una base ancora solida.
            I dati più aggiornati disponibili mostrano che il 2025 si è chiuso con prezzi in
            crescita, domanda resiliente e un ritorno di attenzione sia da parte di chi compra
            casa per viverci sia da parte di chi investe. In Lombardia, nel primo semestre 2025,
            le compravendite residenziali sono salite del{' '}
            <strong>9,6%</strong> rispetto allo stesso periodo del 2024 e le quotazioni sono
            aumentate del <strong>4,1%</strong>; la Banca d&apos;Italia segnala inoltre che nel
            2025 in regione si sono consolidati i segnali di ripresa del mercato immobiliare già
            emersi nella seconda metà del 2024.
          </p>

          <p>
            Per Milano città, i portali immobiliari confermano un quadro di valori ancora
            elevati. A marzo 2026, Immobiliare.it rileva un prezzo medio richiesto di{' '}
            <strong>5.645 €/m²</strong> per il residenziale in vendita nel comune di Milano,
            in aumento del <strong>3,27%</strong> su base annua; Idealista, che usa una
            metodologia propria basata sugli annunci pubblicati, indica nello stesso mese{' '}
            <strong>5.192 €/m²</strong>, con una variazione annua del <strong>+4,1%</strong>.
            Questi numeri non descrivono i prezzi effettivi di rogito, ma sono comunque molto
            utili per leggere il sentiment del mercato e il posizionamento dell&apos;offerta.
          </p>

          <h2 className="article-h2">Milano resta una delle città più forti d&apos;Italia</h2>

          <p>
            Un dato particolarmente importante è che Milano continua a distinguersi anche nel
            confronto nazionale. Secondo ISTAT, nel quarto trimestre 2025 i prezzi delle
            abitazioni nei grandi comuni sono cresciuti in modo particolarmente marcato proprio
            a Milano (<strong>+6,3% su base annua</strong>), insieme a Roma. Sempre ISTAT
            segnala che il 2025 ha lasciato in eredità al 2026 un effetto di trascinamento
            positivo del <strong>+1,6%</strong> sui prezzi delle abitazioni in Italia: in
            pratica, il nuovo anno parte già con una base statistica favorevole.
          </p>

          <p>
            Per chi opera nel centro di Milano, e in particolare in un&apos;area come Missori,
            questo significa lavorare in uno dei segmenti più liquidi, riconoscibili e difensivi
            della città. Le zone centrali continuano infatti a concentrare domanda nazionale e
            internazionale, immobili da mettere a reddito, seconde case di pregio e acquisti
            orientati alla conservazione del valore nel tempo. A marzo 2026, Immobiliare.it
            rileva nella zona Centro un prezzo medio richiesto di{' '}
            <strong>11.226 €/m²</strong> in vendita e <strong>31,48 €/m²</strong> al mese in
            affitto; Idealista, per Centro Storico, indica <strong>11.139 €/m²</strong>, con
            un incremento annuo del <strong>7,2%</strong>. Per un&apos;agenzia immobiliare in
            zona Missori, questi numeri rappresentano un riferimento concreto per leggere il
            mercato del cuore di Milano.
          </p>

          <h2 className="article-h2">Perché il mercato sta ancora tenendo</h2>

          <p>
            Ci sono almeno tre fattori che aiutano a capire perché Milano continui a reggere
            meglio di molte altre aree.
          </p>

          <p>
            Il primo è la forza strutturale della città: Milano continua ad attrarre lavoro
            qualificato, capitale, studenti, professionisti, aziende e turismo. Il secondo è
            il lato finanziario: nel 2025 la BCE ha ridotto i tassi di riferimento, portando a
            giugno il tasso sui depositi al <strong>2,00%</strong>, e a marzo 2026 li ha
            lasciati invariati; nello stesso periodo, il costo medio dei nuovi prestiti alle
            famiglie per acquisto abitazione nell&apos;area euro risultava al{' '}
            <strong>3,37%</strong> a febbraio 2026. Non siamo ai livelli ultra-bassi del
            passato, ma rispetto alla fase più dura del rialzo dei tassi il contesto è più
            leggibile. In Lombardia, inoltre, la Banca d&apos;Italia segnala che i mutui per
            l&apos;acquisto di abitazioni hanno accelerato nel 2025.
          </p>

          <p>
            Il terzo fattore è la domanda d&apos;uso e d&apos;investimento. Milano non è una
            città che vive solo di compravendita &quot;prima casa&quot;: qui convivono domanda
            residenziale, investimento, locazione tradizionale, affitto corporate, affitto per
            studenti e formule legate alla mobilità breve e media. Anche il turismo continua a
            sostenere l&apos;attrattività della città: a ottobre 2025 il Comune di Milano ha
            registrato <strong>924.399 arrivi</strong>, in crescita del <strong>7,9%</strong>{' '}
            su ottobre 2024; a novembre 2025 gli arrivi sono stati <strong>784.608</strong>,
            ancora in aumento del <strong>3,8%</strong> anno su anno.
          </p>

          <h2 className="article-h2">
            Cosa cambia per chi vuole comprare casa a Milano nel 2026
          </h2>

          <p>
            Per chi compra, il 2026 non sembra un anno &quot;facile&quot;, ma può essere un
            anno più razionale. I prezzi restano alti, soprattutto nelle zone centrali e ben
            collegate, però il mercato appare meno drogato dall&apos;urgenza rispetto ad alcune
            fasi passate. Chi compra oggi tende a selezionare meglio:{' '}
            <strong>
              posizione, stato dell&apos;immobile, efficienza energetica, qualità del contesto
              e potenziale di rivendita
            </strong>{' '}
            contano più di prima.
          </p>

          <p>
            Questo favorisce gli immobili che hanno almeno una di queste caratteristiche:
            indirizzo forte, vicinanza a servizi e metropolitana, taglio funzionale, piano e
            luminosità, spazi esterni, ristrutturazione recente oppure possibilità chiara di
            valorizzazione. In un&apos;area come Missori, la vicinanza al Duomo, alla M3, alle
            università, agli uffici e ai poli commerciali continua a sostenere la domanda di
            prodotto centrale di qualità. I dati disponibili non suggeriscono un raffreddamento
            brusco: suggeriscono piuttosto un mercato ancora selettivo, ma attivo.
          </p>

          <h2 className="article-h2">Cosa cambia per chi vuole vendere</h2>

          <p>
            Per chi vende, il 2026 premia soprattutto il{' '}
            <strong>prezzo giusto e la presentazione corretta</strong>. In una città dove i
            valori medi sono cresciuti, molti proprietari rischiano di sopravvalutare il proprio
            immobile. Ma un prezzo iniziale troppo alto tende ancora a penalizzare il tempo di
            vendita, la qualità dei contatti e la forza negoziale nella fase finale.
          </p>

          <p>
            Oggi vendere bene a Milano significa fare tre cose:{' '}
            <strong>
              leggere il micro-mercato reale, posizionare l&apos;immobile in modo credibile e
              costruire una commercializzazione forte online
            </strong>
            . Questo vale ancora di più nel centro storico, dove ogni strada, esposizione,
            stabile e taglio può spostare molto il valore percepito. I numeri medi sono utili
            per orientarsi, ma non sostituiscono una valutazione professionale.
            Un&apos;agenzia radicata in zona, come nel caso di Missori, ha un vantaggio concreto
            proprio nella lettura delle differenze che il dato medio non vede.
          </p>

          <h2 className="article-h2">E per gli investitori?</h2>

          <p>
            Per chi investe, Milano resta uno dei mercati più interessanti d&apos;Italia, ma
            richiede più attenzione rispetto al passato. La logica &quot;compro qualsiasi cosa
            e metto a reddito&quot; oggi funziona molto meno. Conta di più il tipo di domanda
            che l&apos;immobile intercetta: residenziale stabile, studenti, manager, turisti,
            clientela internazionale o lavoratori temporanei.
          </p>

          <p>
            Sul fronte delle locazioni brevi, va considerato anche il quadro normativo: il
            Codice Identificativo Nazionale (<strong>CIN</strong>) è diventato obbligatorio dal{' '}
            <strong>1° gennaio 2025</strong> per le strutture turistico-ricettive e per gli
            immobili destinati a locazione breve o turistica. Chi investe deve quindi ragionare
            non solo sul rendimento potenziale, ma anche sulla compliance normativa e sulla
            sostenibilità operativa del modello scelto.
          </p>

          <h2 className="article-h2">La vera domanda: dove sta andando Milano?</h2>

          <p>
            La direzione, oggi, è abbastanza chiara: Milano non sembra avviarsi verso un crollo,
            ma verso una fase di <strong>crescita più selettiva</strong>. I dati ufficiali e i
            principali indicatori disponibili fino alla primavera 2026 raccontano un mercato
            ancora dinamico, con prezzi sostenuti, domanda presente e centralità delle zone
            premium. Allo stesso tempo, il mercato è più maturo: chi compra è più attento, chi
            investe è più analitico, chi vende deve essere più preciso.
          </p>

          <p>
            Per questo nel 2026 la differenza non la farà solo &quot;essere a Milano&quot;, ma
            essere nel punto giusto di Milano, con il prodotto giusto e con una strategia
            giusta. Ed è proprio qui che una consulenza locale fa la differenza: in una zona
            come Missori, dove il centro storico incontra mobilità, servizi, business e valore
            patrimoniale, leggere bene il mercato significa prendere decisioni migliori, sia in
            acquisto sia in vendita.
          </p>

          <hr className="article-hr" />

          <span className="article-conclusion-label">Conclusione</span>

          <p>
            Il mercato immobiliare milanese nel 2026 sta evolvendo lungo una linea chiara:{' '}
            <strong>meno improvvisazione, più selezione, ma ancora fondamentali robusti</strong>.
            Prezzi in crescita, domanda viva, centro storico forte e mutui tornati più gestibili
            stanno mantenendo alta l&apos;attenzione su Milano. Per chi vuole comprare, vendere
            o investire, questo non è il momento di muoversi a caso: è il momento di leggere
            bene i dati, il quartiere e il singolo immobile.
          </p>

          <hr className="article-hr" />

        </div>
      </div>

    </main>
  );
}
