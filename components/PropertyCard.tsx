import Image from 'next/image';

export interface Annuncio {
  id: number;
  titolo: string;
  prezzo: number;
  superficie: number;
  locali: number;
  zona?: string;
  tipologia: 'vendita' | 'affitto';
  immaginePrincipale: string;
  linkEsterno: string;
}

function formatPrezzo(prezzo: number): string {
  return new Intl.NumberFormat('it-IT').format(prezzo);
}

export default function PropertyCard({ annuncio }: { annuncio: Annuncio }) {
  const { titolo, prezzo, superficie, locali, zona, tipologia, immaginePrincipale, linkEsterno } =
    annuncio;

  return (
    <a
      href={linkEsterno}
      target="_blank"
      rel="noopener noreferrer"
      className="property-card"
      aria-label={`Vedi annuncio: ${titolo}`}
    >
      <div className="property-card-image">
        <Image
          src={immaginePrincipale}
          alt={titolo}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
        <div className="property-card-image-overlay" />
        <span className={`property-card-badge property-card-badge--${tipologia}`}>
          {tipologia === 'vendita' ? 'Vendita' : 'Affitto'}
        </span>
      </div>

      <div className="property-card-body">
        {zona && <div className="property-card-zona">{zona}</div>}
        <h3 className="property-card-title">{titolo}</h3>

        <div className="property-card-price">
          €&nbsp;{formatPrezzo(prezzo)}
          {tipologia === 'affitto' && <em>/mese</em>}
        </div>

        <div className="property-card-meta">
          <div className="property-card-meta-item">
            <span className="property-card-meta-value">{locali}</span>
            <span>{locali === 1 ? 'locale' : 'locali'}</span>
          </div>
          <div className="property-card-meta-item">
            <span className="property-card-meta-value">{superficie}</span>
            <span>m²</span>
          </div>
        </div>

        <span className="property-card-cta">
          Vedi annuncio <span className="arr" />
        </span>
      </div>
    </a>
  );
}
