import type { Metadata } from 'next';
import ListingsPage from '../ListingsPage';

export const metadata: Metadata = {
  title: 'Immobili in Vendita Milano — NextHome Real Estate',
  description:
    'Appartamenti, attici e residenze esclusive in vendita nelle zone più ambite di Milano. Ogni immobile selezionato con cura dai nostri consulenti.',
};

export default function VenditePage() {
  return (
    <ListingsPage
      tipologia="vendita"
      eyebrow="Case in vendita"
      title="Vendite"
      subtitle="Appartamenti, attici e residenze esclusive nelle zone più ambite di Milano. Ogni immobile è selezionato e valorizzato dai nostri consulenti per offrirti il meglio del mercato."
    />
  );
}
