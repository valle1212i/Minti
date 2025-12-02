import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWellnessDropdownOpen, setIsWellnessDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownTimeoutRef = useRef(null);

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
            to="/about" 
            className={`navbar-link ${location.pathname === '/about' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Om oss
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
          <Link 
            to="/contact" 
            className={`navbar-link ${location.pathname === '/contact' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Kontakt
          </Link>
          <Link to="/contact" className="navbar-cta" onClick={closeMobileMenu}>
            Boka nu
          </Link>
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

