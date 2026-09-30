import React from 'react';
import { Link } from 'react-router-dom';
import { usePortal, usePreset } from '../lib/portal';
import { NewsList } from '../pages/News';
import '../components/ProductGrid.css';

const ON_LANDING = ['landing', 'both'];

// Startsidans sektioner som styrs från kundportalen (landing-layout): nyheter och
// kategorier visas här när tenanten placerat dem på startsidan.
const LandingSections = () => {
  const { data: landing } = usePortal('/landing-layout');
  const placements = (landing && landing.placements) || {};
  const showNews = ON_LANDING.includes(placements.news);
  const showCategories = ON_LANDING.includes(placements.categories);
  const newsPreset = usePreset('news');
  const news = usePortal(showNews ? '/news' : null);
  const categories = usePortal(showCategories ? '/categories' : null);

  if (!showNews && !showCategories) return null;
  const categoryList = (categories.data && categories.data.categories) || [];

  return (
    <>
      {showNews && news.data && (
        <section className="portal-section">
          <h2 className="section-title">Nyheter</h2>
          <NewsList items={news.data.data || news.data.news} preset={newsPreset} limit={3} />
          <Link to="/news" className="btn btn-outline">Alla nyheter</Link>
        </section>
      )}
      {showCategories && categoryList.length > 0 && (
        <section className="portal-section">
          <h2 className="section-title">Kategorier</h2>
          <div className="portal-chips">
            {categoryList.map((c) => (
              <Link key={c.id} className="portal-chip" to={`/categories/${encodeURIComponent(c.slug)}`}>{c.name}</Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default LandingSections;
