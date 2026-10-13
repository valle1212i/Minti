import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Section, Picture, DemoNote, usePageTitle } from '../components/ui';
import { CATEGORIES, findProduct } from '../data/shop';
import { formatKr } from '../data/site';
import NotFound from './NotFound';

const Product = () => {
  const { id } = useParams();
  const product = findProduct(id);
  usePageTitle(product ? product.title : 'Produkten finns inte');
  const navigate = useNavigate();
  const [variantId, setVariantId] = useState(null);
  const [qty, setQty] = useState(1);

  if (!product) return <NotFound />;

  const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
  const category = CATEGORIES.find((c) => c.slug === product.category);
  const back = product.type === 'gift_card' ? { to: '/gift-cards', label: 'Presentkort' }
    : product.type === 'subscription' ? { to: '/subscriptions', label: 'Prenumerationer' }
      : { to: '/shop', label: 'Butik' };

  const toCheckout = () => {
    const q = new URLSearchParams({ produkt: product.id, variant: variant.id, antal: String(qty) });
    navigate(`/kassa?${q.toString()}`);
  };

  return (
    <div className="m-page">
      <Section>
        <nav className="m-breadcrumb" aria-label="Sökväg">
          <Link to={back.to}>{back.label}</Link>
          {category && product.type === 'product' && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/categories/${category.slug}`}>{category.name}</Link>
            </>
          )}
        </nav>
        <div className="m-two">
          <div className="m-product-media">
            <Picture name={product.image} alt={product.imageAlt} eager />
          </div>
          <div>
            <h1 className="m-title">{product.title}</h1>
            <p className="m-price m-price--lg">
              {formatKr(variant.price)}{product.interval ? ` / ${product.interval}` : ''}
              <span className="m-price-note">Exempelpris</span>
            </p>
            <p className="m-text">{product.description}</p>

            {product.variants.length > 1 && (
              <fieldset className="m-options">
                <legend className="m-label">Välj</legend>
                {product.variants.map((v) => (
                  <label key={v.id} className={`m-option${v.id === variant.id ? ' is-active' : ''}`}>
                    <input type="radio" name="variant" value={v.id} checked={v.id === variant.id} onChange={() => setVariantId(v.id)} />
                    <span>{v.label}</span>
                    <span className="m-option-price">{formatKr(v.price)}</span>
                  </label>
                ))}
              </fieldset>
            )}

            {product.type !== 'subscription' && (
              <div className="m-field m-qty">
                <label htmlFor="antal">Antal</label>
                <select id="antal" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                  {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}

            <div className="m-actions">
              <button type="button" className="m-btn m-btn--primary" onClick={toCheckout}>
                {product.type === 'subscription' ? 'Starta prenumeration (demo)' : 'Till kassan (demo)'}
              </button>
            </div>
            <DemoNote>Kassan är en demo. Du kan se hur ett köp går till, men ingen betalning görs.</DemoNote>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Product;
