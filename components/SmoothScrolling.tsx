'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // normalizeScroll conflicts with native touch momentum — desktop (mouse) only
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouch) {
      ScrollTrigger.normalizeScroll(true);
    }

    /* ── LENIS CONFIG: scroll fisico e pesante ──────────────────────────
       lerp: 0.04  → inerzia massima (il default è 0.1).
                     Abbassare per scroll più "pesante" come un pannello LED.
       wheelMultiplier: 1.1 → leggermente più sensibile alla rotella.
       Per scroll più veloce/leggero: alza lerp verso 0.10–0.12.
    ─────────────────────────────────────────────────────────────────── */
    const instance = new Lenis({
      lerp: 0.04,
      smoothWheel: true,
      syncTouch: false, // mobile: momentum nativo (non Lenis)
      wheelMultiplier: 1.1,
    });

    setLenis(instance);

    // Drive Lenis from GSAP's ticker — keeps Lenis and ScrollTrigger frame-perfect
    function onTick(time: number) {
      instance.raf(time * 1000);
    }
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Notify ScrollTrigger on every Lenis scroll frame
    instance.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
