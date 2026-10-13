// Demonyheter. Påhittade texter för konceptsajten.

export const NEWS = [
  {
    slug: 'hostmeny-i-restaurangen',
    date: '2026-09-28',
    title: 'Höstmenyn är här',
    image: 'restaturantforspa',
    imageAlt: 'Kock vid öppen eld i restaurangen',
    excerpt: 'Svamp, rotfrukter och fisk från kusten. Köket har lagt om menyn inför hösten.',
    body: [
      'När kvällarna blir mörkare flyttar köket över till eld och gjutjärn. Höstmenyn bygger på svamp, rotfrukter och fisk från kusten, med en vegetarisk meny som går parallellt hela vägen.',
      'Avsmakningsmiddagen serveras torsdag till lördag. Bord bokas i samband med ditt besök.'
    ]
  },
  {
    slug: 'tradgarden-i-oktober',
    date: '2026-10-05',
    title: 'Trädgården i oktober',
    image: 'zengarden',
    imageAlt: 'Stenlagd stig genom trädgården',
    excerpt: 'Mossan lyser grön och stigarna är krattade. Ta en promenad mellan baden.',
    body: [
      'Oktober är en av trädgårdens finaste månader. Mossan är som grönast, lönnarna skiftar och stigarna är nykrattade.',
      'Trädgården är en tyst zon. Ta med en kopp te från vilorummet och gå varvet runt i din egen takt.'
    ]
  },
  {
    slug: 'kvallsbad-pa-sondagar',
    date: '2026-10-10',
    title: 'Kvällsbad även på söndagar',
    image: 'pictureforbadandkallor',
    imageAlt: 'Varmt bad i kvällsljus',
    excerpt: 'Från november håller baden öppet längre på söndagar.',
    body: [
      'Många har frågat efter en lugn avslutning på helgen. Från november är baden öppna till klockan 21 även på söndagar.',
      'Kvällsbadet bokas som vanligt under Boka.'
    ]
  }
];

export function findNews(slug) {
  return NEWS.find((n) => n.slug === slug) || null;
}

export function formatDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' });
}
