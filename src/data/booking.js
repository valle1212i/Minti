// Demodata för bokningen. Lediga tider räknas fram lokalt ur datumet, så samma dag
// visar alltid samma tider. Ingenting skickas och ingen tid reserveras.

export const BOOKING_SERVICES = [
  { id: 'dagspa', name: 'Dagspa', durationMin: 360, price: 895, description: 'Baden, bastun och trädgården under dagen.' },
  { id: 'kvallsbad', name: 'Kvällsbad', durationMin: 180, price: 595, description: 'Tre timmar i baden efter klockan 18.' },
  { id: 'massage', name: 'Avslappnande massage', durationMin: 50, price: 945, description: 'Helkroppsmassage med varma oljor.' },
  { id: 'basturitual', name: 'Basturitual för två', durationMin: 90, price: 1290, description: 'Guidad bastu med kallbad emellan.' }
];

const START_TIMES = {
  dagspa: ['09:00', '10:00', '11:00', '12:00'],
  kvallsbad: ['18:00', '18:30', '19:00'],
  massage: ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  basturitual: ['10:30', '13:30', '16:30', '19:30']
};

function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) % 9973;
  return h;
}

export function isoDate(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Ungefär var tredje tid är "upptagen", och måndagar är stängt för behandlingar.
export function availableSlots(serviceId, date) {
  const times = START_TIMES[serviceId] || [];
  if (serviceId === 'massage' && date.getDay() === 1) return [];
  const key = isoDate(date);
  return times.filter((t) => hash(`${serviceId}-${key}-${t}`) % 3 !== 0);
}

export function bookingReference(serviceId, date, time) {
  return `DEMO-${(hash(`${serviceId}${isoDate(date)}${time}`) + 1000).toString().slice(0, 4)}`;
}
