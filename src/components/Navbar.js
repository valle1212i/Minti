import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

// Brytpunkten för mobilmenyn. Samma värde står i Navbar.css (@media (max-width: 1023px));
// tests/navbar.test.js kontrollerar att de två stämmer överens.
export const MOBILE_MAX_WIDTH = 1023;

// Huvudmenyn: sex poster och Boka-knappen ryms på en rad från 1024 px.
// Grupperna öppnas med klick (och hovring med mus på dator).
export const NAV_ITEMS = [
  { label: 'Hem', to: '/' },
  {
    label: 'Upplevelsen',
    id: 'upplevelsen',
    children: [
      { label: 'Välmående-upplevelsen', to: '/wellness-experience' },
      { label: 'Bastu', to: '/bastu' },
      { label: 'Zen-trädgården', to: '/wellness-experience#zen-tradgard' },
      { label: 'Galleri', to: '/gallery' }
    ]
  },
  { label: 'Tjänster', to: '/services' },
  {
    label: 'Butik',
    id: 'butik',
    children: [
      { label: 'Alla upplevelser', to: '/shop' },
      { label: 'Kategorier', to: '/categories' },
      { label: 'Presentkort', to: '/gift-cards' },
      { label: 'Prenumerationer', to: '/subscriptions' }
    ]
  },
  {
    label: 'Om oss',
    id: 'om',
    children: [
      { label: 'Om Minti', to: '/about' },
      { label: 'Nyheter', to: '/news' }
    ]
  },
  { label: 'Kontakt', to: '/contact' }
];

function groupIsActive(item, pathname) {
  return item.children.some((c) => {
    const path = c.to.split('#')[0];
    return pathname === path || pathname.startsWith(`${path}/`) || (path === '/shop' && pathname.startsWith('/product/'));
  });
}

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const closeTimer = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Stäng menyn och undermenyerna vid sidbyte.
  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
  }, [location.pathname, location.hash]);

  // Scrollåsning av sidan bakom när mobilmenyn är öppen.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('m-scroll-lock', menuOpen);
    return () => root.classList.remove('m-scroll-lock');
  }, [menuOpen]);

  const isMobile = useCallback(() => window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches, []);

  // Stäng mobilmenyn om fönstret blir brett, och allt med Escape.
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const onChange = () => { if (!mq.matches) setMenuOpen(false); };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setOpenGroup(null);
      }
    };
    mq.addEventListener('change', onChange);
    document.addEventListener('keydown', onKey);
    return () => {
      mq.removeEventListener('change', onChange);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Klick utanför sidhuvudet stänger en öppen undermeny.
  useEffect(() => {
    if (!openGroup) return undefined;
    const onDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenGroup(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [openGroup]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const hoverOpen = (id) => {
    if (isMobile()) return;
    clearTimeout(closeTimer.current);
    setOpenGroup(id);
  };

  const hoverClose = () => {
    if (isMobile()) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenGroup(null), 150);
  };

  // Genomskinligt sidhuvud bara överst på startsidan (över videon). Undersidorna har
  // alltid ett ljust sidhuvud med mörka länkar.
  const solid = !isHome || isScrolled;
  const navClass = ['navbar', solid ? 'navbar--solid' : 'navbar--clear', menuOpen ? 'navbar--open' : ''].join(' ').trim();
  const lightLogo = !solid || menuOpen;

  return (
    <header className={navClass} ref={navRef}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="Minti, till startsidan">
          <img
            src={lightLogo ? '/minti-logo-light.png' : '/minti-logo-dark.png'}
            alt=""
            className="navbar-logo-img"
            width="263"
            height="132"
          />
        </Link>

        <nav className="navbar-nav" aria-label="Huvudmeny">
          <ul id="huvudmeny" className={`navbar-menu${menuOpen ? ' is-open' : ''}`}>
            {NAV_ITEMS.map((item) => {
              if (!item.children) {
                return (
                  <li key={item.to} className="navbar-item">
                    <NavLink to={item.to} end className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
                      {item.label}
                    </NavLink>
                  </li>
                );
              }
              const open = openGroup === item.id;
              const active = groupIsActive(item, location.pathname);
              return (
                <li
                  key={item.id}
                  className={`navbar-item navbar-group${open ? ' is-open' : ''}`}
                  onMouseEnter={() => hoverOpen(item.id)}
                  onMouseLeave={hoverClose}
                >
                  <button
                    type="button"
                    className={`navbar-link navbar-group-toggle${active ? ' active' : ''}`}
                    aria-expanded={open}
                    aria-controls={`undermeny-${item.id}`}
                    onClick={() => setOpenGroup(open ? null : item.id)}
                  >
                    {item.label}
                    <svg className="navbar-caret" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false">
                      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </button>
                  <ul id={`undermeny-${item.id}`} className="dropdown-menu" hidden={!open}>
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <Link to={child.to} className="dropdown-item">{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
            <li className="navbar-item navbar-item--cta">
              <Link to="/book" className="navbar-cta">Boka</Link>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Stäng menyn' : 'Öppna menyn'}
          aria-expanded={menuOpen}
          aria-controls="huvudmeny"
        >
          <span className={`hamburger${menuOpen ? ' active' : ''}`} aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
