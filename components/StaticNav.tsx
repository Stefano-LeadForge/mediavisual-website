'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import ThemeToggle from '@/components/ThemeToggle';

export default function StaticNav() {
  const pathname     = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef  = useRef<HTMLDivElement>(null);
  const headerRef      = useRef<HTMLElement>(null);
  const mobileIsOpen   = useRef(false);

  /* Trasparente → solido allo scroll */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    function onScroll() {
      header!.classList.toggle('static-header--solid', window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Chiudi tutto al cambio di route */
  useEffect(() => {
    if (mobileIsOpen.current) closeMobile();
    if (headerRef.current) {
      headerRef.current.classList.toggle('static-header--solid', window.scrollY > 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function getMobileLinks() {
    return mobileMenuRef.current
      ? Array.from(mobileMenuRef.current.querySelectorAll('a'))
      : [];
  }

  function openMobile() {
    mobileIsOpen.current = true;
    setMobileOpen(true);
    const menu = mobileMenuRef.current;
    if (!menu) return;
    document.body.style.overflow = 'hidden';
    menu.style.pointerEvents = 'auto';
    gsap.to(menu, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo(
      getMobileLinks(),
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out', delay: 0.18 },
    );
  }

  function closeMobile(cb?: () => void) {
    mobileIsOpen.current = false;
    const menu = mobileMenuRef.current;
    gsap.to(getMobileLinks(), { opacity: 0, y: 16, duration: 0.22, ease: 'power2.in', stagger: 0.04 });
    gsap.to(menu, {
      opacity: 0, duration: 0.28, delay: 0.18, ease: 'power2.in',
      onComplete: () => {
        if (menu) menu.style.pointerEvents = 'none';
        document.body.style.overflow = '';
        setMobileOpen(false);
        cb?.();
      },
    });
  }

  /* Non renderizzare sulla home — l'animato nav di page.tsx è già lì */
  if (pathname === '/') return null;

  return (
    <>
      <header className="static-header" ref={headerRef}>
        <a href="/" className="static-header-logo" aria-label="Mediavisual — Homepage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mediavisual-trasp.png" alt="Mediavisual" className="static-logo-img" />
        </a>

        {/* Nav desktop — nascosto a ≤900px */}
        <div className="static-nav-right">
          <ul className="static-nav-links">
            <li><a href="/servizi"       className="static-nav-link">Servizi</a></li>
            <li><a href="/realizzazioni" className="static-nav-link">Realizzazioni</a></li>
            <li><a href="/chi-siamo" className="static-nav-link">Chi Siamo</a></li>
            <li><a href="/contatti"  className="static-nav-link">Contatti</a></li>
          </ul>
          <a href="/contatti" className="static-nav-btn">Richiedi Preventivo</a>
        </div>

        <ThemeToggle />

        {/* Hamburger — visibile a ≤900px */}
        <button
          type="button"
          className={`static-hamburger hamburger${mobileOpen ? ' is-open' : ''}`}
          onClick={() => (mobileOpen ? closeMobile() : openMobile())}
          aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </header>

      {/* Mobile menu overlay */}
      <div
        className="static-mobile-menu"
        ref={mobileMenuRef}
        style={{ pointerEvents: 'none', opacity: 0 }}
      >
        <ul className="mobile-menu-list">
          <li><a href="/servizi"       className="mobile-menu-link">Servizi</a></li>
          <li><a href="/realizzazioni" className="mobile-menu-link">Realizzazioni</a></li>
          <li><a href="/chi-siamo" className="mobile-menu-link">Chi Siamo</a></li>
          <li><a href="/contatti"  className="mobile-menu-link">Contatti</a></li>
        </ul>
        <div className="mobile-menu-divider" />
        <a href="/contatti" className="mobile-menu-cta-link">Richiedi Preventivo</a>
      </div>
    </>
  );
}
