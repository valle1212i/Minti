import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHero, Section, SectionHead, Picture, ButtonLink, usePageTitle } from '../components/ui';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/shop';
import NotFound from './NotFound';

const CategoryList = () => (
  <div className="m-grid">
    {CATEGORIES.map((c) => {
      const count = PRODUCTS.filter((p) => p.category === c.slug).length;
      return (
        <article className="m-card" key={c.slug}>
          <Link to={`/categories/${c.slug}`} className="m-card-media" tabIndex={-1} aria-hidden="true">
            <Picture name={c.image} alt="" sizes="(max-width: 768px) 100vw, 25vw" />
          </Link>
          <div className="m-card-body">
            <h2 className="m-card-title">
              <Link to={`/categories/${c.slug}`} className="m-card-link">{c.name}</Link>
            </h2>
            <p className="m-card-text">{c.description}</p>
            <p className="m-meta">{count} {count === 1 ? 'upplevelse' : 'upplevelser'}</p>
          </div>
        </article>
      );
    })}
  </div>
);

const Categories = () => {
  const { slug } = useParams();
  const category = slug ? CATEGORIES.find((c) => c.slug === slug) : null;
  usePageTitle(category ? category.name : 'Kategorier');

  if (slug && !category) return <NotFound />;

  if (category) {
    const products = PRODUCTS.filter((p) => p.category === category.slug);
    return (
      <div className="m-page">
        <PageHero eyebrow="Kategori" title={category.name} lead={category.description} image={category.image} imageAlt="" />
        <Section>
          <nav className="m-chips" aria-label="Kategorier">
            <Link to="/shop" className="m-chip">Alla</Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to={`/categories/${c.slug}`}
                className={`m-chip${c.slug === category.slug ? ' is-active' : ''}`}
                aria-current={c.slug === category.slug ? 'page' : undefined}
              >
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="m-grid m-grid--3">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="m-page">
      <PageHero
        eyebrow="Kategorier"
        title="Hitta rätt upplevelse"
        lead="Bad och bastu, behandlingar, mat eller en hel vistelse."
        image="restaturantforspa"
        imageAlt="Restaurang i varmt ljus"
      />
      <Section>
        <SectionHead eyebrow="Alla kategorier" title="Välj kategori" />
        <CategoryList />
        <div className="m-actions">
          <ButtonLink to="/shop" variant="outline">Se alla upplevelser</ButtonLink>
        </div>
      </Section>
    </div>
  );
};

export default Categories;
