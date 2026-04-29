import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Valuta la tua casa — NextHome Real Estate',
  description: 'Richiedi una valutazione professionale gratuita del tuo immobile a Milano. Consulenza senza impegno con dati reali di mercato.',
};

export default function ValutaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
