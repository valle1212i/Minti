// Byggstenar för undersidorna, i startsidans formspråk: grön #5a7c65, mörkgröna ytor,
// Inter och versala rubriker. Alla klasser har prefixet m- (src/styles/site.css), så de
// krockar inte med startsidans globala klasser i Home.css.

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { img, SITE } from '../data/site';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Minti` : 'Minti – wellness på ditt vis';
  }, [title]);
}

// Responsiv bild ur public/bilder. `sizes` beskriver hur bred bilden visas.
export function Picture({ name, alt, sizes = '(max-width: 768px) 100vw, 50vw', className, eager = false }) {
  const i = img(name);
  return (
    <img
      className={className}
      src={i.src}
      srcSet={i.srcSet}
      sizes={sizes}
      width={i.width}
      height={i.height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

export function PageHero({ eyebrow, title, lead, image, imageAlt = '', children }) {
  return (
    <section className="m-hero">
      {image && <Picture name={image} alt={imageAlt} sizes="100vw" className="m-hero-img" eager />}
      <div className="m-hero-shade" aria-hidden="true" />
      <div className="m-container m-hero-inner">
        <div className="m-hero-box">
          {eyebrow && <p className="m-eyebrow m-eyebrow--light">{eyebrow}</p>}
          <h1 className="m-hero-title">{title}</h1>
          {lead && <p className="m-hero-lead">{lead}</p>}
          {children && <div className="m-actions">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function Section({ tone, narrow, children, id, labelledBy }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`m-section${tone ? ` m-section--${tone}` : ''}`}>
      <div className={`m-container${narrow ? ' m-container--narrow' : ''}`}>{children}</div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text, center, id }) {
  return (
    <div className={`m-head${center ? ' m-head--center' : ''}`}>
      {eyebrow && <p className="m-eyebrow">{eyebrow}</p>}
      <h2 className="m-title" id={id}>{title}</h2>
      {text && <p className="m-lead">{text}</p>}
    </div>
  );
}

// Bild och text sida vid sida, som startsidans Välmående-sektion.
export function Split({ image, imageAlt, reverse, tone, eyebrow, title, badge, children, id }) {
  return (
    <section id={id} className={`m-split${reverse ? ' m-split--reverse' : ''}${tone ? ` m-split--${tone}` : ''}`}>
      <div className="m-split-media">
        <Picture name={image} alt={imageAlt} />
      </div>
      <div className="m-split-body">
        <div className="m-split-text">
          {eyebrow && <p className="m-eyebrow">{eyebrow}</p>}
          <h2 className="m-title m-title--sm">
            {title}
            {badge && <span className="m-badge">{badge}</span>}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}

export function Band({ eyebrow, title, text, children }) {
  return (
    <section className="m-band">
      <div className="m-container m-container--narrow m-band-inner">
        {eyebrow && <p className="m-eyebrow m-eyebrow--light">{eyebrow}</p>}
        <h2 className="m-title m-title--light">{title}</h2>
        {text && <p className="m-band-text">{text}</p>}
        {children && <div className="m-actions m-actions--center">{children}</div>}
      </div>
    </section>
  );
}

export function DemoNote({ children }) {
  return (
    <p className="m-demo-note" role="note">
      <span className="m-demo-dot" aria-hidden="true" />
      {children || SITE.demoNotice}
    </p>
  );
}

export function ButtonLink({ to, variant = 'primary', children }) {
  return <Link to={to} className={`m-btn m-btn--${variant}`}>{children}</Link>;
}

// Enkla linjeikoner i SVG i stället för emoji.
const ICONS = {
  leaf: 'M5 19c8 0 14-6 14-14-8 0-14 6-14 14zm0 0l7-7',
  circle: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 5v4l3 2',
  hand: 'M7 11V6a1.5 1.5 0 013 0v5m0-1V4.5a1.5 1.5 0 013 0V10m0-.5V6a1.5 1.5 0 013 0v7a6 6 0 01-6 6h-1a5 5 0 01-4-2l-3-4a1.5 1.5 0 012.4-1.8L7 13',
  water: 'M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z',
  flame: 'M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z',
  moon: 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  pin: 'M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12zm0-9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 4v5l3.5 2'
};

export function Icon({ name }) {
  return (
    <svg className="m-icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
      <path d={ICONS[name]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
