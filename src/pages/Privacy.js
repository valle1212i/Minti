import React from 'react';
import { Section, SectionHead, DemoNote, usePageTitle } from '../components/ui';
import { SITE } from '../data/site';

const Privacy = () => {
  usePageTitle('Integritetspolicy');
  return (
    <div className="m-page">
      <Section narrow>
        <SectionHead eyebrow="Integritet" title="Integritetspolicy" />
        <DemoNote>Minti är en konceptsajt. Texten nedan beskriver hur demosajten fungerar, inte ett riktigt företag.</DemoNote>
        <div className="m-prose">
          <h2>Vilka uppgifter samlar sajten in?</h2>
          <p>
            Inga. Formulären för kontakt, bokning och kassa är demor som bara visar ett svar i din webbläsare.
            Det du skriver skickas inte till någon server och sparas inte.
          </p>
          <h2>Kakor och spårning</h2>
          <p>
            Sajten använder inga kakor för spårning eller marknadsföring och har ingen analystjänst.
            Därför finns heller ingen kakruta.
          </p>
          <h2>Typsnitt</h2>
          <p>
            Typsnitten Inter och Playfair Display hämtas från Google Fonts. Då ser Google din IP-adress,
            som för alla webbplatser som använder tjänsten.
          </p>
          <h2>Kontakt</h2>
          <p>
            Kontaktuppgifterna på sajten är påhittade: {SITE.email} och {SITE.phone} går inte till någon.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default Privacy;
