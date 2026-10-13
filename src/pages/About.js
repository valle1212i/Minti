import React from 'react';
import { PageHero, Section, SectionHead, Split, Band, ButtonLink, Icon, usePageTitle } from '../components/ui';

const values = [
  {
    icon: 'leaf',
    title: 'Naturen nära',
    text: 'Betong, trä och sten möter tallskog och vatten. Huset är byggt för att kännas lågmält och låta omgivningen ta plats.'
  },
  {
    icon: 'circle',
    title: 'Tid för dig',
    text: 'Här finns inga scheman att passa. Du rör dig mellan bad, bastu och vila i den takt som känns rätt för dig.'
  },
  {
    icon: 'hand',
    title: 'Omtanke i detaljerna',
    text: 'Badrock, tofflor, te i vilorummet och värdar som hjälper dig till rätta. Det lilla som gör att du kan släppa taget.'
  }
];

const hosts = [
  { icon: 'water', title: 'Bad och bastu', text: 'Värdarna i baden håller koll på temperaturerna och tipsar om i vilken ordning du kan ta baden.' },
  { icon: 'moon', title: 'Behandlingar', text: 'Våra behandlare tar emot dig i lugna rum och anpassar behandlingen efter dina önskemål.' },
  { icon: 'flame', title: 'Kök och servering', text: 'Köket lagar mat efter säsong och serverar i restaurangen, i baren och på terrassen.' }
];

const About = () => {
  usePageTitle('Om Minti');
  return (
    <div className="m-page">
      <PageHero
        eyebrow="Om Minti"
        title="En plats att andas ut"
        lead="Minti är en lugn oas för bad, bastu och vila, där modern design möter enkla ritualer kring vatten och värme."
        image="insidezentype"
        imageAlt="Betonggång med regndusch och ett litet träd i dämpat ljus"
      />

      <Split
        image="zengarden"
        imageAlt="Stenlagd stig genom en grönskande trädgård"
        eyebrow="Vår filosofi"
        title="Stillhet som utgångspunkt"
      >
        <p className="m-text">
          Minti skapades för att ge en paus från vardagens tempo. Stillhet, skönhet och harmoni är
          ledorden, i allt från arkitekturen till hur vi tar emot våra gäster.
        </p>
        <p className="m-text">
          Besöket börjar med en enkel rengöringsritual. Sedan väntar varma bad, bastu och kalla dopp,
          och mellan dem vilorum och en trädgård att promenera i.
        </p>
      </Split>

      <Section tone="tint">
        <SectionHead center eyebrow="Det här tror vi på" title="Så tar vi emot dig" />
        <div className="m-grid m-grid--3">
          {values.map((v) => (
            <div className="m-feature" key={v.title}>
              <Icon name={v.icon} />
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Split
        reverse
        tone="tint"
        image="poolnumebr1"
        imageAlt="Inomhusbassäng mellan råa stenväggar"
        eyebrow="Miljön"
        title="Bad, bastu och vila"
      >
        <p className="m-text">
          Från behandlingsrummen kommer du ut i en innergård med ett varmt bad. Runt det ligger kallbad,
          kolsyrebad och en ångbastu med salt. Intill finns en större bastu med utsikt mot skogen.
        </p>
        <p className="m-text">
          Betong och trä är grundmaterialen, tillsammans med grönska och träd som växer intill baden.
          Miljön ska kännas varm och nära, med platser där var och en kan hitta sin egen vrå.
        </p>
      </Split>

      <Section>
        <SectionHead
          center
          eyebrow="Värdskap"
          title="Våra värdar"
          text="Värdarna visar dig runt, svarar på frågor och ser till att det är lugnt i de tysta zonerna. Fråga gärna, vi hjälper dig att lägga upp besöket."
        />
        <div className="m-grid m-grid--3">
          {hosts.map((h) => (
            <div className="m-feature" key={h.title}>
              <Icon name={h.icon} />
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Band
        eyebrow="Planera ditt besök"
        title="Välkommen till Minti"
        text="Boka ett dagspa, ett kvällsbad eller en vistelse med övernattning."
      >
        <ButtonLink to="/book" variant="light">Boka besök</ButtonLink>
        <ButtonLink to="/contact" variant="ghost">Kontakta oss</ButtonLink>
      </Band>
    </div>
  );
};

export default About;
