import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import StaticNav from "@/components/StaticNav";
import Footer from "@/components/Footer";

/* ── DISPLAY FONT: Barlow Condensed ───────────────────────────────────
   Peso 700 (bold industriale) e 900 (heavy billboard) per titoli.
   Variabile CSS: --font-barlow
   Per sostituire il font: rimpiazza Barlow_Condensed con il nuovo font
   e aggiorna la variabile in globals.css.
─────────────────────────────────────────────────────────────────────── */
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-barlow",
});

/* ── BODY FONT: DM Sans ── */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Mediavisual — Totem e Stand Pubblicitari",
  description:
    "Progettazione e installazione di totem, stand e display pubblicitari per centri commerciali e spazi retail.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${barlowCondensed.variable} ${dmSans.variable}`}>
      <head>
        {/* Anti-FOUC: applica il tema PRIMA del render per evitare flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||
(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <StaticNav />
        <SmoothScrolling>
          {children}
          <Footer />
        </SmoothScrolling>
      </body>
    </html>
  );
}
