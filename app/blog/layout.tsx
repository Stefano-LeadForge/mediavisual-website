import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mediavisual — Totem e Stand Pubblicitari',
  description: 'News, approfondimenti e casi studio su comunicazione visiva, allestimenti espositivi e digital signage.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
