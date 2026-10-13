import React from 'react';
import { PageHero, Section, SectionHead, Split, Band, ButtonLink, usePageTitle } from '../components/ui';

const baths = [
  {
    title: 'Stora badet',
    label: 'Inomhus · samtalszon',
    description: 'Det första rummet du möter är husets hjärta: en stor spegel av varmt vatten mellan stenväggar och mjukt ljus. Flyt under takfönstret och låt stillheten sätta tonen för resten av besöket.',
    meta: 'Cirka 35 °C',
    image: 'poolnumebr1',
    alt: 'Inomhusbassäng mellan råa stenväggar och levande ljus'
  },
  {
    title: 'Utomhusbadet',
    label: 'Utomhus · året om',
    description: 'Gå ut, blunda och lyssna på tallarna. Utomhusbadet är varmt året om, så att du kan känna vinterluften mot ansiktet medan du sitter i vattnet.',
    meta: 'Cirka 38 °C · tysta halvtimmar morgon och eftermiddag',
    image: 'onespapool',
    alt: 'Utomhusbad mellan tallar och stenar i morgondimma'
  },
  {
    title: 'Fotbadet',
    label: 'Början på besöket',
    description: 'Många börjar här. Sätt dig, andas ut och låt värmen sprida sig från fötterna medan du landar i lugnet.',
    meta: 'Cirka 38 °C',
    image: 'pictureforbadandkallor',
    alt: 'Fötter som kliver ner i ett varmt bad i kvällsljus'
  },
  {
    title: 'Kolsyrebadet',
    label: 'Tyst zon',
    description: 'Små bubblor pirrar mot huden i ett helt tyst rum. Gäster rör sig långsamt och låter ljudet av vattnet fylla rummet.',
    meta: 'Cirka 37 °C',
    badge: 'Tyst zon',
    image: 'poolinside1',
    alt: 'Varmt vatten hälls från en träskopa i ett dunkelt bad'
  },
  {
    title: 'Kallbadet',
    label: 'Kontrast',
    description: 'Ett klart och kallt dopp mellan de varma baden. Många tycker om växlingen mellan värme och kyla, men lyssna på kroppen och gå i din egen takt.',
    meta: 'Cirka 12–14 °C',
    image: 'dasspaspic',
    alt: 'Gäst som vilar i vattnet med blicken mot ljuset'
  },
  {
    title: 'Det varma badet',
    label: 'Tyst zon',
    description: 'Ett dunkelt rum med ånga och varmt ljus, för den som vill vara för sig själv en stund. Här pratar ingen.',
    meta: 'Cirka 37 °C',
    badge: 'Tyst zon',
    image: 'anotherpool',
    alt: 'Kvinna i baddräkt sitter i ett varmt inomhusbad med ånga och varmt ljus'
  }
];

const ritual = [
  { title: 'Kom fram', text: 'Hämta badrock, handduk och tofflor. Ta en minut att landa innan du går vidare.' },
  { title: 'Rengöring', text: 'Duscha och tvätta dig noga innan du går i baden, så håller vi vattnet fint för alla.' },
  { title: 'Bada och växla', text: 'Rör dig mellan varma bad, bastu och kallbad. Det finns ingen brådska.' },
  { title: 'Vila', text: 'Använd de tysta zonerna för att vila. Vi ber alla att lämna mobilen i skåpet.' }
];

const guidelines = [
  { title: 'Rengöring först', text: 'Duscha innan du går i baden och mellan bastu och bad.' },
  { title: 'Tysta zoner', text: 'I kolsyrebadet, det varma badet och trädgården är det tyst.' },
  { title: 'Handdukar', text: 'Låt handduken ligga utanför vattnet och använd den i bastun.' },
  { title: 'Drick vatten', text: 'Det finns vatten och te i vilorummen. Drick ofta mellan baden.' }
];

