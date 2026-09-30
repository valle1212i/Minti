import React, { useState } from 'react';
import { usePortal, usePreset, usePreview, STOREFRONT_PRESET_KEYS, presetClassNames, presetStyle } from '../lib/portal';
import '../components/ProductGrid.css';

export function NewsList({ items, preset, limit }) {
  const list = (items || []).slice(0, limit || undefined);
  if (list.length === 0) return <p className="portal-empty">Inga nyheter just nu.</p>;
  const asGrid = preset && preset.layoutVariant && preset.layoutVariant !== 'list';
  const date = (iso) => (iso ? new Date(iso).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' }) : '');
  const card = (n) => (
    <article key={n.id} className={asGrid ? 'portal-card' : 'portal-news-item'}>
      <div className={asGrid ? 'portal-card-body' : undefined}>
        {n.startAt && <p className="portal-news-date">{date(n.startAt)}</p>}
        <h3 className="portal-card-title">{n.title}</h3>
        {(!preset || preset.showExcerpt !== false) && n.body && <p className="portal-news-body">{n.body}</p>}
        {n.ctaUrl && /^https?:\/\//.test(n.ctaUrl) && (
          <a className="btn btn-primary" href={n.ctaUrl} rel="noopener noreferrer">{n.ctaLabel || 'Läs mer'}</a>
        )}
      </div>
    </article>
  );
  if (!asGrid) return <div>{list.map(card)}</div>;
  return <div className={presetClassNames(preset)} style={presetStyle(preset)}>{list.map(card)}</div>;
}

// /news — nyheter från kundportalen i den design tenanten valt i nyhetsdesign (surface news).
const News = () => {
  const saved = usePreset('news');
  const [livePreset, setLivePreset] = useState(null);
  const preset = { ...(saved || {}), ...(livePreset || {}) };

  usePreview({
    surface: 'news',
    presetKeys: STOREFRONT_PRESET_KEYS,
    onPreset: (p) => setLivePreset(p),
    onClear: () => setLivePreset(null)
  });

  const { data, error, loading } = usePortal('/news');

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <h1 className="page-title">Nyheter</h1>
        <p className="page-subtitle">Det senaste från oss</p>
      </section>
      <section className="portal-section">
        {loading && !data && <p className="portal-loading">Laddar nyheter…</p>}
        {error && !data && <p className="portal-error">Nyheterna kunde inte hämtas just nu.</p>}
        {data && <NewsList items={data.data || data.news} preset={preset} />}
      </section>
    </div>
  );
};

export default News;
