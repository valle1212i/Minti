import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { priceLabel, intervalSuffix } from '../components/ProductGrid';
import { usePortal, startCheckout } from '../lib/portal';
import '../components/ProductGrid.css';

// /product/:id — en produkt från kundportalen (id är produktens baseSku, samma som
// produktkortens id). Läser adapterns GET /product/:id, som inte cachas, så pris och
// lagerstatus är färska. Köpknappen går via samma kassaflöde som butikens kort.
//
// Ingen förhandsvisningsmottagare: portalen ramar bara in fasta sökvägar (/shop,
// /categories, /subscriptions, /gift-cards, /news, /book), aldrig en produktsida.

function variantLabel(variant) {
  const parts = [variant.size, variant.color].filter((v) => typeof v === 'string' && v.trim());
  return parts.length ? parts.join(' / ') : variant.articleNumber;
}

function stockLabel(variant) {
  if (variant.outOfStock) return 'Slut i lager';
  if (variant.lowStock) return 'Få kvar';
  if (variant.inStock && typeof variant.stock === 'number' && variant.stock > 0) return 'I lager';
  return '';
}

function isBuyable(product, variant) {
  return !!variant && !product.priceOnRequest && !!variant.stripePriceId && !!variant.articleNumber && !variant.outOfStock;
}

const Product = () => {
  const { id } = useParams();
  const { data, error, loading, reload } = usePortal(`/product/${encodeURIComponent(id)}`);
  const product = data && data.product;
  const variants = (product && product.variants) || [];
  // Valet gäller den produkt det gjordes på; en annan produkt börjar om från förvalet.
  const [choice, setChoice] = useState({ productId: null, variantKey: '', imageIndex: 0 });
  const [status, setStatus] = useState({ sending: false, error: '' });

  if (loading && !data) {
    return (
      <div className="portal-page">
        <section className="portal-section"><p className="portal-loading">Laddar produkten…</p></section>
      </div>
    );
  }

  if (!product) {
    const notFound = error && error.status === 404;
    return (
      <div className="portal-page">
        <section className="portal-hero">
          <h1 className="page-title">{notFound ? 'Produkten finns inte' : 'Produkten kunde inte visas'}</h1>
        </section>
        <section className="portal-section portal-product-empty">
          <p className="portal-empty">
            {notFound
              ? 'Produkten finns inte eller är inte längre tillgänglig.'
              : 'Produkten kunde inte hämtas just nu. Försök igen om en stund.'}
          </p>
          <div className="portal-product-empty-actions">
            {!notFound && (
              <button type="button" className="btn btn-secondary" onClick={() => reload()}>Försök igen</button>
            )}
            <Link to="/shop" className="btn btn-primary">Till butiken</Link>
          </div>
        </section>
      </div>
    );
  }

  // Förvald variant: den första köpbara, annars den första.
  const own = choice.productId === product.id;
  const defaultVariant = variants.find((v) => isBuyable(product, v)) || variants[0] || null;
  const variantKey = own && choice.variantKey ? choice.variantKey : (defaultVariant ? defaultVariant.articleNumber : '');
  const imageIndex = own ? choice.imageIndex : 0;
  const setVariantKey = (key) => setChoice({ productId: product.id, variantKey: key, imageIndex });
  const setImageIndex = (i) => setChoice({ productId: product.id, variantKey, imageIndex: i });
  const variant = variants.find((v) => v.articleNumber === variantKey) || defaultVariant;
  const images = (product.images && product.images.length ? product.images : [variant && variant.imageUrl].filter(Boolean));
  const mainImage = images[Math.min(imageIndex, images.length - 1)] || null;
  const canBuy = isBuyable(product, variant);
  const price = product.priceOnRequest
    ? 'Pris på förfrågan'
    : (variant && variant.priceFormatted) || priceLabel(product);
  const stock = variant ? stockLabel(variant) : '';

  const buy = async () => {
    setStatus({ sending: true, error: '' });
    try {
      await startCheckout({ variant });
    } catch (err) {
      setStatus({ sending: false, error: err.message || 'Kassan kunde inte öppnas' });
    }
  };

  return (
    <div className="portal-page">
      <section className="portal-section">
        <nav className="portal-chips" aria-label="Sökväg">
          <Link className="portal-chip" to="/shop">Butik</Link>
          {product.categorySlug && product.categoryInfo && (
            <Link className="portal-chip" to={`/categories/${encodeURIComponent(product.categorySlug)}`}>{product.categoryInfo.name}</Link>
          )}
        </nav>
        <div className="portal-product">
          <div className="portal-product-media">
            {mainImage
              ? <img className="portal-product-image" src={mainImage} alt={product.title || ''} />
              : <div className="portal-product-image portal-product-noimage" aria-hidden="true" />}
            {images.length > 1 && (
              <div className="portal-product-thumbs">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`portal-product-thumb${i === imageIndex ? ' active' : ''}`}
                    onClick={() => setImageIndex(i)}
                    aria-label={`Visa bild ${i + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="portal-product-info">
            <h1 className="portal-product-title">{product.title}</h1>
            <p className="portal-product-price">
              {price}{product.priceOnRequest || !(variant && variant.priceFormatted) ? '' : intervalSuffix(product)}
            </p>
            {product.description && <p className="portal-product-description">{product.description}</p>}

            {variants.length > 1 && (
              <fieldset className="portal-product-variants">
                <legend>Välj variant</legend>
                {variants.map((v) => (
                  <label key={v.articleNumber} className={`portal-product-variant${v.articleNumber === variantKey ? ' active' : ''}${v.outOfStock ? ' disabled' : ''}`}>
                    <input
                      type="radio"
                      name="variant"
                      value={v.articleNumber}
                      checked={v.articleNumber === variantKey}
                      onChange={() => setVariantKey(v.articleNumber)}
                    />
                    <span className="portal-product-variant-name">{variantLabel(v)}</span>
                    {!product.priceOnRequest && v.priceFormatted && <span className="portal-product-variant-price">{v.priceFormatted}</span>}
                    {stockLabel(v) && <span className="portal-badge">{stockLabel(v)}</span>}
                  </label>
                ))}
              </fieldset>
            )}

            {variants.length === 1 && stock && <span className="portal-badge">{stock}</span>}

            {canBuy && (
              <button type="button" className="btn btn-primary portal-product-buy" onClick={buy} disabled={status.sending}>
                {status.sending ? 'Öppnar kassan…' : (product.type === 'subscription' ? 'Prenumerera' : 'Köp')}
              </button>
            )}
            {!canBuy && product.priceOnRequest && (
              <Link to="/contact" className="btn btn-primary portal-product-buy">Kontakta oss</Link>
            )}
            {!canBuy && !product.priceOnRequest && (
              <p className="portal-notice">
                {variant && variant.outOfStock ? 'Varianten är slut i lager just nu.' : 'Produkten går inte att köpa just nu.'}
              </p>
            )}
            {status.error && <p className="portal-error" role="alert">{status.error}</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