const faqs = [
  { q: 'När är baden öppna?', a: 'Baden är öppna varje dag. Se öppettiderna på kontaktsidan. Vid hårt väder kan utomhusbadet stänga en kort stund.' },
  { q: 'Finns det en åldersgräns?', a: 'Från 13 år i sällskap med vuxen dagtid. Kvällstid är det 16 år för att hålla det lugnt.' },
  { q: 'Behöver jag boka i förväg?', a: 'Helger blir ofta fullbokade, så boka gärna i förväg. Vardagar är lugnast.' },
  { q: 'Vad ska jag ta med?', a: 'Badrock, handduk, tofflor och badprodukter finns på plats. Ta gärna med egna badkläder.' }
];

const WellnessExperience = () => {
  usePageTitle('Välmående-upplevelsen');
  return (
    <div className="m-page">
      <PageHero
        eyebrow="Bad och källor"
        title="Välmående-upplevelsen"
        lead="En resa genom värme och kyla, ljud och tystnad. Rör dig mellan baden i din egen takt."
        image="pictureforbadandkallor"
        imageAlt="Varmt bad i kvällsljus med stenar och ånga"
      >
        <ButtonLink to="/book" variant="light">Boka ditt besök</ButtonLink>
        <ButtonLink to="/services" variant="ghost">Se tjänster</ButtonLink>
      </PageHero>

      <Section narrow>
        <SectionHead
          center
          eyebrow="Designad för stillhet och samtal"
          title="Zoner för det du behöver"
          text="Huset är indelat i zoner. I några pratar man lågt med varandra, i andra är det helt tyst. Kom en vardagsmorgon eller kväll om du vill ha det som lugnast."
        />
      </Section>

      {baths.map((b, i) => (
        <Split
          key={b.title}
          reverse={i % 2 === 1}
          tone={i % 2 === 1 ? 'tint' : undefined}
          image={b.image}
          imageAlt={b.alt}
          eyebrow={b.label}
          title={b.title}
          badge={b.badge}
        >
          <p className="m-text">{b.description}</p>
          <p className="m-meta">{b.meta}</p>
        </Split>
      ))}

      <Section tone="sand">
        <SectionHead eyebrow="Ritualen" title="Så går ett besök till" />
        <ol className="m-steps">
          {ritual.map((r, i) => (
            <li className="m-feature" key={r.title}>
              <span className="m-step-no" aria-hidden="true">{i + 1}</span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHead eyebrow="Bra att veta" title="Hänsyn i baden" />
        <div className="m-grid">
          {guidelines.map((g) => (
            <div className="m-feature" key={g.title}>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Split
        id="bastu"
        image="bastu1"
        imageAlt="Utomhusbastu med öppen dörr mot dimmig klippkust"
        eyebrow="Bastu"
        title="Våra bastur"
      >
        <p className="m-text">
          Torrbastu, ångbastu med salt och en lugn vilobastu. Växla mellan värme och kallbad, eller vila
          länge i den milda värmen.
        </p>
        <p className="m-meta">40–90 °C</p>
        <div className="m-actions">
          <ButtonLink to="/bastu" variant="outline">Läs om basturna</ButtonLink>
        </div>
      </Split>

      <Split
        id="zen-tradgard"
        reverse
        tone="tint"
        image="zengarden"
        imageAlt="Stenlagd stig genom en grönskande trädgård med blommande buskar"
        eyebrow="Zen-trädgården"
        title="Trädgården"
      >
        <p className="m-text">
          En stilla trädgård med mossa, sten och krattade stigar. Här kan du promenera, sitta en stund
          eller bara titta ut över grönskan mellan baden.
        </p>
        <p className="m-meta">Året om · tyst zon</p>
      </Split>

      <Section tone="sand">
        <SectionHead eyebrow="Vanliga frågor" title="Frågor och svar" />
        <div className="m-faq">
          {faqs.map((f) => (
            <details key={f.q} className="m-faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Band
        eyebrow="Planera ditt besök"
        title="Dagspa, kvällsbad eller vistelse"
        text="Välj det som passar dig. Vi hjälper gärna till med större grupper."
      >
        <ButtonLink to="/book" variant="light">Boka</ButtonLink>
        <ButtonLink to="/about" variant="ghost">Om Minti</ButtonLink>
      </Band>
    </div>
  );
};

export default WellnessExperience;
