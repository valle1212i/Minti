import React from 'react';
import { Link } from 'react-router-dom';
import './WellnessExperience.css';

const bathExperiences = [
  {
    title: 'Daiyokujo',
    subtitle: '大浴場 · Stora badet',
    description:
      'Det första utrymmet du möter är husets hjärta: en vid spegel av varmt vatten inramad av brutalistiska linjer och mjukt ljus. Flyt under takfönstret, se reflektioner röra sig över betongväggar och låt stillheten förbereda dig för allt som följer.',
    temperature: '35°C · Lugn samtalsszon',
    image: '/poolnumebr1.png',
  },
  {
    title: 'Rotenburo',
    subtitle: '露天風呂 · Utomhuskällor',
    description:
      'Gå ut, blunda och lyssna på tallarna. Våra utomhus onsen-bassänger håller en mild 39°C året om så att du kan känna vinterluften möta mineralvärmen. Tysta halvtimmar varje morgon och eftermiddag inbjuder till medveten reflektion.',
    temperature: '39°C · Tysta halvtimmar två gånger dagligen',
    image: '/onespapool.png',
  },
  {
    title: 'Ashiyu',
    subtitle: '足湯 · Fotbadet',
    description:
      'Börja varje besök genom att värma kroppen från grunden. Sitt, andas och låt tacksamheten röra sig genom dina fötter och ben. Den gradvisa värmen lugnar nervsystemet och förbereder musklerna för djupare immersion.',
    temperature: '39°C · Mjuk ingångsritual',
    image: '/dasspaspic.png',
  },
  {
    title: 'Tansanburo',
    subtitle: '炭酸風呂 · Kolsyrebadet',
    description:
      'Fina mikrobubblor omsluter huden och stimulerar blodcirkulationen i denna helt tysta zon. Gäster går in med dämpade rörelser och låter det mousserande vattnet skapa en meditativ auditiv filt.',
    temperature: '39°C · Tyst zon',
    badge: 'Tyst zon',
    image: '/twowomenspa.png',
  },
  {
    title: 'Mizoburo',
    subtitle: '水風呂 · Kallbadet',
    description:
      'Ett kristallklart dopp som hålls mellan 12–14°C återställer kroppen efter varje värmupplevelse. Övergången mellan värme och kyla är en del av vår cirkulationsritual och ökar mental klarhet.',
    temperature: '12–14°C · Uppiggande kontrast',
    image: '/spapictureofapart.png',
  },
  {
    title: 'Dokutsuburo',
    subtitle: '洞窟風呂 · Bergrumsbadet',
    description:
      'Uthugget direkt i berggrunden glöder detta grottbad med ljusreflektioner från ljus. Fuktig luft, mineralrikt vatten och det omgivande berget skapar en intim kokong reserverad för tyst kontemplation.',
    temperature: '39°C · Tyst zon',
    badge: 'Tyst zon',
    image: '/dasspaspic.png',
  },
  {
    title: 'Utomhusbastu & Kallbad',
    subtitle: '露天風呂 · Eld möter is',
    description:
      'Vår träbastu, inspirerad av Nara-arkitektur från 700-talet, öppnar sig mot skärgården. Steg direkt in i 12°C-kallbadet, känn havsvinden och upprepa när din kropp hittar sin rytm.',
    temperature: 'Bastu 80–90°C · Kallbad 12°C',
    image: '/bastu1.png',
  },
];

const ritualSteps = [
  {
    title: 'Anländ & Andas',
    detail: 'Hämta din yukata, duschutrustning och pausa för att känna övergången från vardagslivet till ritualutrymmet.',
  },
  {
    title: 'Tvagningsritual',
    detail: 'Sitt på en låg pall, fyll karet och rengör långsamt från fötterna till hjärtat. Skölj noggrant så att baden förblir oskadda.',
  },
  {
    title: 'Doppa & Växla',
    detail: 'Rör dig mellan varma källor, kolsyrebad, bastur och kallbad. Lyssna på din kropp—det finns ingen brådska.',
  },
  {
    title: 'Tyst Reflektion',
    detail: 'Använd våra tysta zoner för att meditera, journalföra eller helt enkelt lägga märke till din andning. Vi ber alla att hålla enheter borta.',
  },
];

const wellbeingHighlights = [
  {
    title: 'Ultrafiltrering',
    text: 'En inbyggd virusbarriär överträffar folkhälsomyndighetens rekommendationer och förhindrar att patogener passerar in i våra bassänger.',
  },
  {
    title: 'Influensavirus Policy',
    text: 'Mekanisk filtrering, övervakad kemi och kontinuerlig cirkulation innebär att influensavirus inte kan överleva i baden.',
  },
  {
    title: 'Onsenetikett',
    text: 'Rör dig medvetet, håll handdukar utanför vattnet och kom ihåg att du alltid är en del av någon annans upplevelse.',
  },
  {
    title: 'Hydrering & Näring',
    text: 'Gratis vattenstationer med smaksättning och säsongsbetonade teer stödjer den varma miljön—drick ofta mellan sessioner.',
  },
];

const faqs = [
  {
    question: 'När är välmående-upplevelsen öppen?',
    answer:
      'Vårt fullständiga badhus är öppet dagligen från tidig morgon till sen kväll. Utomhusbassänger förblir öppna året om om inte extremt väder kräver en kort stängning av säkerhetsskäl.',
  },
  {
    question: 'Finns det en åldersgräns?',
    answer:
      'Daglig tillgång är tillgänglig från 13 år när de är åtföljda av en vuxen. Kvällssessioner upprätthåller en 16+ lugn policy för att skydda den lugna atmosfären.',
  },
  {
    question: 'Behöver jag boka i förväg?',
    answer:
      'Helger och helgdagar fylls snabbt. Förboka för att garantera inträde, behandlingar och mat. Veckodagsbesök erbjuder den lugnaste flödet.',
  },
  {
    question: 'Vad ska jag ta med?',
    answer:
      'Vi tillhandahåller yukata, tofflor, handdukar och organiska badprodukter. Du är välkommen att ta med personlig badkläder, även om det är valfritt i våra badzoner.',
  },
];

