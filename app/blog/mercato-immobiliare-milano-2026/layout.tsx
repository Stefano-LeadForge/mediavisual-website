import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Come sta evolvendo il mercato immobiliare a Milano nel 2026 | Next Home',
  description:
    'Analisi aggiornata del mercato immobiliare a Milano nel 2026: prezzi, domanda, mutui, affitti e opportunità per chi compra, vende o investe.',
};

export default function ArticoloMercatoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
