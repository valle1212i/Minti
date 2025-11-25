import React, { useState } from 'react';
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus('success');
    setTimeout(() => {
      setFormStatus('');
      setFormData({
        name: '',
        email: '',
        phone: '',
        bookingNumber: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="contact">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">
            Get in touch to book your wellness experience
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2 className="section-title">Get in Touch</h2>
              <p className="section-text">
                Have questions? Please contact us first via chat if available. 
                You can also contact us via the form below and we will get back 
                to you as soon as possible.
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-item-content">
                    <h3>Phone</h3>
                    <p>+1 (234) 567-890</p>
                    <span className="contact-hours">Mon-Sun: 8:00 AM - 8:00 PM</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div className="contact-item-content">
                    <h3>Email</h3>
                    <p>info@mintiwellness.com</p>
                    <p>reservations@mintiwellness.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-item-content">
                    <h3>Address</h3>
                    <p>123 Wellness Way</p>
                    <p>Serenity City, SC 12345</p>
                    <p>United States</p>
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="#" className="social-link">Facebook</a>
                  <a href="#" className="social-link">Instagram</a>
                  <a href="#" className="social-link">Twitter</a>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h2 className="section-title">Contact Form</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
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
                  <label htmlFor="email">Email *</label>
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
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bookingNumber">Booking Number (if applicable)</label>
                  <input
                    type="text"
                    id="bookingNumber"
                    name="bookingNumber"
                    value={formData.bookingNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {formStatus === 'success' && (
                  <div className="form-success">
                    Thank you! Your message has been sent. We'll get back to you soon.
                  </div>
                )}

                <button type="submit" className="btn btn-primary">
                  Send Message
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
            <span>Map Location</span>
            <p>123 Wellness Way, Serenity City, SC 12345</p>
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section className="booking-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Book Your Stay?</h2>
            <p className="cta-text">
              Explore our packages and book your wellness experience today.
            </p>
            <div className="cta-buttons">
              <a href="/services" className="btn btn-primary">View Packages</a>
              <a href="/gallery" className="btn btn-secondary">View Gallery</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

