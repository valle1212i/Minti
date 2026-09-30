import React, { useEffect, useState } from 'react';
import { portalGet, portalPost, usePortal } from '../lib/portal';
import './Booking.css';

// Bokningsflödet mot kundportalens bokningssystem (via /api/portal/booking/…).
// Tjänster, personal och lediga tider hämtas från portalen; bokningen skickas dit och
// bekräftas först när portalen har tagit emot den. `preset` är bokningsdesignen från
// portalen (surface booking): rubriker, knapptext, bekräftelsetext och länkar.

const monthNames = [
  'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
];
const weekDays = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];

function isoDate(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const Booking = ({ preset }) => {
  const p = preset || {};
  const services = usePortal('/booking/services');
  const providers = usePortal('/booking/providers');
  const serviceList = (services.data && services.data.services) || [];
  const providerList = (providers.data && providers.data.providers) || [];

  const [step, setStep] = useState(1);
  const [partySize, setPartySize] = useState(1);
  const [serviceId, setServiceId] = useState('');
  const [providerId, setProviderId] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [slot, setSlot] = useState('');
  const [slots, setSlots] = useState({ loading: false, list: [], error: null });
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', notes: '' });
  const [submit, setSubmit] = useState({ sending: false, done: false, error: null });
  const [stepError, setStepError] = useState('');

  const service = serviceList.find((s) => s._id === serviceId) || null;
  const duration = (service && service.durationMin) || 60;

  // Lediga tider för vald dag och tjänst.
  useEffect(() => {
    if (!selectedDate || !service) return undefined;
    let cancelled = false;
    setSlots({ loading: true, list: [], error: null });
    setSlot('');
    const offset = new Date().getTimezoneOffset();
    const query = `date=${isoDate(selectedDate)}&slotDuration=${duration}&timezoneOffset=${offset}`;
    const path = providerId
      ? `/booking/providers/${encodeURIComponent(providerId)}/availability?${query}`
      : `/booking/availability/slots?${query}`;
    portalGet(path)
      .then((res) => {
        if (cancelled) return;
        const list = (res.availability && res.availability.availableSlots) || res.availableSlots || [];
        setSlots({ loading: false, list, error: null });
      })
      .catch(() => { if (!cancelled) setSlots({ loading: false, list: [], error: 'Tiderna kunde inte hämtas.' }); });
    return () => { cancelled = true; };
  }, [selectedDate, service, providerId, duration]);

  // Kalender
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const calendarDays = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false, isPast: true });
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({ day, isCurrentMonth: true, isPast: date < new Date(today.getFullYear(), today.getMonth(), today.getDate()) });
  }
  for (let day = 1; calendarDays.length < 42; day++) calendarDays.push({ day, isCurrentMonth: false, isPast: false });

  const next = () => {
    setStepError('');
    if (step === 2 && (!service || !selectedDate || !slot)) {
      setStepError('Välj behandling, datum och tid.');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit({ sending: true, done: false, error: null });
    const [hh, mm] = slot.split(':').map(Number);
    const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hh, mm);
    const end = new Date(start.getTime() + duration * 60 * 1000);
    try {
      const result = await portalPost('/booking/bookings', {
        serviceId: service._id,
        ...(providerId ? { providerId } : {}),
        start: start.toISOString(),
        end: end.toISOString(),
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        partySize,
        notes: form.notes.trim(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset()
      });
      // Tjänster med förskottsbetalning svarar med en kassa-URL.
      if (result && result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      setSubmit({ sending: false, done: true, error: null });
    } catch (err) {
      setSubmit({ sending: false, done: false, error: err.message || 'Bokningen kunde inte skickas. Försök igen eller kontakta oss.' });
    }
  };

  if (submit.done) {
    return (
      <div className="booking-modal booking-page-card">
        <div className="booking-step">
          <h2 className="booking-step-title">{p.successMessage || 'Tack! Din bokning är mottagen.'}</h2>
          <p>En bekräftelse skickas till {form.email}.</p>
        </div>
      </div>
    );
  }

  const unavailable = services.data && serviceList.length === 0;

  return (
    <div className="booking-modal booking-page-card">
      {p.heading && <h2 className="booking-step-title">{p.heading}</h2>}
      {p.subtitle && <p className="booking-subtitle">{p.subtitle}</p>}

      {services.loading && !services.data && <p>Laddar bokningen…</p>}
      {services.error && !services.data && <p className="booking-error">Bokningen kunde inte laddas just nu. Ring eller mejla oss så hjälper vi dig.</p>}
      {unavailable && <p className="booking-error">Onlinebokning är inte öppen än. Ring eller mejla oss så hjälper vi dig.</p>}

      {serviceList.length > 0 && step === 1 && (
        <div className="booking-step">
          <h2 className="booking-step-title">Välj antal personer</h2>
          <div className="booking-number-display">
            <span className="booking-number-value">{partySize}</span>
            <span className="booking-number-label">{partySize === 1 ? 'person' : 'personer'}</span>
          </div>
          <div className="booking-number-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button key={n} type="button" className={`booking-number-btn ${partySize === n ? 'active' : ''}`} onClick={() => setPartySize(n)}>
                {n}
              </button>
            ))}
          </div>
          <div className="booking-actions">
            <button type="button" className="btn btn-primary" onClick={next}>Nästa →</button>
          </div>
        </div>
      )}

      {serviceList.length > 0 && step === 2 && (
        <div className="booking-step">
          <h2 className="booking-step-title">Välj behandling, datum och tid</h2>
          <div className="booking-step2-content">
            <div className="booking-calendar">
              <div className="calendar-header">
                <button type="button" className="calendar-nav-btn" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} aria-label="Föregående månad">‹</button>
                <h3 className="calendar-month">{monthNames[month]} {year}</h3>
                <button type="button" className="calendar-nav-btn" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} aria-label="Nästa månad">›</button>
              </div>
              <div className="calendar-weekdays">
                {weekDays.map((d) => <div key={d} className="calendar-weekday">{d}</div>)}
              </div>
              <div className="calendar-days">
                {calendarDays.map((item, index) => {
                  const isSelected = item.isCurrentMonth && selectedDate && selectedDate.getDate() === item.day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`calendar-day ${!item.isCurrentMonth ? 'other-month' : ''} ${item.isPast ? 'past' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => item.isCurrentMonth && !item.isPast && setSelectedDate(new Date(year, month, item.day))}
                      disabled={!item.isCurrentMonth || item.isPast}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="booking-type-section">
              <label className="booking-type-label" htmlFor="booking-service">Behandling</label>
              <select id="booking-service" className="booking-type-select" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
                <option value="">Välj behandling…</option>
                {serviceList.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}{s.durationMin ? ` (${s.durationMin} min)` : ''}</option>
                ))}
              </select>
              {providerList.length > 0 && p.showProviderStep !== false && (
                <>
                  <label className="booking-type-label" htmlFor="booking-provider">Behandlare</label>
                  <select id="booking-provider" className="booking-type-select" value={providerId} onChange={(e) => setProviderId(e.target.value)}>
                    <option value="">Ingen preferens</option>
                    {providerList.map((pr) => <option key={pr._id} value={pr._id}>{pr.name}</option>)}
                  </select>
                </>
              )}
              {p.showAvailability !== false && selectedDate && service && (
                <div className="booking-slots">
                  <span className="booking-type-label">Lediga tider</span>
                  {slots.loading && <p>Hämtar tider…</p>}
                  {slots.error && <p className="booking-error">{slots.error}</p>}
                  {!slots.loading && !slots.error && slots.list.length === 0 && <p>Inga lediga tider den dagen.</p>}
                  <div className="booking-slot-grid">
                    {slots.list.map((t) => (
                      <button key={t} type="button" className={`booking-number-btn ${slot === t ? 'active' : ''}`} onClick={() => setSlot(t)}>{t}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {stepError && <p className="booking-error">{stepError}</p>}
          <div className="booking-actions">
            <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Tillbaka</button>
            <button type="button" className="btn btn-primary" onClick={next}>Nästa →</button>
          </div>
        </div>
      )}

      {serviceList.length > 0 && step === 3 && (
        <div className="booking-step">
          <h2 className="booking-step-title">Dina uppgifter</h2>
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerName">Fullständigt namn *</label>
              <input type="text" id="customerName" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required maxLength={120} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Telefonnummer *</label>
              <input type="tel" id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required maxLength={40} />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-postadress *</label>
              <input type="email" id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={200} />
            </div>
            <div className="form-group">
              <label htmlFor="notes">Anteckningar (allergier, specialkrav, etc.)</label>
              <textarea id="notes" rows="4" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={1000} />
            </div>
            {p.showSummary !== false && (
              <div className="booking-summary">
                <h3>Bokningssammanfattning</h3>
                <p><strong>Antal personer:</strong> {partySize}</p>
                {service && <p><strong>Behandling:</strong> {service.name}</p>}
                {selectedDate && (
                  <p><strong>Tid:</strong> {selectedDate.toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} kl. {slot}</p>
                )}
              </div>
            )}
            {(p.termsUrl || p.privacyUrl) && (
              <p className="booking-legal">
                Genom att boka godkänner du våra{' '}
                {p.termsUrl && <a href={p.termsUrl} target="_blank" rel="noopener noreferrer">villkor</a>}
                {p.termsUrl && p.privacyUrl && ' och '}
                {p.privacyUrl && <a href={p.privacyUrl} target="_blank" rel="noopener noreferrer">integritetspolicy</a>}.
              </p>
            )}
            {submit.error && <p className="booking-error" role="alert">{submit.error}</p>}
            <div className="booking-actions">
              <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Tillbaka</button>
              <button type="submit" className="btn btn-primary" disabled={submit.sending}>
                {submit.sending ? 'Skickar…' : (p.confirmButtonLabel || 'Skicka bokning →')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Booking;
