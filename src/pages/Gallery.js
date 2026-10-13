import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PageHero, Section, Band, ButtonLink, Picture, usePageTitle } from '../components/ui';
import { img } from '../data/site';

const IMAGES = [
  { name: 'poolnumebr1', category: 'bad', title: 'Stora badet', alt: 'Inomhusbassäng mellan råa stenväggar och levande ljus' },
  { name: 'onespapool', category: 'bad', title: 'Utomhusbadet', alt: 'Utomhusbad mellan tallar och stenar i morgondimma' },
  { name: 'anotherpool', category: 'bad', title: 'Det varma badet', alt: 'Kvinna i baddräkt sitter i ett varmt inomhusbad med ånga och varmt ljus' },
  { name: 'poolinside1', category: 'bad', title: 'Kvällsbad', alt: 'Varmt vatten hälls från en träskopa i ett dunkelt bad' },
  { name: 'pictureforbadandkallor', category: 'bad', title: 'Bad i kvällsljus', alt: 'Fötter som kliver ner i ett varmt bad i kvällsljus' },
  { name: 'dasspaspic', category: 'bad', title: 'Vila i vattnet', alt: 'Gäst som vilar i varmt vatten med blicken mot ljuset' },
  { name: 'bastu1', category: 'bastu', title: 'Utomhusbastun', alt: 'Utomhusbastu med öppen dörr mot dimmig klippkust' },
  { name: 'bastunummer2', category: 'bastu', title: 'Torrbastun', alt: 'Ljus träbastu med stort fönster mot grönska' },
  { name: 'infrarodbastu', category: 'bastu', title: 'Vilobastun', alt: 'Bastu i mörkt trä med varmt rött ljus' },
  { name: 'zengarden', category: 'tradgard', title: 'Zen-trädgården', alt: 'Stenlagd stig genom en grönskande trädgård med blommande buskar' },
  { name: 'insidezentype', category: 'tradgard', title: 'Regngången', alt: 'Betonggång med regndusch och ett litet träd' },
  { name: 'restaturantforspa', category: 'mat', title: 'Restaurangen', alt: 'Kock vid öppen eld i en dämpat upplyst restaurang' },
  { name: 'spapictureofapart', category: 'boende', title: 'Rum med havsutsikt', alt: 'Ljust rum med låg säng och stora fönster mot havet' }
];

const CATEGORIES = [
  { id: 'alla', label: 'Alla' },
  { id: 'bad', label: 'Bad' },
  { id: 'bastu', label: 'Bastu' },
  { id: 'tradgard', label: 'Trädgård & miljö' },
  { id: 'mat', label: 'Mat' },
  { id: 'boende', label: 'Boende' }
];

const Gallery = () => {
  usePageTitle('Galleri');
  const [category, setCategory] = useState('alla');
  const [open, setOpen] = useState(null);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  const list = category === 'alla' ? IMAGES : IMAGES.filter((i) => i.category === category);

  const close = useCallback(() => {
    setOpen(null);
    if (lastFocus.current) lastFocus.current.focus();
  }, []);

  const step = useCallback((dir) => {
    setOpen((cur) => (cur === null ? cur : (cur + dir + list.length) % list.length));
  }, [list.length]);

  useEffect(() => {
    if (open === null) return undefined;
    document.documentElement.classList.add('m-scroll-lock');
    if (closeRef.current) closeRef.current.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('m-scroll-lock');
    };
  }, [open, close, step]);

  const current = open !== null ? list[open] : null;

  return (
    <div className="m-page">
      <PageHero
        eyebrow="Galleri"
        title="Rum för lugn"
        lead="Bad, bastu, trädgård och mat. Ta en titt innan du kommer."
        image="onespapool"
        imageAlt="Utomhusbad mellan tallar i dimma"
      />

      <Section>
        <div className="m-chips" role="group" aria-label="Filtrera bilder">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`m-chip${category === c.id ? ' is-active' : ''}`}
              aria-pressed={category === c.id}
              onClick={() => { setCategory(c.id); setOpen(null); }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <ul className="m-gallery">
          {list.map((image, index) => (
            <li key={image.name}>
              <button
                type="button"
                className="m-gallery-item"
                onClick={(e) => { lastFocus.current = e.currentTarget; setOpen(index); }}
                aria-label={`Visa större: ${image.title}`}
              >
                <Picture name={image.name} alt={image.alt} sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                <span className="m-gallery-caption">{image.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {current && (
        <div className="m-lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={close}>
          <div className="m-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={img(current.name).src} alt={current.alt} width="1232" height="928" />
            <div className="m-lightbox-bar">
              <button type="button" className="m-lightbox-btn" onClick={() => step(-1)} aria-label="Föregående bild">‹</button>
              <p>{current.title}</p>
              <button type="button" className="m-lightbox-btn" onClick={() => step(1)} aria-label="Nästa bild">›</button>
            </div>
            <button type="button" ref={closeRef} className="m-lightbox-close" onClick={close} aria-label="Stäng">×</button>
          </div>
        </div>
      )}

      <Band eyebrow="Upplev det själv" title="Välkommen på besök" text="Boka ett dagspa, ett kvällsbad eller en vistelse.">
        <ButtonLink to="/book" variant="light">Boka besök</ButtonLink>
      </Band>
    </div>
  );
};

export default Gallery;
