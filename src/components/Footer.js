import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">Minti</h3>
            <p className="footer-description">
              Din resa till wellness börjar här. Upplev frid, 
              förnyelse och inre lugn i vår fridfulla fristad.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Snabblänkar</h4>
            <ul className="footer-links">
              <li><a href="/">Hem</a></li>
              <li><a href="/about">Om oss</a></li>
              <li><a href="/services">Tjänster</a></li>
              <li><a href="/gallery">Galleri</a></li>
              <li><a href="/contact">Kontakt</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Tjänster</h4>
            <ul className="footer-links">
              <li><a href="/services">Spa-behandlingar</a></li>
              <li><a href="/services">Wellness-program</a></li>
              <li><a href="/services">Yoga & Meditation</a></li>
              <li><a href="/services">Näringsrådgivning</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Kontakt</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-label">Telefon:</span>
                <a href="tel:+4687476100">+46 (0) 8 747 61 00</a>
              </li>
              <li>
                <span className="contact-label">E-post:</span>
                <a href="mailto:info@minti.se">info@minti.se</a>
              </li>
              <li>
                <span className="contact-label">Adress:</span>
                <span>Hamndalsvägen 8, 132 39 Stockholm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Minti Wellness. Alla rättigheter förbehållna.</p>
          <div className="footer-legal">
            <a href="/privacy">Integritetspolicy</a>
            <span>|</span>
            <a href="/terms">Användarvillkor</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

