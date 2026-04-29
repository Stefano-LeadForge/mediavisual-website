import type { Metadata } from 'next';
import PortfolioContent from './PortfolioContent';

export const metadata: Metadata = {
  title: 'Portfolio — NextHome Real Estate',
  description: 'Scopri le proprietà in affitto e vendita selezionate da NextHome Real Estate a Milano.',
};

export default function PortfolioPage() {
  return <PortfolioContent />;
}
