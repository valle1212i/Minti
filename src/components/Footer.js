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
              Your journey to wellness begins here. Experience tranquility, 
              rejuvenation, and inner peace in our serene sanctuary.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/gallery">Gallery</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              <li><a href="/services">Spa Treatments</a></li>
              <li><a href="/services">Wellness Programs</a></li>
              <li><a href="/services">Yoga & Meditation</a></li>
              <li><a href="/services">Nutritional Guidance</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Contact</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-label">Phone:</span>
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
              <li>
                <span className="contact-label">Email:</span>
                <a href="mailto:info@mintiwellness.com">info@mintiwellness.com</a>
              </li>
              <li>
                <span className="contact-label">Address:</span>
                <span>123 Wellness Way, Serenity City, SC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Minti Wellness. All rights reserved.</p>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <span>|</span>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

