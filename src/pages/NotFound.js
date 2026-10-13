import React from 'react';
import { Section, SectionHead, ButtonLink, usePageTitle } from '../components/ui';

const NotFound = () => {
  usePageTitle('Sidan finns inte');
  return (
    <div className="m-page">
      <Section narrow>
        <div className="m-notfound">
          <p className="m-notfound-code" aria-hidden="true">404</p>
          <SectionHead
            center
            eyebrow="Sidan finns inte"
            title="Här var det tomt"
            text="Sidan du letar efter finns inte eller har flyttats. Prova någon av länkarna nedan."
          />
          <div className="m-actions m-actions--center">
            <ButtonLink to="/">Till startsidan</ButtonLink>
            <ButtonLink to="/book" variant="outline">Boka besök</ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default NotFound;
