import React from 'react';
import { Link } from 'react-router-dom';
import { Picture } from './ui';
import { formatKr } from '../data/site';
import { fromPrice } from '../data/shop';

export function priceText(product) {
  const min = fromPrice(product);
  const many = product.variants.length > 1;
  const suffix = product.interval ? ` / ${product.interval}` : '';
  return `${many ? 'från ' : ''}${formatKr(min)}${suffix}`;
}

const ProductCard = ({ product }) => {
  const href = `/product/${encodeURIComponent(product.id)}`;
  return (
    <article className="m-card">
      <Link to={href} className="m-card-media" tabIndex={-1} aria-hidden="true">
        <Picture name={product.image} alt="" sizes="(max-width: 768px) 100vw, 33vw" />
      </Link>
      <div className="m-card-body">
        <h2 className="m-card-title">
          <Link to={href} className="m-card-link">{product.title}</Link>
        </h2>
        <p className="m-card-text">{product.description}</p>
        <div className="m-card-foot">
          <p className="m-price">
            {priceText(product)}
            <span className="m-price-note">Exempelpris</span>
          </p>
          <Link to={href} className="m-btn m-btn--outline">Välj</Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
