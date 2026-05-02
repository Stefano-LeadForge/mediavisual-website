'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type Lenis from '@studio-freight/lenis';

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapRef: any = null;
    let tickerFn: ((time: number) => void) | null = null;
    let instance: Lenis | null = null;
    let mounted = true;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: LenisCtor }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('@studio-freight/lenis'),
      ]);

      if (!mounted) return;

      gsap.registerPlugin(ScrollTrigger);
      gsapRef = gsap;

      if (!isTouch) ScrollTrigger.normalizeScroll(true);

      instance = new LenisCtor({
        lerp: 0.04,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1.1,
      });

      setLenis(instance);

      tickerFn = (time: number) => instance!.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
      instance.on('scroll', ScrollTrigger.update);
    })();

    return () => {
      mounted = false;
      if (gsapRef && tickerFn) gsapRef.ticker.remove(tickerFn);
      if (instance) instance.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
