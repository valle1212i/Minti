import React from 'react';
import { Section, SectionHead, DemoNote, usePageTitle } from '../components/ui';

const Terms = () => {
  usePageTitle('Villkor');
  return (
    <div className="m-page">
      <Section narrow>
        <SectionHead eyebrow="Villkor" title="Användarvillkor" />
        <DemoNote>Minti är en konceptsajt. Villkoren nedan är exempel på hur en spaanläggning kan formulera sig.</DemoNote>
        <div className="m-prose">
          <h2>Om sajten</h2>
          <p>
            Minti är en påhittad wellnessanläggning som visar hur en sajt med bokning, butik och presentkort
            kan se ut. Inga köp, bokningar eller betalningar genomförs.
          </p>
          <h2>Priser</h2>
          <p>Alla priser är exempel och gäller inte som erbjudanden.</p>
          <h2>Exempel: bokning och avbokning</h2>
          <ul>
            <li>En bokning kan avbokas kostnadsfritt fram till 24 timmar före besöket.</li>
            <li>Kom gärna 15 minuter innan din tid för att hinna byta om.</li>
            <li>Gäster under 13 år kan inte besöka baden.</li>
          </ul>
          <h2>Exempel: presentkort</h2>
          <p>Ett presentkort gäller i ett år från köpdagen och kan användas till alla upplevelser.</p>
          <h2>Bilder och texter</h2>
          <p>Bilder och texter är skapade för konceptet och föreställer inga verkliga personer eller platser.</p>
        </div>
      </Section>
    </div>
  );
};

export default Terms;
