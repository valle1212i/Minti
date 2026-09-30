import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { usePortal, usePreset, usePreview, STOREFRONT_PRESET_KEYS, presetClassNames, presetStyle } from '../lib/portal';
import '../components/ProductGrid.css';

function flatten(categories, out = []) {
  for (const c of categories || []) {
    out.push(c);
    flatten(c.subcategories, out);
  }
  return out;
}

// /categories och /categories/:slug — kategorierna och deras produkter från kundportalen,
// i den design tenanten valt i portalens kategoridesign (surface categories).
const Categories = () => {
  const { slug } = useParams();
  const saved = usePreset('categories');
  const [livePreset, setLivePreset] = useState(null);
  const preset = { ...(saved || {}), ...(livePreset || {}) };

  usePreview({
    surface: 'categories',
    presetKeys: STOREFRONT_PRESET_KEYS,
    onPreset: (p) => setLivePreset(p),
    onClear: () => setLivePreset(null)
  });

  const { data, error, loading } = usePortal('/categories');
  const products = usePortal(slug ? `/categories/${encodeURIComponent(slug)}/products` : null);
  const all = flatten((data && data.categories) || []);
  const current = slug ? all.find((c) => c.slug === slug) : null;

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <h1 className="page-title">{current ? current.name : 'Kategorier'}</h1>
        {current && current.description && <p className="page-subtitle">{current.description}</p>}
      </section>
      <section className="portal-section">
        {loading && !data && <p className="portal-loading">Laddar kategorier…</p>}
        {error && !data && <p className="portal-error">Kategorierna kunde inte hämtas just nu.</p>}
        {data && all.length === 0 && <p className="portal-empty">Inga kategorier att visa just nu.</p>}
        {!slug && all.length > 0 && (
          <div className={presetClassNames(preset)} style={presetStyle(preset)}>
            {all.map((c) => (
              <Link key={c.id} to={`/categories/${encodeURIComponent(c.slug)}`} className="portal-card">
                {c.imageUrl && preset.imageStyle !== 'none' && <img className="portal-card-image" src={c.imageUrl} alt="" loading="lazy" />}
                <div className="portal-card-body">
                  <h3 className="portal-card-title">{c.name}</h3>
                  {preset.showExcerpt !== false && c.description && <p className="portal-card-text">{c.description}</p>}
                  {preset.showBadges !== false && <span className="portal-badge">{c.productCount} st</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
        {slug && (
          <>
            <div className="portal-chips">
              <Link className="portal-chip" to="/categories">Alla kategorier</Link>
              {all.map((c) => (
                <Link key={c.id} className={`portal-chip${c.slug === slug ? ' active' : ''}`} to={`/categories/${encodeURIComponent(c.slug)}`}>
                  {c.name}
                </Link>
              ))}
            </div>
            {products.loading && !products.data && <p className="portal-loading">Laddar produkter…</p>}
            {products.data && <ProductGrid products={products.data.products} preset={preset} />}
          </>
        )}
      </section>
    </div>
  );
};

export default Categories;
