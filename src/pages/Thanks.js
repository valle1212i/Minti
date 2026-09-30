import React from 'react';
import { Link } from 'react-router-dom';
import '../components/ProductGrid.css';

// /tack — kassans successUrl. Betalningen bekräftas av kundportalen; sidan visar bara tack.
const Thanks = () => (
  <div className="portal-page">
    <section className="portal-hero">
      <h1 className="page-title">Tack!</h1>
      <p className="page-subtitle">Ditt köp är genomfört. En bekräftelse skickas till din e-post.</p>
    </section>
    <section className="portal-section" style={{ textAlign: 'center' }}>
      <Link to="/" className="btn btn-primary">Till startsidan</Link>
    </section>
  </div>
);

export default Thanks;
