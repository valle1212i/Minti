import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Section, SectionHead, ButtonLink, DemoNote, usePageTitle } from '../components/ui';

const Thanks = () => {
  usePageTitle('Tack');
  const [params] = useSearchParams();
  const purchase = params.get('typ') === 'kop';
  return (
    <div className="m-page">
      <Section narrow>
        <SectionHead
          eyebrow="Tack"
          title={purchase ? 'Tack för ditt demoköp' : 'Tack!'}
          text={purchase
            ? 'Så här ser bekräftelsen ut efter ett köp. Eftersom Minti är en demosajt drogs inga pengar och ingen order skapades.'
            : 'Vi har tagit emot det du skickade. På demosajten skickas dock ingenting på riktigt.'}
        />
        <DemoNote />
        <div className="m-actions">
          <ButtonLink to="/">Till startsidan</ButtonLink>
          <ButtonLink to="/shop" variant="outline">Fortsätt titta</ButtonLink>
        </div>
      </Section>
    </div>
  );
};

export default Thanks;
