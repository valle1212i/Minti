import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePortal } from '../lib/portal';
import './Navbar.css';

// Menyposter som styrs från kundportalens menyredigerare (navigation-layout): ordning,
// synlighet och etikett. Portalvärdade sidor (portalPath, t.ex. retur) går via /go/:id.
const PORTAL_NAV = {
  about: { to: '/about', label: 'Om oss' },
  contact: { to: '/contact', label: 'Kontakt' },
  shop: { to: '/shop', label: 'Butik' },
  categories: { to: '/categories', label: 'Kategorier' },
  news: { to: '/news', label: 'Nyheter' },
  subscriptions: { to: '/subscriptions', label: 'Prenumerationer' },
  gift_cards: { to: '/gift-cards', label: 'Presentkort' }
};
const FALLBACK_LINKS = [{ id: 'about', visible: true }, { id: 'contact', visible: true }, { id: 'book', visible: true }];

function portalLinks(nav) {
  const links = nav && Array.isArray(nav.links) && nav.links.length > 0 ? nav.links : FALLBACK_LINKS;
  return links.filter((l) => l && l.visible !== false);
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWellnessDropdownOpen, setIsWellnessDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownTimeoutRef = useRef(null);
  const { data: nav } = usePortal('/navigation-layout');
  const links = portalLinks(nav);
  const showBooking = links.some((l) => l.id === 'book');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsWellnessDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsWellnessDropdownOpen(false);
    }, 150); // Small delay to allow moving to dropdown menu
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img 
            src="/mintilogose.png" 
            alt="Minti logo" 
            className="navbar-logo-img" 
          />
        </Link>
        
        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Hem
          </Link>
          <Link 
            to="/services" 
            className={`navbar-link ${location.pathname === '/services' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Tjänster
          </Link>
          <div 
            className="navbar-dropdown"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <Link 
              to="/wellness-experience" 
              className={`navbar-link ${location.pathname === '/wellness-experience' ? 'active' : ''}`}
              onClick={(e) => {
                if (window.innerWidth <= 968) {
                  e.preventDefault();
                  setIsWellnessDropdownOpen(!isWellnessDropdownOpen);
                } else {
                  closeMobileMenu();
                }
              }}
            >
              Välmående-upplevelsen
            </Link>
            {isWellnessDropdownOpen && (
              <div 
                className="dropdown-menu"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <Link to="/bastu" className="dropdown-item" onClick={closeMobileMenu}>
                  Bastu
                </Link>
                <Link to="/wellness-experience#zen-tradgard" className="dropdown-item" onClick={closeMobileMenu}>
                  Zen trädgård
                </Link>
              </div>
            )}
          </div>
          <Link 
            to="/gallery" 
            className={`navbar-link ${location.pathname === '/gallery' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Galleri
          </Link>
          {links.map((link) => {
            if (link.portalPath) {
              return (
                <a key={link.id} href={`/go/${encodeURIComponent(link.id)}`} className="navbar-link" onClick={closeMobileMenu}>
                  {link.label || 'Retur'}
                </a>
              );
            }
            const target = PORTAL_NAV[link.id];
            if (!target) return null;
            return (
              <Link
                key={link.id}
                to={target.to}
                className={`navbar-link ${location.pathname.startsWith(target.to) ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {link.label || target.label}
              </Link>
            );
          })}
          {showBooking && (
            <Link to="/book" className="navbar-cta" onClick={closeMobileMenu}>
              Boka nu
            </Link>
          )}
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

