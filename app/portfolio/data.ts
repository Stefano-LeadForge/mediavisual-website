import type { Annuncio } from '@/components/PropertyCard';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — struttura allineata al feed XML/JSON di Immobiliare.it
//   titolo           → <title>
//   prezzo           → <price><value>
//   superficie       → <surface>
//   locali           → <rooms>
//   zona             → <city_zone>
//   tipologia        → <contract>  (vendita | affitto)
//   immaginePrincipale → <photos><photo url="...">
//   linkEsterno      → URL annuncio su Immobiliare.it
// ─────────────────────────────────────────────────────────────────────────────
export const annunciMock: Annuncio[] = [
  {
    id: 1,
    titolo: 'Attico luminoso con terrazza panoramica',
    prezzo: 1_850_000,
    superficie: 185,
    locali: 4,
    zona: 'Brera',
    tipologia: 'vendita',
    immaginePrincipale: '/copertina-vendita.png',
    linkEsterno: '#',
  },
  {
    id: 2,
    titolo: 'Appartamento di design in palazzo storico',
    prezzo: 3_800,
    superficie: 120,
    locali: 3,
    zona: 'Porta Venezia',
    tipologia: 'affitto',
    immaginePrincipale: '/copertina-affitto.png',
    linkEsterno: '#',
  },
  {
    id: 3,
    titolo: 'Trilocale ristrutturato con vista sui Navigli',
    prezzo: 620_000,
    superficie: 95,
    locali: 3,
    zona: 'Navigli',
    tipologia: 'vendita',
    immaginePrincipale: '/copertina-vendita.png',
    linkEsterno: '#',
  },
  {
    id: 4,
    titolo: 'Bilocale moderno con portineria — Porta Nuova',
    prezzo: 2_200,
    superficie: 68,
    locali: 2,
    zona: 'Porta Nuova',
    tipologia: 'affitto',
    immaginePrincipale: '/copertina-affitto.png',
    linkEsterno: '#',
  },
  {
    id: 5,
    titolo: 'Villa con giardino privato e piscina',
    prezzo: 3_200_000,
    superficie: 420,
    locali: 7,
    zona: 'Città Studi',
    tipologia: 'vendita',
    immaginePrincipale: '/copertina-vendita.png',
    linkEsterno: '#',
  },
  {
    id: 6,
    titolo: 'Loft esclusivo con soffitti a doppia altezza',
    prezzo: 4_500,
    superficie: 150,
    locali: 2,
    zona: 'Isola',
    tipologia: 'affitto',
    immaginePrincipale: '/copertina-affitto.png',
    linkEsterno: '#',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FETCH FUNCTION — sostituire il corpo per attivare l'API reale:
//
//   const res = await fetch(
//     `https://api.immobiliare.it/v2/listings?agencyId=${process.env.IMMOBILIARE_AGENCY_ID}`,
//     { headers: { Authorization: `Bearer ${process.env.IMMOBILIARE_API_KEY}` },
//       next: { revalidate: 900 } }
//   );
//   const json = await res.json();
//   return json.results.map(mapImmobiliareToAnnuncio);
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchAnnunci(tipologia?: 'vendita' | 'affitto'): Promise<Annuncio[]> {
  return tipologia
    ? annunciMock.filter((a) => a.tipologia === tipologia)
    : annunciMock;
}
