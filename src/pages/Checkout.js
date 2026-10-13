import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Section, SectionHead, Picture, DemoNote, ButtonLink, usePageTitle } from '../components/ui';
import { findProduct } from '../data/shop';
import { formatKr } from '../data/site';

// Demokassa: visar sammanfattningen av ett köp. Ingen betalning, inget skickas.
const Checkout = () => {
  usePageTitle('Kassa (demo)');
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const product = findProduct(params.get('produkt') || '');
  const variant = product && (product.variants.find((v) => v.id === params.get('variant')) || product.variants[0]);
  const qty = Math.min(Math.max(Number(params.get('antal')) || 1, 1), 4);

  if (!product) {
    return (
      <div className="m-page">
        <Section narrow>
          <SectionHead eyebrow="Kassa" title="Kassan är tom" text="Välj en upplevelse i butiken först." />
          <ButtonLink to="/shop">Till butiken</ButtonLink>
        </Section>
      </div>
    );
  }

  const total = variant.price * (product.type === 'subscription' ? 1 : qty);

  const finish = (e) => {
    e.preventDefault();
    navigate('/tack?typ=kop');
  };

  return (
    <div className="m-page">
      <Section>
        <SectionHead eyebrow="Kassa" title="Så här ser kassan ut" />
        <DemoNote>Minti är en demosajt. I en riktig butik skulle du här skickas vidare till betalningen. Inget köp görs och inga uppgifter sparas.</DemoNote>
        <div className="m-two">
          <div className="m-panel">
            <h2 className="m-card-title">Din beställning</h2>
            <div className="m-summary">
              <div className="m-summary-media">
                <Picture name={product.image} alt="" sizes="160px" />
              </div>
              <div>
                <p className="m-summary-title">{product.title}</p>
                <p className="m-text">{variant.label}{product.type !== 'subscription' ? ` · ${qty} st` : ''}</p>
              </div>
            </div>
            <dl className="m-totals">
              <div><dt>Summa</dt><dd>{formatKr(total)}{product.interval ? ` / ${product.interval}` : ''}</dd></div>
              <div><dt>Varav moms</dt><dd>Visas i en riktig kassa</dd></div>
            </dl>
            <p className="m-small">Alla priser är exempelpriser.</p>
            <p className="m-small"><Link className="m-link" to={`/product/${product.id}`}>Ändra</Link></p>
          </div>
          <form className="m-panel m-form" onSubmit={finish}>
            <h2 className="m-card-title">Betalning</h2>
            <p className="m-text">
              Här skulle betalsättet visas, till exempel kort eller Swish. På demosajten finns inga fält att fylla i,
              så att ingen råkar lämna riktiga uppgifter.
            </p>
            <div className="m-pay-placeholder" aria-hidden="true">
              <span>Kort</span><span>Swish</span><span>Faktura</span>
            </div>
            <button type="submit" className="m-btn m-btn--primary">Slutför demoköp</button>
            <p className="m-small">
              Genom att gå vidare godkänner du <Link className="m-link" to="/terms">villkoren</Link> och
              vår <Link className="m-link" to="/privacy">integritetspolicy</Link>.
            </p>
          </form>
        </div>
      </Section>
    </div>
  );
};

export default Checkout;
