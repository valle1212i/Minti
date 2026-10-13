import React from 'react';
import { PageHero, Section, SectionHead, Split, Band, ButtonLink, usePageTitle } from '../components/ui';

const saunas = [
  {
    title: 'Ångbastu med salt',
    label: 'Ångbastu',
    description: 'Ta med en handfull salt in i ångbastun och låt den varma, fuktiga luften göra resten. Inne i bastun finns handduschar att skölja av sig med.',
    meta: 'Cirka 42–45 °C',
    image: 'infrarodbastu',
    alt: 'Bastu i mörkt trä med varmt rött ljus'
  },
  {
    title: 'Torrbastun',
    label: 'Torrbastu',
    description: 'Slå dig ner och blicka ut över grönskan genom det stora fönstret. När du är redo väntar kallduschen precis utanför.',
    meta: 'Cirka 80 °C',
    image: 'bastunummer2',
    alt: 'Ljus träbastu med stort fönster mot grönska'
  },
  {
    title: 'Vilobastun',
    label: 'Vila',
    description: 'En mild och lugn bastu för vila. Lägg dig ner, slumra en stund och låt värmen från stenhällarna omsluta dig.',
    meta: 'Cirka 40 °C',
    badge: 'Tyst zon',
    image: 'dasspaspic',
    alt: 'Gäst som vilar i varmt vatten med blicken mot ljuset'
  },
  {
    title: 'Utomhusbastun och kallbadet',
    label: 'Utomhus',
    description: 'Utomhusbastun ligger vid vattnet med utsikt över klipporna. Kallbadet finns precis intill, för den som vill växla mellan värme och kyla.',
    meta: 'Bastu cirka 80–90 °C · kallbad cirka 12 °C',
    image: 'bastu1',
    alt: 'Utomhusbastu med öppen dörr mot dimmig klippkust'
  }
];

const Bastu = () => {
  usePageTitle('Bastu');
  return (
    <div className="m-page">
      <PageHero
        eyebrow="Bastu"
        title="Värme och vila"
        lead="Fyra olika bastur med olika värme och fukt. Välj den som passar dig, eller prova alla."
        image="bastu1"
        imageAlt="Utomhusbastu med öppen dörr mot dimmig klippkust"
      />

      <Section narrow>
        <SectionHead
          center
          eyebrow="Våra bastur"
          title="Värme i flera former"
          text="Basturna nedan är gemensamma. I omklädningsrummen finns dessutom en mindre torrbastu."
        />
      </Section>

      {saunas.map((s, i) => (
        <Split
          key={s.title}
          reverse={i % 2 === 1}
          tone={i % 2 === 1 ? 'tint' : undefined}
          image={s.image}
          imageAlt={s.alt}
          eyebrow={s.label}
          title={s.title}
          badge={s.badge}
        >
          <p className="m-text">{s.description}</p>
          <p className="m-meta">{s.meta}</p>
        </Split>
      ))}

      <Band eyebrow="Upptäck basturna" title="Boka ditt besök" text="Basturna ingår i dagspa och kvällsbad.">
        <ButtonLink to="/book" variant="light">Boka</ButtonLink>
        <ButtonLink to="/wellness-experience" variant="ghost">Om upplevelsen</ButtonLink>
      </Band>
    </div>
  );
};

export default Bastu;
