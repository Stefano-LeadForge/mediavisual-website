export interface ServizioDetail {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
}

export const serviziDetail: ServizioDetail[] = [
  {
    id: 'totem',
    eyebrow: 'Comunicazione verticale',
    title: 'Totem Pubblicitari',
    subtitle: 'Strutture autoportanti ad alto impatto visivo, progettate per catturare l\'attenzione nei punti di massimo passaggio.',
    description: 'I nostri totem pubblicitari sono strutture autoportanti progettate per ambienti commerciali ad alto traffico. Disponibili in versione monofacciale, bifacciale o a 360°, si adattano a qualsiasi contesto: dall\'ingresso di un centro commerciale alla corsia di un supermercato, dallo showroom automobilistico all\'area hospitality di un aeroporto. Ogni totem è realizzato su misura — nelle dimensioni, nella forma e nella grafica — garantendo piena coerenza con l\'identità visiva del brand e massima resa in qualsiasi condizione di luce.',
    features: [
      'Strutture monofacciali, bifacciali o a 360°',
      'Pannelli retroilluminati LED ad alta luminosità',
      'Grafica intercambiabile con sistema a profilo a scatto',
      'Integrazione di schermi digitali su richiesta',
      'Materiali premium: alluminio, acciaio, metacrilato',
      'Installazione e manutenzione incluse',
    ],
  },
  {
    id: 'stand',
    eyebrow: 'Presenza a pavimento',
    title: 'Stand Espositivi',
    subtitle: 'Soluzioni modulari e brandizzate per fiere, eventi e punti vendita permanenti o temporanei.',
    description: 'Progettiamo stand espositivi per ogni contesto: dall\'evento fieristico internazionale all\'area promozionale in-store, dalla boutique pop-up al flagship store. Le nostre strutture combinano estetica e funzionalità: leggere, solide, rapide da montare e smontare, completamente personalizzabili con la grafica del brand. Il sistema modulare permette di adattare lo stand a spazi di dimensioni diverse mantenendo sempre la coerenza visiva e l\'impatto comunicativo.',
    features: [
      'Strutture modulari in alluminio con profilo a scatto',
      'Superfici stampate in alta risoluzione UV',
      'Montaggio rapido senza attrezzi specializzati',
      'Trasportabili in borse dedicate o flight-case',
      'Possibilità di aggiungere monitor, ripiani, contenitori',
      'Soluzioni da 1 m² a isole fieristiche complete',
    ],
  },
  {
    id: 'insegne',
    eyebrow: 'Identità visiva',
    title: 'Insegne e Segnaletica',
    subtitle: 'Insegne luminose, lettere scatolate e segnaletica direzionale che trasformano l\'architettura commerciale in comunicazione di brand.',
    description: 'L\'insegna è il primo punto di contatto visivo tra il brand e il cliente. Realizziamo insegne a plancia, insegne a bandiera, lettere scatolate retroilluminate e segnaletica direzionale per ambienti retail, corporate e hospitality. Ogni progetto è sviluppato nel rispetto delle normative urbanistiche vigenti e delle linee guida del brand, con un processo integrato che va dalla progettazione tecnica e grafica fino alla posa in opera con personale qualificato.',
    features: [
      'Insegne a plancia, a bandiera e a filo di facciata',
      'Lettere scatolate in alluminio o plexiglas retroilluminato',
      'Segnaletica direzionale interna ed esterna',
      'Illuminazione LED integrata a basso consumo energetico',
      'Progettazione nel rispetto delle normative locali',
      'Gestione pratiche autorizzative su richiesta',
    ],
  },
  {
    id: 'digital',
    eyebrow: 'Tecnologia LED',
    title: 'Display e Schermi Digitali',
    subtitle: 'Soluzioni di digital signage per vetrine, gallerie e spazi pubblici, con contenuti aggiornabili in tempo reale da qualsiasi dispositivo.',
    description: 'Il digital signage è lo strumento più flessibile della comunicazione visiva moderna. Progettiamo e installiamo schermi LED e LCD di grandi dimensioni, configurati per funzionare come insegne dinamiche, bacheche informative o media wall d\'impatto. I contenuti sono gestiti da remoto tramite CMS cloud dedicato, aggiornabili in tempo reale da smartphone, tablet o computer. Offriamo soluzioni dalla singola postazione fino a reti multi-schermo sincronizzate su più location geografiche.',
    features: [
      'Schermi LED indoor/outdoor ad alta luminosità',
      'Display LCD professionali da 32″ a 98″',
      'CMS cloud per la gestione dei contenuti da remoto',
      'Reti multi-schermo sincronizzate su più location',
      'Integrazione con sistemi di cassa e dati in tempo reale',
      'Assistenza tecnica e contratti di manutenzione dedicati',
    ],
  },
  {
    id: 'progettazione',
    eyebrow: 'Dal concept alla posa',
    title: 'Progettazione e Installazione',
    subtitle: 'Un servizio chiavi in mano: dall\'analisi dello spazio alla posa in opera, con un unico interlocutore e tempi certi.',
    description: 'Offriamo un servizio completo che copre ogni fase del processo: sopralluogo e analisi dello spazio, progettazione tecnica con rendering 3D, produzione in-house, logistica, posa in opera e collaudo finale. Il nostro team interno gestisce l\'intero ciclo in modo coordinato, garantendo tempi precisi, qualità costante e un singolo punto di riferimento dal primo contatto all\'installazione completata. Includiamo supporto post-installazione e garanzia su tutti i lavori eseguiti.',
    features: [
      'Sopralluogo e analisi spaziale gratuiti',
      'Progettazione tecnica con rendering 3D fotorealistico',
      'Produzione in-house con controllo qualità su ogni fase',
      'Installazione con personale certificato e specializzato',
      'Gestione completa di logistica e cantiere',
      'Assistenza post-installazione e garanzia incluse',
    ],
  },
];
