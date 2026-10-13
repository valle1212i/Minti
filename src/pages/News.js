import React from 'react';
import { Link } from 'react-router-dom';
import { PageHero, Section, Picture, usePageTitle } from '../components/ui';
import { NEWS, formatDate } from '../data/news';

const News = () => {
  usePageTitle('Nyheter');
  const items = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="m-page">
      <PageHero
        eyebrow="Nyheter"
        title="Nytt från Minti"
        lead="Säsongens meny, öppettider och livet i trädgården."
        image="zengarden"
        imageAlt="Stenlagd stig genom trädgården"
      />
      <Section>
        <div className="m-grid m-grid--3">
          {items.map((n) => (
            <article className="m-card" key={n.slug}>
              <Link to={`/news/${n.slug}`} className="m-card-media" tabIndex={-1} aria-hidden="true">
                <Picture name={n.image} alt="" sizes="(max-width: 768px) 100vw, 33vw" />
              </Link>
              <div className="m-card-body">
                <p className="m-eyebrow"><time dateTime={n.date}>{formatDate(n.date)}</time></p>
                <h2 className="m-card-title">
                  <Link to={`/news/${n.slug}`} className="m-card-link">{n.title}</Link>
                </h2>
                <p className="m-card-text">{n.excerpt}</p>
                <div className="m-card-foot">
                  <Link to={`/news/${n.slug}`} className="m-link">Läs mer</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default News;
