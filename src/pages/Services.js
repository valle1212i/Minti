import React from 'react';
import { PageHero, Section, SectionHead, Band, ButtonLink, Picture, DemoNote, usePageTitle } from '../components/ui';
import { PRICE_NOTE, formatKr } from '../data/site';

const services = [
  {
    title: 'Bad & källor',
    image: 'onespapool',
    alt: 'Utomhusbad mellan tallar och stenar i morgondimma',
    description: 'Varma bad inomhus och utomhus, kolsyrebad och kallbad. Rör dig mellan dem i din egen takt.',
    features: ['Varma inomhusbad', 'Utomhusbad året om', 'Kolsyrebad i tyst zon', 'Kallbad']
  },
  {
    title: 'Bastu & kallbad',
    image: 'bastu1',
    alt: 'Utomhusbastu med öppen dörr mot dimmig klippkust',
    description: 'Torrbastu, ångbastu med salt och en lugn vilobastu. Kallbadet ligger alltid nära.',
    features: ['Torrbastu', 'Ångbastu med salt', 'Vilobastu', 'Bastuceremoni']
  },
  {
    title: 'Behandlingar',
    image: 'dasspaspic',
    alt: 'Gäst som vilar i varmt vatten med blicken mot ljuset',
    description: 'Massage och ansiktsbehandlingar i lugna rum, som du lägger till ditt besök.',
    features: ['Avslappnande massage', 'Ansiktsbehandling', 'Fotbehandling', 'Behandling för två']
  },
  {
    title: 'Stillhet & yoga',
    image: 'zengarden',
    alt: 'Stenlagd stig genom en grönskande trädgård',
    description: 'Lugna yogapass och guidad stillhet i trädgården eller i vårt ljusa övningsrum.',
    features: ['Morgonyoga', 'Guidad stillhet', 'Andningspass', 'Trädgårdspromenad']
  },
  {
    title: 'Mat & dryck',
    image: 'restaturantforspa',
    alt: 'Kock vid öppen eld i en dämpat upplyst restaurang',
    description: 'Säsongens råvaror i restaurangen, lättare rätter i baren och te i vilorummet.',
    features: ['Lunch i badrock', 'Avsmakningsmeny', 'Vegetarisk meny', 'Te och frukt i vilorummet']
  },
  {
    title: 'Övernattning',
    image: 'spapictureofapart',
    alt: 'Ljust rum med låg säng och stora fönster mot havet',
    description: 'Ljusa rum med utsikt mot vattnet, frukost och tillgång till baden båda dagarna.',
    features: ['Rum med havsutsikt', 'Frukost ingår', 'Bad båda dagarna', 'Sen utcheckning']
  }
];

const packages = [
  { name: 'Dagspa', price: 895, duration: 'En dag', features: ['Bad, bastu och vilorum', 'Badrock och tofflor', 'Te och frukt'] },
  { name: 'Dag med behandling', price: 1790, duration: 'En dag', featured: true, features: ['Allt i dagspa', 'Massage 50 minuter', 'Lunch i restaurangen'] },
  { name: 'Vistelse', price: 3790, duration: 'En natt, två personer', features: ['Rum med havsutsikt', 'Middag och frukost', 'Bad båda dagarna'] }
];

const Services = () => {
  usePageTitle('Tjänster');
  return (
    <div className="m-page">
      <PageHero
        eyebrow="Tjänster"
        title="Våra upplevelser"
        lead="Bad, bastu, behandlingar och mat. Sätt ihop ett besök som passar dig, för några timmar eller några dagar."
        image="bastunummer2"
        imageAlt="Ljus träbastu med stort fönster mot grönska"
      />

      <Section>
        <SectionHead center eyebrow="Det här finns hos oss" title="Allt under ett tak" />
        <div className="m-grid m-grid--3">
          {services.map((s) => (
            <article className="m-card" key={s.title}>
              <div className="m-card-media">
                <Picture name={s.image} alt={s.alt} sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="m-card-body">
                <h2 className="m-card-title">{s.title}</h2>
                <p className="m-card-text">{s.description}</p>
                <ul className="m-list">
                  {s.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <div className="m-card-foot">
                  <ButtonLink to="/book">Boka</ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="tint">
        <SectionHead center eyebrow="Paket" title="Exempel på paket" text="Så här kan ett paket se ut." />
        <DemoNote>{PRICE_NOTE}</DemoNote>
        <div className="m-grid m-grid--3">
          {packages.map((p) => (
            <article className={`m-panel${p.featured ? ' m-panel--featured' : ''}`} key={p.name}>
              {p.featured && <p className="m-eyebrow">Populärt val</p>}
              <h3 className="m-card-title">{p.name}</h3>
              <p className="m-price">
                {formatKr(p.price)}
                <span className="m-price-note">Exempelpris · {p.duration}</span>
              </p>
              <ul className="m-list">
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <div className="m-actions">
                <ButtonLink to="/book" variant={p.featured ? 'primary' : 'outline'}>Boka</ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Band
        eyebrow="Frågor?"
        title="Vi hjälper dig att planera"
        text="Berätta vad du vill uppleva, så föreslår vi ett upplägg."
      >
        <ButtonLink to="/contact" variant="light">Kontakta oss</ButtonLink>
        <ButtonLink to="/gallery" variant="ghost">Se galleriet</ButtonLink>
      </Band>
    </div>
  );
};

export default Services;
