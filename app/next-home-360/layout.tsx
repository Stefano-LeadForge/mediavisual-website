import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next Home 360: vendi casa a Milano e guadagna con affitti brevi',
  description:
    'Con Next Home 360 puoi vendere il tuo appartamento a Milano mentre lo metti a reddito con affitti brevi su Airbnb e Booking. Più rendimento, più valore percepito, più potenziale di vendita.',
};

export default function NextHome360Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
