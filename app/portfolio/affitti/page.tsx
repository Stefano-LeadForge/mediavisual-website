import type { Metadata } from 'next';
import ListingsPage from '../ListingsPage';

export const metadata: Metadata = {
  title: 'Immobili in Affitto Milano — NextHome Real Estate',
  description:
    'Bilocali, trilocali e loft di design in affitto a Milano. Soluzioni abitative di qualità nelle zone più ricercate della città.',
};

export default function AffittiPage() {
  return (
    <ListingsPage
      tipologia="affitto"
      eyebrow="Case in affitto"
      title="Affitti"
      subtitle="Bilocali, trilocali e loft di design in affitto nelle zone più ricercate di Milano. Soluzioni abitative di qualità, selezionate per chi non scende a compromessi."
    />
  );
}
