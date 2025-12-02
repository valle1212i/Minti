import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Spa-behandlingar',
      description: 'Njut av vårt utbud av terapeutiska spa-behandlingar designade för att förnya din kropp och ditt sinne. Från djupvävnadsmassage till aromaterapi-sessioner.',
      image: 'Spa-behandlingar',
      features: ['Svensk massage', 'Djupvävnad', 'Varm stensterapi', 'Aromaterapi']
    },
    {
      id: 2,
      title: 'Wellness-program',
      description: 'Omfattande wellness-program skräddarsydda efter dina behov. Upplev ett holistiskt förhållningssätt till hälsa och välbefinnande med våra expertguidade program.',
      image: 'Wellness-program',
      features: ['Detox-program', 'Viktkontroll', 'Stresslindring', 'Energiboost']
    },
    {
      id: 3,
      title: 'Yoga & Meditation',
      description: 'Hitta inre frid och balans genom våra yoga- och meditationsklasser. Lämpligt för alla nivåer, från nybörjare till avancerade utövare.',
      image: 'Yoga & Meditation',
      features: ['Hatha Yoga', 'Vinyasa Flow', 'Meditationssessioner', 'Andningstekniker']
    },
    {
      id: 4,
      title: 'Termiska upplevelser',
      description: 'Upplev den helande kraften av värme och kyla med våra termiska faciliteter. Från bastur till kalla dopp, återställ din kropps naturliga balans.',
      image: 'Termiska upplevelser',
      features: ['Finsk bastu', 'Ångbad', 'Kallt dopp', 'Infraröd terapi']
    },
    {
      id: 5,
      title: 'Näringsrådgivning',
      description: 'Närma din kropp med personlig näringsrådgivning. Våra experter hjälper dig att skapa en måltidsplan som stödjer dina wellness-mål.',
      image: 'Näringsrådgivning',
      features: ['Personliga konsultationer', 'Måltidsplanering', 'Kostanalys', 'Receptrådgivning']
    },
    {
      id: 6,
      title: 'Holistiska terapier',
      description: 'Utforska alternativa helande modaliteter inklusive akupunktur, reflexologi och energiterapi. Återställ harmoni till din kropps energisystem.',
      image: 'Holistiska terapier',
      features: ['Akupunktur', 'Reflexologi', 'Reiki', 'Kristallhealing']
    }
  ];

  return (
    <div className="services">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="services-hero-content">
          <h1 className="page-title">Våra tjänster</h1>
          <p className="page-subtitle">
            Ett omfattande utbud av wellness-upplevelser skräddarsydda efter dina behov
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-image">
                  <div className="image-placeholder">
                    <span>{service.image}</span>
                  </div>
                </div>
                <div className="service-content">
                  <h2 className="service-title">{service.title}</h2>
                  <p className="service-description">{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className="service-btn">Boka nu</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="packages-section">
        <div className="container">
          <h2 className="section-title center">Wellness-paket</h2>
          <p className="section-subheading center">Välj bland våra kuraterade paket för en komplett wellness-upplevelse</p>
          <div className="packages-grid">
            <div className="package-card">
              <h3 className="package-name">Dagreträtt</h3>
              <div className="package-price">1990 kr</div>
              <p className="package-duration">Heldagsupplevelse</p>
              <ul className="package-features">
                <li>Tillgång till alla faciliteter</li>
                <li>2 spa-behandlingar</li>
                <li>Yoga- & meditationsklass</li>
                <li>Nyttig lunch inkluderad</li>
                <li>Wellness-konsultation</li>
              </ul>
              <Link to="/contact" className="btn btn-primary">Boka paket</Link>
            </div>
            <div className="package-card featured">
              <div className="package-badge">Mest populär</div>
              <h3 className="package-name">Helgflykt</h3>
              <div className="package-price">5990 kr</div>
              <p className="package-duration">2 nätter / 3 dagar</p>
              <ul className="package-features">
                <li>Boende inkluderat</li>
                <li>Alla måltider inkluderade</li>
                <li>4 spa-behandlingar</li>
                <li>Dagliga yogaklasser</li>
                <li>Wellness-program</li>
                <li>Personlig konsultation</li>
              </ul>
              <Link to="/contact" className="btn btn-primary">Boka paket</Link>
            </div>
            <div className="package-card">
              <h3 className="package-name">Wellness-vecka</h3>
              <div className="package-price">19 990 kr</div>
              <p className="package-duration">7 dagar / 6 nätter</p>
              <ul className="package-features">
                <li>Lyxboende</li>
                <li>Alla måltider & drycker</li>
                <li>Obegränsad spa-tillgång</li>
                <li>Dagliga wellness-aktiviteter</li>
                <li>Personligt program</li>
                <li>Uppföljningsstöd</li>
              </ul>
              <Link to="/contact" className="btn btn-primary">Boka paket</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Redo att börja din wellnessresa?</h2>
            <p className="cta-text">
              Kontakta oss idag för att diskutera dina wellness-mål och skapa en 
              personlig upplevelse just för dig.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">Kontakta oss</Link>
              <Link to="/gallery" className="btn btn-secondary">Se galleri</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

