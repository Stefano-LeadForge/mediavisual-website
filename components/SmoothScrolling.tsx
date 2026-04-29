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

    const instance = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false, // mobile keeps native scroll momentum
      wheelMultiplier: 1.0,
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
