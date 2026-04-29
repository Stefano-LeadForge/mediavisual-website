import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — NextHome Real Estate',
  description: 'Analisi del mercato immobiliare milanese, consigli pratici e guide per comprare, vendere e affittare casa a Milano.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
