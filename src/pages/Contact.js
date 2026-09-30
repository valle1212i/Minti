import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { portalPost } from '../lib/portal';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bookingNumber: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('');
  // Honungsfälla: ett dolt fält som människor lämnar tomt (portalen avvisar ifyllt).
  const [company, setCompany] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Meddelandet skickas till kundportalen (via /api/portal/contact) och visas som
  // lyckat först när portalen har tagit emot det.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    const message = formData.bookingNumber.trim()
      ? `${formData.message.trim()}\n\nBokningsnummer: ${formData.bookingNumber.trim()}`
      : formData.message.trim();
    try {
      await portalPost('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message,
        company
      });
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', bookingNumber: '', message: '' });
    } catch (err) {
      setFormStatus('error');
    }
  };

  return (
    <div className="contact">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="page-title">Kontakta oss</h1>
          <p className="page-subtitle">
            Kontakta oss för att boka din wellness-upplevelse
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2 className="section-title">Kontakta oss</h2>
              <p className="section-text">
                Har du frågor? Kontakta oss gärna först via chatt om den är tillgänglig. 
                Du kan också kontakta oss via formuläret nedan så återkopplar vi 
                till dig så snart som möjligt.
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-item-content">
                    <h3>Telefon</h3>
                    <p>+46 (0) 8 747 61 00</p>
                    <span className="contact-hours">Mån-Sön: 08:00 - 20:00</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div className="contact-item-content">
                    <h3>E-post</h3>
                    <p>info@minti.se</p>
                    <p>bokning@minti.se</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-item-content">
                    <h3>Adress</h3>
                    <p>Hamndalsvägen 8</p>
                    <p>132 39 Stockholm</p>
                    <p>Sverige</p>
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <h3>Följ oss</h3>
                <div className="social-links">
                  <span className="social-link">Facebook</span>
                  <span className="social-link">Instagram</span>
                  <span className="social-link">Twitter</span>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h2 className="section-title">Kontaktformulär</h2>
              <div style={{ marginBottom: '2rem' }}>
                <Link to="/book" className="btn btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                  Boka nu →
                </Link>
              </div>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Namn *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-post *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bookingNumber">Bokningsnummer (om tillämpligt)</label>
                  <input
                    type="text"
                    id="bookingNumber"
                    name="bookingNumber"
                    value={formData.bookingNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Meddelande *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group" aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
                  <label htmlFor="company">Lämna tomt</label>
                  <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>

                {formStatus === 'success' && (
                  <div className="form-success" role="status">
                    Tack! Ditt meddelande har skickats. Vi återkommer till dig snart.
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="form-success" role="alert" style={{ background: '#fbecec', color: '#a33a3a' }}>
                    Meddelandet kunde inte skickas. Försök igen eller ring oss.
                  </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={formStatus === 'sending'}>
                  {formStatus === 'sending' ? 'Skickar…' : 'Skicka meddelande'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <div className="map-placeholder">
            <span>Kartplats</span>
            <p>Hamndalsvägen 8, 132 39 Stockholm</p>
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section className="booking-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Redo att boka din vistelse?</h2>
            <p className="cta-text">
              Utforska våra paket och boka din wellness-upplevelse idag.
            </p>
            <div className="cta-buttons">
              <Link to="/book" className="btn btn-primary">Boka nu</Link>
              <a href="/services" className="btn btn-secondary">Se paket</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

