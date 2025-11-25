import React from 'react';
import { Link } from 'react-router-dom';
import './Bastu.css';

const saunas = [
  {
    title: 'Shiomushiburo',
    subtitle: '塩蒸し風呂 · Ångsaltbastu',
    description:
      'Ta en handfull salt med dig in till ångsaltbastun, skrubba kroppen och låt den salta, heta ångan göra sitt. Inne i bastun finns handduschar att skölja sig med.',
    temperature: 'Lufttemperatur 42–43 grader',
    image: '/bastu1.png',
  },
  {
    title: 'Sauna',
    subtitle: 'サウナ · Torrbastu',
    description:
      'Slå dig ner i torrbastun och låt tankarna vandra fritt medan du blickar ut över tallskogen. När du är redo, testa den kalla vattenfallsduschen och känn sensationen av hur kroppen växlar mellan värme och kyla.',
    temperature: 'Lufttemperatur 80 grader',
    image: '/bastunummer2.png',
  },
  {
    title: 'Ganbanyoku',
    subtitle: '岩盤浴 · Sovbastu',
    description:
      'Vad kan väl vara skönare än att varva ner i vår sovbastu? Vila, slumra en stund eller meditera – sovbastun är en av våra tysta zoner som bjuder in till total avslappning och stillhet. Låt den milda värmen från stenhällarna omfamna dig medan kroppen och sinnet får sin ro.',
    temperature: 'Lufttemperatur 40 grader',
    badge: 'En av våra tysta zoner',
    image: '/infrarodbastu.png',
  },
  {
    title: 'Kallbad & bastu utomhus',
    subtitle: '露天風呂',
    description:
      'Upplev kontrasten mellan hetta och svalka i vår utebastu med utsikt över tallarna och Saltsjön, med ett uppfriskande kallbad på 12 grader precis intill. Bastuns exteriör är inspirerad av en byggnad i Nara från 700-talets Japan och kombinerar anrik historia med tidlös arkitektur.',
    temperature: 'Bastu 80–90°C · Kallbad 12°C',
    image: '/pictureforbadandkallor.png',
  },
];

const Bastu = () => {
  return (
    <div className="bastu-page">
      {/* Hero Section */}
      <section
        className="bastu-hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/bastu1.png)` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Bastu</h1>
          <p className="hero-subtitle">Värme som gör gott</p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="bastu-intro">
        <div className="container">
          <h2 className="section-title">Våra olika bastur</h2>
          <p className="intro-text">
            Värme och vila i flera former
          </p>
          <p className="intro-description">
            Att bada bastu är välgörande både för vår mentala och fysiska hälsa. Hos oss kan du uppleva olika sorters bastu med olika temperatur och fuktighet. Basturna nedan är gemensamma. Vi har även torrbastur i tvagningsrummen för män respektive kvinnor.
          </p>
        </div>
      </section>

      {/* Sauna Sections */}
      {saunas.map((sauna, index) => (
        <section
          key={sauna.title}
          className={`sauna-section ${index % 2 !== 0 ? 'reverse' : ''}`}
        >
          <div className="sauna-image">
            <img src={sauna.image} alt={sauna.title} />
          </div>
          <div className="sauna-content">
            <p className="section-label">{sauna.subtitle}</p>
            <div className="section-heading">
              <h3>{sauna.title}</h3>
              {sauna.badge && <span className="section-badge">{sauna.badge}</span>}
            </div>
            <p className="section-body">{sauna.description}</p>
            <p className="section-meta">{sauna.temperature}</p>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="bastu-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Upptäck våra bastur</h2>
            <p className="cta-text">
              Boka ditt besök idag och upplev den välgörande effekten av värme och avslappning.
            </p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary">Boka nu</Link>
              <Link to="/wellness-experience" className="btn btn-secondary">Läs mer om upplevelsen</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bastu;