const WellnessExperience = () => {
  return (
    <div className="wellness-page">
      <section
        className="wellness-hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/pictureforbadandkallor.png)` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="eyebrow">Våra bad & källor</p>
          <h1>Välmående-upplevelsen</h1>
          <p className="lead">
            En sensorisk resa där elementära vattenritualer möter modern skandinavisk design.
            Rör dig genom värme och kyla, ljud och tystnad, samtal och kontemplation.
          </p>
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary">Boka din ritual</Link>
            <Link to="/services" className="btn btn-secondary">Se behandlingar</Link>
          </div>
        </div>
      </section>

      <section className="wellness-intro">
        <div className="intro-text">
          <h2>Designad för stillhet och samtal</h2>
          <p>
            Inspirerad av det japanska begreppet yasuragi—den utandning du gör när du sjunker ner i ett perfekt bad—
            har vi delat in huset i distinkta zoner. Några välkomnar mjuka samtal och skratt med
            nära och kära; andra inbjuder till tystnad, introspektion och en meditativ takt. Besök på vardagsmorgnar
            eller kvällar för den lugnaste atmosfären, eller delta i våra guidade dojo-sessioner för att fördjupa din fokus.
          </p>
          <p>
            Bär yukatan vi tillhandahåller eller ta med dina egna badkläder om du föredrar det. Drick ofta vatten, sätt din
            telefon på tyst läge och låt våra värdar guida dig genom varje steg av ritualen.
          </p>
        </div>
      </section>

      {bathExperiences.map((experience, index) => (
        <section
          key={experience.title}
          className={`experience-section ${index % 2 !== 0 ? 'reverse' : ''}`}
        >
          <div className="experience-image">
            <img src={experience.image} alt={experience.title} />
          </div>
          <div className="experience-content">
            <p className="section-label">{experience.subtitle}</p>
            <div className="section-heading">
              <h3>{experience.title}</h3>
              {experience.badge && <span className="section-badge">{experience.badge}</span>}
            </div>
            <p className="section-body">{experience.description}</p>
            <p className="section-meta">{experience.temperature}</p>
          </div>
        </section>
      ))}

      <section className="ritual-section">
        <div className="ritual-header">
          <h2>Tvagningsritualen · 清め</h2>
          <p>
            I Japan sker rengöring innan badning. Ta din tid—denna sekvens har förfinats över århundraden
            för att lugna sinnet och hedra vattnet vi delar.
          </p>
        </div>
        <div className="ritual-grid">
          {ritualSteps.map(step => (
            <div className="ritual-card" key={step.title}>
              <h4>{step.title}</h4>
              <p>{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="info-grid">
        {wellbeingHighlights.map(item => (
          <div className="info-card" key={item.title}>
            <h5>{item.title}</h5>
            <p>{item.text}</p>
          </div>
        ))}
      </section>

      <section id="bastu" className="experience-section">
        <div className="experience-image">
          <img src="/bastu1.png" alt="Bastu" />
        </div>
        <div className="experience-content">
          <p className="section-label">Bastu</p>
          <div className="section-heading">
            <h3>Våra bastur</h3>
          </div>
          <p className="section-body">
            Upplev värmen och återhämtningen i våra traditionella bastur. Vi erbjuder både inomhus- och utomhusbastur
            där du kan växla mellan intensiv värme och uppfriskande kyla. Våra bastur är designade för både social
            gemenskap och individuell avkoppling.
          </p>
          <p className="section-meta">80–90°C · Traditionell och infraröd</p>
        </div>
      </section>

      <section id="zen-tradgard" className="experience-section reverse">
        <div className="experience-image">
          <img src="/zengarden.png" alt="Zen trädgård" />
        </div>
        <div className="experience-content">
          <p className="section-label">Zen trädgård</p>
          <div className="section-heading">
            <h3>Japanska trädgården</h3>
          </div>
          <p className="section-body">
            Vår zen-trädgård är en fridfull oas inspirerad av traditionell japansk trädgårdskonst. Här kan du
            meditera, reflektera eller helt enkelt njuta av stillheten. Trädgården är designad för att skapa harmoni
            mellan natur och människa, och erbjuder en plats för inre lugn och kontemplation.
          </p>
          <p className="section-meta">Året om · Tyst zon</p>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-intro">
          <h2>Vanliga frågor</h2>
          <p>
            Om du inte kan hitta svaret du behöver, tveka inte att kontakta våra värdar via telefon, e-post eller chatt.
            Vi svarar dagligen och är glada att hjälpa dig planera ditt besök.
          </p>
        </div>
        <div className="faq-grid">
          {faqs.map(item => (
            <div className="faq-card" key={item.question}>
              <h4>{item.question}</h4>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <p className="eyebrow">Planera ditt besök</p>
          <h2>Övernattningar, dagspa-ritualer och skräddarsydda gruppresor.</h2>
          <p>
            Välj mellan återhämtande dagsessioner, ljusstake kvällsbesök eller flerdagars flykter med kuraterad
            mat. Vårt concierge-team kan också skräddarsy program för företag och privata sammankomster.
          </p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-primary">Boka nu</Link>
            <Link to="/about" className="btn btn-secondary">Upptäck vår berättelse</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WellnessExperience;


