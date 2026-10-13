// Demodata för butiken: upplevelser, prenumerationer och presentkort.
// Alla priser är exempel. Inget skickas någonstans och ingen betalning görs.

export const CATEGORIES = [
  { slug: 'bad-och-bastu', name: 'Bad & bastu', description: 'Entré till baden, bastun och vilorummen, för en dag eller en kväll.', image: 'poolnumebr1' },
  { slug: 'behandlingar', name: 'Behandlingar', description: 'Lugna behandlingar som kan läggas till ditt besök.', image: 'dasspaspic' },
  { slug: 'mat-och-dryck', name: 'Mat & dryck', description: 'Lunch, middag och avsmakning i restaurangen.', image: 'restaturantforspa' },
  { slug: 'vistelser', name: 'Vistelser', description: 'Paket med övernattning, frukost och tillgång till baden.', image: 'spapictureofapart' }
];

export const PRODUCTS = [
  {
    id: 'dagspa',
    type: 'product',
    title: 'Dagspa',
    category: 'bad-och-bastu',
    image: 'poolnumebr1',
    imageAlt: 'Inomhusbassäng med mörka stenväggar och mjukt ljus',
    description: 'Hela dagen i baden, bastun och trädgården. Badrock, handduk och tofflor ingår.',
    variants: [
      { id: 'vardag', label: 'Vardag', price: 895 },
      { id: 'helg', label: 'Helg', price: 1095 }
    ]
  },
  {
    id: 'kvallsbad',
    type: 'product',
    title: 'Kvällsbad',
    category: 'bad-och-bastu',
    image: 'pictureforbadandkallor',
    imageAlt: 'Fötter som kliver ner i ett varmt bad i kvällsljus',
    description: 'Tre timmar i baden efter klockan 18, när det är som lugnast.',
    variants: [{ id: 'standard', label: 'Kvällsentré', price: 595 }]
  },
  {
    id: 'basturitual',
    type: 'product',
    title: 'Basturitual för två',
    category: 'bad-och-bastu',
    image: 'bastu1',
    imageAlt: 'Utomhusbastu med öppen dörr mot dimmig klippkust',
    description: 'En guidad stund i bastun med kallbad emellan, för dig och en vän.',
    variants: [{ id: 'tva', label: 'Två personer', price: 1290 }]
  },
  {
    id: 'massage-50',
    type: 'product',
    title: 'Avslappnande massage',
    category: 'behandlingar',
    image: 'dasspaspic',
    imageAlt: 'Gäst som vilar i varmt vatten med blicken mot ljuset',
    description: 'En lugn helkroppsmassage med varma oljor. Läggs till ett dagspa eller kvällsbad.',
    variants: [
      { id: '50', label: '50 minuter', price: 945 },
      { id: '80', label: '80 minuter', price: 1395 }
    ]
  },
  {
    id: 'avsmakning',
    type: 'product',
    title: 'Avsmakningsmiddag',
    category: 'mat-och-dryck',
    image: 'restaturantforspa',
    imageAlt: 'Kock vid öppen eld i en dämpat upplyst restaurang',
    description: 'Fem rätter efter säsong i restaurangen. Vegetarisk meny finns.',
    variants: [
      { id: 'meny', label: 'Meny', price: 795 },
      { id: 'dryck', label: 'Meny med dryckespaket', price: 1290 }
    ]
  },
  {
    id: 'overnattning',
    type: 'product',
    title: 'Övernattning med bad',
    category: 'vistelser',
    image: 'spapictureofapart',
    imageAlt: 'Ljust rum med låg säng och stora fönster mot havet',
    description: 'Ett ljust rum med havsutsikt, frukost och fri tillgång till baden under två dagar.',
    variants: [
      { id: 'en', label: 'En person', price: 2490 },
      { id: 'tva', label: 'Två personer', price: 3790 }
    ]
  },
  {
    id: 'badkort',
    type: 'subscription',
    title: 'Badkortet',
    category: 'bad-och-bastu',
    image: 'onespapool',
    imageAlt: 'Utomhusbad mellan tallar och stenar i morgondimma',
    description: 'Fyra kvällsbad i månaden. Avsluta när du vill.',
    interval: 'månad',
    variants: [{ id: 'manad', label: 'Per månad', price: 1495 }]
  },
  {
    id: 'stillhet',
    type: 'subscription',
    title: 'Stillhet varje vecka',
    category: 'bad-och-bastu',
    image: 'zengarden',
    imageAlt: 'Stenlagd stig genom en grönskande trädgård med blommande buskar',
    description: 'Ett dagspa på vardagar varje vecka, plus tio procent på behandlingar.',
    interval: 'månad',
    variants: [{ id: 'manad', label: 'Per månad', price: 2995 }]
  },
  {
    id: 'presentkort',
    type: 'gift_card',
    title: 'Presentkort',
    category: null,
    image: 'insidezentype',
    imageAlt: 'Betonggång med regndusch och ett litet träd',
    description: 'Ett värdebevis som räcker till bad, behandlingar eller middag. Giltigt i ett år.',
    variants: [
      { id: '500', label: '500 kr', price: 500 },
      { id: '1000', label: '1 000 kr', price: 1000 },
      { id: '2000', label: '2 000 kr', price: 2000 }
    ]
  },
  {
    id: 'presentkort-dagspa',
    type: 'gift_card',
    title: 'Presentkort Dagspa',
    category: null,
    image: 'poolinside1',
    imageAlt: 'Varmt vatten som hälls från en träskopa i ett dunkelt bad',
    description: 'Ett dagspa på vardag för en person, med badrock och tofflor.',
    variants: [{ id: 'dagspa', label: 'Ett dagspa', price: 895 }]
  }
];

export function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

export function fromPrice(product) {
  return Math.min(...product.variants.map((v) => v.price));
}

// Demokod för saldokontrollen på presentkortssidan.
export const DEMO_GIFT_CODE = 'DEMO-2026';
