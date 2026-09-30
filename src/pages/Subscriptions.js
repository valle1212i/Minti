import React, { useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { usePortal, usePreset, usePreview, STOREFRONT_PRESET_KEYS } from '../lib/portal';
import '../components/ProductGrid.css';

// /subscriptions — prenumerationerna från kundportalen (produkter med type subscription).
// Portalen kan förhandsvisa design (PRESET), ett utkast (PRODUCT) och en ny ordning (ORDER).
const Subscriptions = () => {
  const saved = usePreset('subscriptions');
  const [livePreset, setLivePreset] = useState(null);
  const [draft, setDraft] = useState(null);
  const [order, setOrder] = useState(null);
  const preset = { ...(saved || {}), ...(livePreset || {}) };

  usePreview({
    surface: 'subscriptions',
    presetKeys: STOREFRONT_PRESET_KEYS,
    onPreset: (p) => setLivePreset(p),
    onProduct: (product) => setDraft({ ...product, type: 'subscription', id: '__preview__' }),
    onOrder: (keys) => setOrder(keys),
    onClear: () => { setLivePreset(null); setDraft(null); setOrder(null); }
  });

  const { data, error, loading } = usePortal('/products?type=subscription');
  let products = (data && data.products) || [];
  if (order && window.SourcePreview) products = window.SourcePreview.applyOrder(products, order, 'baseSku');

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <h1 className="page-title">Prenumerationer</h1>
        <p className="page-subtitle">Återkommande välmående, på dina villkor</p>
      </section>
      <section className="portal-section">
        {loading && !data && <p className="portal-loading">Laddar prenumerationer…</p>}
        {error && !data && <p className="portal-error">Prenumerationerna kunde inte hämtas just nu.</p>}
        {(data || draft) && (
          <ProductGrid products={products} preset={preset} draft={draft} emptyText="Inga prenumerationer att visa just nu." />
        )}
      </section>
    </div>
  );
};

export default Subscriptions;
