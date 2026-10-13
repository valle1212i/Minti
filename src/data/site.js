// Gemensamma uppgifter för konceptsajten Minti. Allt är påhittat.
//
// Telefonnumret ligger i serien 070-174 06 05 – 070-174 06 99 som Post- och telestyrelsen
// har reserverat för fiktiva ändamål (film, tv och liknande), så ingen verklig person nås.
// Domänen .example är reserverad för exempel (RFC 2606) och kan inte ta emot post.

export const SITE = {
  name: 'Minti',
  demoNotice: 'Minti är en demosajt. Inga riktiga köp, bokningar eller meddelanden skickas.',
  phone: '070-174 06 50',
  phoneHref: 'tel:+46701740650',
  email: 'hej@minti.example',
  street: 'Exempelgatan 1',
  postal: '123 45 Exempelstad',
  hours: [
    { label: 'Måndag–torsdag', value: '10–21' },
    { label: 'Fredag–lördag', value: '9–22' },
    { label: 'Söndag', value: '9–19' }
  ]
};

export const PRICE_NOTE = 'Exempelpris. Minti är en demosajt och inget går att köpa på riktigt.';

// Bilder i public/bilder (WebP, 640 och 1232 px breda, 4:3).
export function img(name) {
  return {
    src: `/bilder/${name}-1232.webp`,
    srcSet: `/bilder/${name}-640.webp 640w, /bilder/${name}-1232.webp 1232w`,
    width: 1232,
    height: 928
  };
}

export function formatKr(amount) {
  return `${amount.toLocaleString('sv-SE')} kr`;
}
