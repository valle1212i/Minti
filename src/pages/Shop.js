import React, { useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { usePortal, usePreview } from '../lib/portal';
import '../components/ProductGrid.css';

// /shop — produkterna från kundportalen. Portalens produktguide ramar in sidan och
// skickar ett utkast (SOURCE_PREVIEW_PRODUCT) som visas överst tills CLEAR.
const Shop = () => {
  const { data, error, loading } = usePortal('/products?excludeType=gift_card');
  const [draft, setDraft] = useState(null);

  usePreview({
    surface: 'products',
    onProduct: (product) => setDraft({ ...product, id: '__preview__' }),
    onClear: () => setDraft(null)
  });

  const products = (data && data.products) || [];

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <h1 className="page-title">Butik</h1>
        <p className="page-subtitle">Upplevelser och produkter att boka eller köpa</p>
      </section>
      <section className="portal-section">
        {loading && !data && <p className="portal-loading">Laddar produkter…</p>}
        {error && !data && <p className="portal-error">Produkterna kunde inte hämtas just nu.</p>}
        {(data || draft) && <ProductGrid products={products} draft={draft} />}
      </section>
    </div>
  );
};

export default Shop;
