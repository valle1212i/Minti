import React, { useState } from 'react';
import { formatPrice, presetClassNames, presetStyle, startCheckout } from '../lib/portal';
import './ProductGrid.css';

const INTERVAL_LABELS = { day: 'dag', week: 'vecka', month: 'månad', year: 'år' };

function priceLabel(product) {
  if (product.priceOnRequest) return 'Pris på förfrågan';
  const range = product.priceRange || {};
  if (typeof range.min !== 'number') return '';
  const base = range.min === range.max ? formatPrice(range.min) : `från ${formatPrice(range.min)}`;
  if (product.type === 'subscription' && product.subscription) {
    const count = product.subscription.intervalCount || 1;
    const unit = INTERVAL_LABELS[product.subscription.interval] || product.subscription.interval;
    return `${base} / ${count > 1 ? `${count} ` : ''}${unit}`;
  }
  return base;
}

function firstBuyableVariant(product) {
  return (product.variants || []).find((v) => v && v.stripePriceId && v.articleNumber && v.inStock !== false) || null;
}

export const ProductCard = ({ product, preset, draft = false }) => {
  const [status, setStatus] = useState('');
  const variant = firstBuyableVariant(product);
  const image = (product.images && product.images[0]) || (variant && variant.imageUrl) || null;
  const canBuy = !draft && !product.priceOnRequest && !!variant;

  const buy = async () => {
    setStatus('');
    try {
      await startCheckout({ variant });
    } catch (err) {
      setStatus(err.message || 'Kassan kunde inte öppnas');
    }
  };

  return (
    <article className={`portal-card${draft ? ' portal-card-draft' : ''}`}>
      {image && <img className="portal-card-image" src={image} alt={product.title || ''} loading="lazy" />}
      <div className="portal-card-body">
        {draft && <span className="portal-badge">Förhandsvisning</span>}
        {!draft && preset && preset.showBadges !== false && product.inStock === false && (
          <span className="portal-badge">Slut i lager</span>
        )}
        <h3 className="portal-card-title">{product.title}</h3>
        {preset && preset.showExcerpt !== false && product.description && (
          <p className="portal-card-text">{product.description}</p>
        )}
        <p className="portal-card-price">{priceLabel(product)}</p>
        {canBuy && (
          <button type="button" className="btn btn-primary portal-card-action" onClick={buy}>
            {product.type === 'subscription' ? 'Prenumerera' : 'Köp'}
          </button>
        )}
        {status && <p className="portal-error" role="alert">{status}</p>}
      </div>
    </article>
  );
};

const ProductGrid = ({ products, preset, draft, emptyText }) => {
  const list = Array.isArray(products) ? products : [];
  if (!draft && list.length === 0) {
    return <p className="portal-empty">{emptyText || 'Inga produkter att visa just nu.'}</p>;
  }
  return (
    <div className={presetClassNames(preset)} style={presetStyle(preset)}>
      {draft && <ProductCard product={draft} preset={preset} draft />}
      {list.map((p) => (
        <ProductCard key={p.id || p.baseSku} product={p} preset={preset} />
      ))}
    </div>
  );
};

export default ProductGrid;
