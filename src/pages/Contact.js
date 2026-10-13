import React, { useState } from 'react';
import { PageHero, Section, SectionHead, Band, ButtonLink, DemoNote, Icon, usePageTitle } from '../components/ui';
import { SITE } from '../data/site';

// Kontaktformuläret är en demo: inget skickas, tacket visas direkt i sidan.
const EMPTY = { name: '', email: '', phone: '', message: '' };

const Contact = () => {
  usePageTitle('Kontakt');
  const [form, setForm] = useState(EMPTY);
  const [sentName, setSentName] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setSentName(form.name.trim().split(' ')[0]);
    setForm(EMPTY);
  };

  return (
    <div className="m-page">
      <PageHero
        eyebrow="Kontakt"
        title="Hör av dig"
        lead="Frågor om bad, behandlingar eller en större grupp? Vi hjälper dig gärna."
        image="pictureforbadandkallor"
        imageAlt="Varmt bad i kvällsljus"
      />

      <Section>
        <div className="m-two m-two--wide-left">
          <div className="m-panel">
            <SectionHead eyebrow="Kontaktformulär" title="Skriv till oss" />
            <DemoNote>Det här är en demosajt. Meddelandet skickas inte någonstans, men du ser hur formuläret fungerar.</DemoNote>
            {sentName !== '' ? (
              <div className="m-success" role="status">
                <h2>Tack{sentName ? `, ${sentName}` : ''}!</h2>
                <p>Så här ser det ut när ett meddelande har tagits emot. Eftersom Minti är en demosajt skickades ingenting.</p>
                <div className="m-actions">
                  <button type="button" className="m-btn m-btn--outline" onClick={() => setSentName('')}>Skriv ett nytt meddelande</button>
                </div>
              </div>
            ) : (
              <form className="m-form" onSubmit={submit}>
                <div className="m-form-row">
                  <div className="m-field">
                    <label htmlFor="kontakt-namn">Namn</label>
                    <input id="kontakt-namn" name="name" autoComplete="name" value={form.name} onChange={change} required maxLength={120} />
                  </div>
                  <div className="m-field">
                    <label htmlFor="kontakt-epost">E-post</label>
                    <input id="kontakt-epost" type="email" name="email" autoComplete="email" value={form.email} onChange={change} required maxLength={200} />
                  </div>
                </div>
                <div className="m-field">
                  <label htmlFor="kontakt-telefon">Telefon (valfritt)</label>
                  <input id="kontakt-telefon" type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={change} maxLength={40} />
                </div>
                <div className="m-field">
                  <label htmlFor="kontakt-meddelande">Meddelande</label>
                  <textarea id="kontakt-meddelande" name="message" rows="6" value={form.message} onChange={change} required maxLength={2000} />
                </div>
                <div>
                  <button type="submit" className="m-btn m-btn--primary">Skicka (demo)</button>
                </div>
              </form>
            )}
          </div>

          <div className="m-contact-list">
            <div className="m-contact-item">
              <Icon name="phone" />
              <div>
                <h2>Telefon</h2>
                <p><a className="m-link" href={SITE.phoneHref}>{SITE.phone}</a></p>
                <p className="m-small">Fiktivt nummer ur serien för påhittade nummer.</p>
              </div>
            </div>
            <div className="m-contact-item">
              <Icon name="mail" />
              <div>
                <h2>E-post</h2>
                <p><a className="m-link" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
                <p className="m-small">Fiktiv adress, tar inte emot post.</p>
              </div>
            </div>
            <div className="m-contact-item">
              <Icon name="pin" />
              <div>
                <h2>Hitta hit</h2>
                <p>{SITE.street}<br />{SITE.postal}</p>
                <p className="m-small">Påhittad adress för konceptsajten.</p>
              </div>
            </div>
            <div className="m-contact-item">
              <Icon name="clock" />
              <div>
                <h2>Öppettider</h2>
                <dl className="m-hours">
                  {SITE.hours.map((h) => (
                    <div key={h.label}>
                      <dt>{h.label}</dt>
                      <dd>{h.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Band eyebrow="Redo att komma?" title="Boka ditt besök" text="Välj behandling, dag och tid direkt på sajten.">
        <ButtonLink to="/book" variant="light">Boka</ButtonLink>
        <ButtonLink to="/services" variant="ghost">Se tjänster</ButtonLink>
      </Band>
    </div>
  );
};

export default Contact;
