import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHero, Section, DemoNote, usePageTitle } from '../components/ui';
import { BOOKING_SERVICES, availableSlots, bookingReference, isoDate } from '../data/booking';
import { formatKr } from '../data/site';

// Bokningen är en demo: lediga tider räknas fram lokalt och bekräftelsen visas i sidan.
// Inget skickas och ingen tid reserveras.

const STEPS = ['Behandling', 'Dag och tid', 'Dina uppgifter', 'Bekräftelse'];

function nextDays(count) {
  const days = [];
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  for (let i = 1; i <= count; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

const Book = () => {
  usePageTitle('Boka');
  const days = useMemo(() => nextDays(14), []);
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState('');
  const [guests, setGuests] = useState(1);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const service = BOOKING_SERVICES.find((s) => s.id === serviceId) || null;
  const slots = service && day ? availableSlots(service.id, day) : [];

  const go = (target) => {
    setError('');
    if (target >= 1 && !service) { setError('Välj en behandling.'); return; }
    if (target >= 2 && (!day || !time)) { setError('Välj dag och tid.'); return; }
    setStep(target);
    window.scrollTo(0, 0);
  };

  const confirm = (e) => {
    e.preventDefault();
    go(3);
  };

  const restart = () => {
    setStep(0); setServiceId(''); setGuests(1); setDay(null); setTime(''); setName(''); setError('');
  };

  const dayLabel = (d) => d.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="m-page">
      <PageHero
        eyebrow="Boka"
        title="Boka ditt besök"
        lead="Välj behandling, dag och tid. Det tar en minut."
        image="dasspaspic"
        imageAlt="Gäst som vilar i varmt vatten"
      />
      <Section narrow>
        <DemoNote>Det här är en demobokning. Tiderna är påhittade och ingen bokning skickas.</DemoNote>

        <ol className="m-stepper" aria-label="Steg i bokningen">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? 'is-current' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
              <span className="m-stepper-no">{i + 1}</span>
              <span className="m-stepper-label">{s}</span>
            </li>
          ))}
        </ol>

        <div className="m-panel">
          {step === 0 && (
            <div>
              <h2 className="m-card-title">Välj behandling</h2>
              <fieldset className="m-options">
                <legend className="m-visually-hidden">Behandling</legend>
                {BOOKING_SERVICES.map((s) => (
                  <label key={s.id} className={`m-option m-option--block${s.id === serviceId ? ' is-active' : ''}`}>
                    <input type="radio" name="service" value={s.id} checked={s.id === serviceId} onChange={() => { setServiceId(s.id); setTime(''); }} />
                    <span>
                      <strong>{s.name}</strong>
                      <span className="m-option-desc">{s.description} {s.durationMin >= 120 ? `${s.durationMin / 60} timmar` : `${s.durationMin} min`}.</span>
                    </span>
                    <span className="m-option-price">{formatKr(s.price)}<span className="m-price-note">Exempelpris</span></span>
                  </label>
                ))}
              </fieldset>
              <div className="m-field m-qty">
                <label htmlFor="antal-gaster">Antal gäster</label>
                <select id="antal-gaster" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              {error && <p className="m-error" role="alert">{error}</p>}
              <div className="m-actions">
                <button type="button" className="m-btn m-btn--primary" onClick={() => go(1)}>Nästa</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="m-card-title">Välj dag och tid</h2>
              <p className="m-label">Dag</p>
              <div className="m-days" role="group" aria-label="Välj dag">
                {days.map((d) => {
                  const selected = day && isoDate(d) === isoDate(day);
                  return (
                    <button
                      key={isoDate(d)}
                      type="button"
                      className={`m-day${selected ? ' is-active' : ''}`}
                      aria-pressed={!!selected}
                      aria-label={dayLabel(d)}
                      onClick={() => { setDay(d); setTime(''); }}
                    >
                      <span className="m-day-wd">{d.toLocaleDateString('sv-SE', { weekday: 'short' })}</span>
                      <span className="m-day-no">{d.getDate()}</span>
                      <span className="m-day-mo">{d.toLocaleDateString('sv-SE', { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
              {day && (
                <>
                  <p className="m-label">Lediga tider {dayLabel(day)}</p>
                  {slots.length === 0 && <p className="m-text">Inga lediga tider den dagen. Prova en annan dag.</p>}
                  <div className="m-times" role="group" aria-label="Välj tid">
                    {slots.map((t) => (
                      <button key={t} type="button" className={`m-chip${t === time ? ' is-active' : ''}`} aria-pressed={t === time} onClick={() => setTime(t)}>{t}</button>
                    ))}
                  </div>
                </>
              )}
              {error && <p className="m-error" role="alert">{error}</p>}
              <div className="m-actions">
                <button type="button" className="m-btn m-btn--outline" onClick={() => go(0)}>Tillbaka</button>
                <button type="button" className="m-btn m-btn--primary" onClick={() => go(2)}>Nästa</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form className="m-form" onSubmit={confirm}>
              <h2 className="m-card-title">Dina uppgifter</h2>
              <p className="m-text">På demosajten räcker ett förnamn. Ingenting sparas eller skickas.</p>
              <div className="m-field">
                <label htmlFor="boka-namn">Förnamn</label>
                <input id="boka-namn" value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} autoComplete="given-name" />
              </div>
              <div className="m-summary-box">
                <p><strong>{service.name}</strong>, {guests} {guests === 1 ? 'gäst' : 'gäster'}</p>
                <p>{dayLabel(day)} kl. {time}</p>
                <p>{formatKr(service.price * guests)} (exempelpris)</p>
              </div>
              <div className="m-actions">
                <button type="button" className="m-btn m-btn--outline" onClick={() => go(1)}>Tillbaka</button>
                <button type="submit" className="m-btn m-btn--primary">Bekräfta demobokning</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="m-success" role="status">
              <h2>Tack, {name.trim() || 'och välkommen'}!</h2>
              <p>
                Så här ser en bekräftelse ut: {service.name} för {guests} {guests === 1 ? 'gäst' : 'gäster'},
                {' '}{dayLabel(day)} kl. {time}. Bokningsnummer {bookingReference(service.id, day, time)}.
              </p>
              <p>Eftersom Minti är en demosajt har ingen tid bokats och inget bekräftelsemejl skickats.</p>
              <div className="m-actions">
                <button type="button" className="m-btn m-btn--outline" onClick={restart}>Gör en ny bokning</button>
                <Link to="/" className="m-btn m-btn--primary">Till startsidan</Link>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default Book;
