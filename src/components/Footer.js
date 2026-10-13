import React from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../data/site';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <p className="footer-logo">Minti</p>
            <p className="footer-description">
              Bad, bastu och stillhet i en lugn miljö. Wellness på ditt vis.
            </p>
            <p className="footer-demo">{SITE.demoNotice}</p>
          </div>

          <div className="footer-section">
            <h2 className="footer-title">Upptäck</h2>
            <ul className="footer-links">
              <li><Link to="/wellness-experience">Välmående-upplevelsen</Link></li>
              <li><Link to="/bastu">Bastu</Link></li>
              <li><Link to="/services">Tjänster</Link></li>
              <li><Link to="/gallery">Galleri</Link></li>
              <li><Link to="/about">Om Minti</Link></li>
              <li><Link to="/news">Nyheter</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h2 className="footer-title">Boka och handla</h2>
            <ul className="footer-links">
              <li><Link to="/book">Boka besök</Link></li>
              <li><Link to="/shop">Butik</Link></li>
              <li><Link to="/gift-cards">Presentkort</Link></li>
              <li><Link to="/subscriptions">Prenumerationer</Link></li>
              <li><Link to="/contact">Kontakt</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h2 className="footer-title">Kontakt</h2>
            <ul className="footer-contact">
              <li>
                <span className="contact-label">Telefon (fiktivt)</span>
                <a href={SITE.phoneHref}>{SITE.phone}</a>
              </li>
              <li>
                <span className="contact-label">E-post (fiktiv)</span>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <span className="contact-label">Adress (fiktiv)</span>
                <span>{SITE.street}, {SITE.postal}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Minti. En konceptsajt.</p>
          <div className="footer-legal">
            <Link to="/privacy">Integritetspolicy</Link>
            <span aria-hidden="true">|</span>
            <Link to="/terms">Villkor</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
