import React, { useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { formatPrice, portalPost, usePortal, usePreset, usePreview, STOREFRONT_PRESET_KEYS } from '../lib/portal';
import '../components/ProductGrid.css';

// /gift-cards — presentkort från kundportalen (produkter med type gift_card) och kontroll
// av ett presentkorts saldo. Portalen kan förhandsvisa design och ett utkast.
const GiftCards = () => {
  const saved = usePreset('gift_cards');
  const [livePreset, setLivePreset] = useState(null);
  const [draft, setDraft] = useState(null);
  const preset = { ...(saved || {}), ...(livePreset || {}) };

  usePreview({
    surface: 'gift_cards',
    presetKeys: STOREFRONT_PRESET_KEYS,
    onPreset: (p) => setLivePreset(p),
    onProduct: (product) => setDraft({ ...product, type: 'gift_card', id: '__preview__' }),
    onClear: () => { setLivePreset(null); setDraft(null); }
  });

  const { data, error, loading } = usePortal('/products?type=gift_card');
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const verify = async (e) => {
    e.preventDefault();
    setChecking(true);
    setResult(null);
    try {
      const res = await portalPost('/gift-cards/verify', { code: code.trim() });
      const card = res.data || {};
      setResult({ ok: true, text: `Saldo: ${formatPrice(card.remainingAmount)}${card.expiresAt ? `, giltigt till ${new Date(card.expiresAt).toLocaleDateString('sv-SE')}` : ''}` });
    } catch (err) {
      setResult({ ok: false, text: 'Presentkortet kunde inte hittas eller är ogiltigt.' });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <h1 className="page-title">Presentkort</h1>
        <p className="page-subtitle">Ge bort en stund av lugn</p>
      </section>
      <section className="portal-section">
        {loading && !data && <p className="portal-loading">Laddar presentkort…</p>}
        {error && !data && <p className="portal-error">Presentkorten kunde inte hämtas just nu.</p>}
        {(data || draft) && (
          <ProductGrid products={(data && data.products) || []} preset={preset} draft={draft} emptyText="Inga presentkort att köpa just nu." />
        )}
      </section>
      <section className="portal-section">
        <h2 className="section-title">Kontrollera saldo</h2>
        <form className="portal-form" onSubmit={verify}>
          <div className="form-group">
            <label htmlFor="giftcard-code">Presentkortskod</label>
            <input id="giftcard-code" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" required maxLength={64} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={checking}>
            {checking ? 'Kontrollerar…' : 'Kontrollera'}
          </button>
          {result && <p className={result.ok ? 'portal-notice' : 'portal-error'} role="status">{result.text}</p>}
        </form>
      </section>
    </div>
  );
};

export default GiftCards;
