import React from 'react';
import { Link } from 'react-router-dom';
import { PageHero, Section, DemoNote, usePageTitle } from '../components/ui';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/shop';

const Shop = () => {
  usePageTitle('Butik');
  const products = PRODUCTS.filter((p) => p.type === 'product');
  return (
    <div className="m-page">
      <PageHero
        eyebrow="Butik"
        title="Upplevelser att boka och ge bort"
        lead="Dagspa, behandlingar, middag och vistelser. Välj en upplevelse åt dig själv eller någon du tycker om."
        image="poolnumebr1"
        imageAlt="Inomhusbassäng med mörka stenväggar"
      />
      <Section>
        <DemoNote>Priserna är exempel. Kassan är en demo och tar inte emot betalning.</DemoNote>
        <nav className="m-chips" aria-label="Kategorier">
          <Link to="/shop" className="m-chip is-active" aria-current="page">Alla</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/categories/${c.slug}`} className="m-chip">{c.name}</Link>
          ))}
          <Link to="/gift-cards" className="m-chip">Presentkort</Link>
          <Link to="/subscriptions" className="m-chip">Prenumerationer</Link>
        </nav>
        <div className="m-grid m-grid--3">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>
    </div>
  );
};

export default Shop;
