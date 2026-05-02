import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Realizzazioni — Mediavisual',
  description: 'Portfolio di stand espositivi, totem pubblicitari e allestimenti realizzati da Mediavisual in tutta Italia.',
};

export default function RealizzazioniLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preload immagine LCP: prima card galleria, versione mobile 828px */}
      <link
        rel="preload"
        as="image"
        href="/_next/image?url=%2Frealizzazioni%2Fstand1.webp&w=828&q=75"
        fetchPriority="high"
      />
      {children}
    </>
  );
}
