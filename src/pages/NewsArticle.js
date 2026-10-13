import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Section, Picture, usePageTitle } from '../components/ui';
import { findNews, formatDate } from '../data/news';
import NotFound from './NotFound';

const NewsArticle = () => {
  const { slug } = useParams();
  const item = findNews(slug);
  usePageTitle(item ? item.title : 'Nyheten finns inte');
  if (!item) return <NotFound />;
  return (
    <div className="m-page">
      <Section narrow>
        <nav className="m-breadcrumb" aria-label="Sökväg">
          <Link to="/news">Nyheter</Link>
        </nav>
        <article className="m-prose">
          <p className="m-eyebrow"><time dateTime={item.date}>{formatDate(item.date)}</time></p>
          <h1 className="m-title">{item.title}</h1>
          <figure className="m-figure m-figure--top">
            <Picture name={item.image} alt={item.imageAlt} sizes="(max-width: 900px) 100vw, 860px" eager />
          </figure>
          {item.body.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
        </article>
        <div className="m-actions">
          <Link to="/news" className="m-btn m-btn--outline">Alla nyheter</Link>
        </div>
      </Section>
    </div>
  );
};

export default NewsArticle;
