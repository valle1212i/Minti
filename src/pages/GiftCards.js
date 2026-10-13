import React, { useState } from 'react';
import { PageHero, Section, SectionHead, DemoNote, usePageTitle } from '../components/ui';
import ProductCard from '../components/ProductCard';
import { DEMO_GIFT_CODE, PRODUCTS } from '../data/shop';

// Saldokontrollen är en demo: bara demokoden ger ett saldo, och inget skickas.
const GiftCards = () => {
  usePageTitle('Presentkort');
  const cards = PRODUCTS.filter((p) => p.type === 'gift_card');
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  const verify = (e) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === DEMO_GIFT_CODE) {
      setResult({ ok: true, text: 'Saldo: 750 kr, giltigt till 31 december 2026. (Demokort)' });
    } else {
      setResult({ ok: false, text: `Koden finns inte. På demosajten fungerar bara koden ${DEMO_GIFT_CODE}.` });
    }
  };

  return (
    <div className="m-page">
      <PageHero
        eyebrow="Presentkort"
        title="Ge bort en stund av lugn"
        lead="Ett presentkort räcker till bad, behandlingar eller middag och gäller i ett år."
        image="insidezentype"
        imageAlt="Betonggång med regndusch och ett litet träd"
      />
      <Section>
        <DemoNote>Presentkorten är exempel. Inget kort skapas och ingen betalning görs.</DemoNote>
        <div className="m-grid m-grid--3">
          {cards.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>
      <Section tone="tint" narrow>
        <div className="m-panel">
          <SectionHead eyebrow="Har du redan ett kort?" title="Kontrollera saldo" text={`Prova med demokoden ${DEMO_GIFT_CODE}.`} />
          <form className="m-form" onSubmit={verify}>
            <div className="m-field">
              <label htmlFor="presentkort-kod">Presentkortskod</label>
              <input id="presentkort-kod" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" required maxLength={32} />
            </div>
            <div>
              <button type="submit" className="m-btn m-btn--primary">Kontrollera</button>
            </div>
            {result && <p className={result.ok ? 'm-success' : 'm-error'} role="status">{result.text}</p>}
          </form>
        </div>
      </Section>
    </div>
  );
};

export default GiftCards;
