import React from 'react';
import { PageHero, Section, SectionHead, DemoNote, Icon, usePageTitle } from '../components/ui';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/shop';

const Subscriptions = () => {
  usePageTitle('Prenumerationer');
  const subs = PRODUCTS.filter((p) => p.type === 'subscription');
  return (
    <div className="m-page">
      <PageHero
        eyebrow="Prenumerationer"
        title="Återkommande lugn"
        lead="För dig som vill komma tillbaka. Ett fast pris i månaden och en plats i baden som väntar."
        image="onespapool"
        imageAlt="Utomhusbad mellan tallar i morgondimma"
      />
      <Section>
        <DemoNote>Prenumerationerna är exempel. Ingen prenumeration startas och inget dras.</DemoNote>
        <div className="m-grid m-grid--3">
          {subs.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>
      <Section tone="tint">
        <SectionHead center eyebrow="Så fungerar det" title="Enkelt och flexibelt" />
        <div className="m-grid m-grid--3">
          <div className="m-feature">
            <Icon name="clock" />
            <h3>Boka när du vill</h3>
            <p>Boka dina besök under Boka. Besöken gäller den månad de hör till.</p>
          </div>
          <div className="m-feature">
            <Icon name="leaf" />
            <h3>Pausa eller avsluta</h3>
            <p>Pausa en månad eller avsluta när du vill, utan bindningstid.</p>
          </div>
          <div className="m-feature">
            <Icon name="hand" />
            <h3>Förmåner</h3>
            <p>Som prenumerant får du förtur till nya kvällsbad och event.</p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Subscriptions;
