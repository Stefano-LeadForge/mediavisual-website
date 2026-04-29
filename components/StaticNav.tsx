'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';

export default function StaticNav() {
  const pathname = usePathname();
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobileIsOpen = useRef(false);

  // Transparent → solid on scroll (matches home nav behaviour)
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    function onScroll() {
      header!.classList.toggle('static-header--solid', window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // apply immediately in case page loads already scrolled
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPortfolioOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  // Close everything on route change; re-evaluate sticky state after scroll reset
  useEffect(() => {
    setPortfolioOpen(false);
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

  if (pathname === '/') return null;

  return (
    <>
      <header className="static-header" ref={headerRef}>
        {/* Logo */}
        <a href="/" className="static-header-logo" aria-label="Torna alla home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NextHome logo" className="static-header-logo-img" />
          <div className="static-header-logo-divider" />
          <div className="static-header-logo-text">
            <span className="static-header-logo-main">NextHome</span>
            <span className="static-header-logo-sub">Real Estate</span>
          </div>
        </a>

        {/* Desktop nav — hidden at ≤900px */}
        <div className="static-nav-right">
          <ul className="static-nav-links">
            <li>
              <a href="/next-home-360" className="static-nav-link">Next Home 360</a>
            </li>

            {/* Portfolio with dropdown */}
            <li
              ref={dropdownRef}
              className={`nav-has-dropdown${portfolioOpen ? ' is-open' : ''}`}
            >
              <button
                type="button"
                className="static-nav-link nav-dropdown-trigger"
                onClick={() => setPortfolioOpen((o) => !o)}
                aria-expanded={portfolioOpen}
                aria-haspopup="true"
              >
                Portfolio
                <span className="nav-chevron">
                  <ChevronDown size={11} strokeWidth={1.5} />
                </span>
              </button>
              <div className="nav-dropdown">
                <a href="/portfolio" className="nav-dropdown-item">Tutti gli annunci</a>
                <div className="nav-dropdown-divider" />
                <a href="/portfolio/vendite" className="nav-dropdown-item">Vendite</a>
                <a href="/portfolio/affitti" className="nav-dropdown-item">Affitti</a>
              </div>
            </li>

            <li>
              <a href="/blog" className="static-nav-link">Blog</a>
            </li>
          </ul>

          <a href="/valuta-casa" className="static-nav-btn">Valuta la tua casa</a>
        </div>

        {/* Hamburger — mobile only (visible at ≤900px) */}
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

      {/* Mobile menu overlay — sibling of header so position:fixed is viewport-relative */}
      <div
        className="static-mobile-menu"
        ref={mobileMenuRef}
        style={{ pointerEvents: 'none', opacity: 0 }}
      >
        <ul className="mobile-menu-list">
          <li><a href="/next-home-360" className="mobile-menu-link">Next Home 360</a></li>
          <li>
            <a href="/portfolio" className="mobile-menu-link">Portfolio</a>
            <div className="mobile-menu-sub">
              <a href="/portfolio/vendite" className="mobile-menu-sub-link">Vendite</a>
              <span className="mobile-menu-sub-sep">·</span>
              <a href="/portfolio/affitti" className="mobile-menu-sub-link">Affitti</a>
            </div>
          </li>
          <li><a href="/blog" className="mobile-menu-link">Blog</a></li>
        </ul>
        <div className="mobile-menu-divider" />
        <a href="/valuta-casa" className="mobile-menu-cta-link">Valuta la tua casa</a>
      </div>
    </>
  );
}
