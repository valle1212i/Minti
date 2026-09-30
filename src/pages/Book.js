import React, { useState } from 'react';
import Booking from '../components/Booking';
import { usePreset, usePreview, BOOKING_PRESET_KEYS } from '../lib/portal';
import '../components/ProductGrid.css';

// /book — bokningen som egen sida. Portalens bokningsdesign ramar in den här sökvägen
// och förhandsvisar designen (surface booking).
const Book = () => {
  const saved = usePreset('booking');
  const [livePreset, setLivePreset] = useState(null);
  const preset = { ...(saved || {}), ...(livePreset || {}) };

  usePreview({
    surface: 'booking',
    presetKeys: BOOKING_PRESET_KEYS,
    onPreset: (p) => setLivePreset(p),
    onClear: () => setLivePreset(null)
  });

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <h1 className="page-title">Boka</h1>
        <p className="page-subtitle">Välj behandling, dag och tid</p>
      </section>
      <section className="portal-section">
        <Booking preset={preset} />
      </section>
    </div>
  );
};

export default Book;
