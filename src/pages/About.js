import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="page-title">Om Minti</h1>
          <p className="page-subtitle">
            En fristad för wellness, frid och förnyelse
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section">
        <div className="container">
          <div className="philosophy-content">
            <div className="philosophy-image">
              <div className="image-placeholder">
                <span>Vår filosofi</span>
              </div>
            </div>
            <div className="philosophy-text">
              <h2 className="section-title">Vår filosofi</h2>
              <p className="section-subheading">En fristad för wellness, frid och förnyelse</p>
              <p className="section-text">
                I nästan tre decennier har Minti varit en plats där människor kommer 
                för att koppla bort från vardagslivet och samla ny energi. Stillhet, 
                skönhet och harmoni var de ledande principerna från början. Idag 
                erbjuder Minti en vacker kontrast mellan det hektiska vardagslivet 
                och ett ögonblick av frid i en varm fristad. Själens utandning.
              </p>
              <p className="section-text">
                Det är fortfarande wellness-upplevelsen som bildar hjärtat av Minti. 
                Precis som tidigare börjar wellness-besöket med en introduktion till 
                vår rengöringsritual, som alla uppmuntras att börja med. 
                Efter den noggranna rengöringen finns det varma terapeutiska vatten 
                direkt i behandlingsrummet. Här hittar du också en avslappningsbastu 
                med aromatiska dofter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="experience-section">
        <div className="container">
          <div className="experience-grid">
            <div className="experience-item">
              <div className="experience-icon">
                <span>🌿</span>
              </div>
              <h3>Naturlig miljö</h3>
              <p>
                Omgiven av fridfulla naturlandskap är vår anläggning designad 
                för att harmoniera med den omgivande miljön, vilket skapar en fridfull 
                tillflyktsort från omvärlden.
              </p>
            </div>
            <div className="experience-item">
              <div className="experience-icon">
                <span>🧘</span>
              </div>
              <h3>Holistiskt förhållningssätt</h3>
              <p>
                Vi tror på att behandla hela människan – sinne, kropp och själ. 
                Våra program integrerar olika wellness-praktiker för att skapa en 
                omfattande helande upplevelse.
              </p>
            </div>
            <div className="experience-item">
              <div className="experience-icon">
                <span>✨</span>
              </div>
              <h3>Personlig omsorg</h3>
              <p>
                Varje gäst får personlig uppmärksamhet. Vårt erfarna team 
                arbetar med dig för att skapa en wellnessresa skräddarsydd efter dina 
                individuella behov och mål.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-section">
        <div className="container">
          <h2 className="section-title center">Våra faciliteter</h2>
          <p className="section-subheading center">Ett utrymme designat för frid och förnyelse</p>
          <div className="facilities-content">
            <div className="facilities-text">
              <p className="section-text">
                When you step out of the treatment room, you are met by an environment 
                inspired by natural courtyards. Here, the courtyard, which consists 
                of a warm bath with water that maintains 34-36 degrees, is surrounded 
                by treatment areas with a cold bath, a carbonated bath, and a steam 
                sauna with salt. Adjacent is also a larger sanarium with a temperature 
                of 65-80 degrees and views of the surrounding forest.
              </p>
              <p className="section-text">
                The new environment has taken hold of the natural and stands in harmony 
                with the sparse Nordic forest and sea environment. Concrete and wood are 
                basic elements together with vegetation that, among other things, consists 
                of trees adjacent to one of the treatment areas. The environment should 
                feel intimate and warm, while at the same time there are surfaces for 
                everyone to find their secluded place.
              </p>
            </div>
            <div className="facilities-image">
              <div className="image-placeholder large">
                <span>Faciliteter</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title center">Vårt team</h2>
          <p className="section-subheading center">Erfarna professionella dedikerade till din wellness</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <div className="image-placeholder">
                  <span>Team Member</span>
                </div>
              </div>
              <h3>Sarah Johnson</h3>
              <p className="member-role">Wellnessdirektör</p>
              <p className="member-bio">
                Med över 15 års erfarenhet inom holistisk wellness leder Sarah 
                vårt team med passion och expertis.
              </p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <div className="image-placeholder">
                  <span>Teammedlem</span>
                </div>
              </div>
              <h3>Michael Chen</h3>
              <p className="member-role">Huvudterapeut</p>
              <p className="member-bio">
                Specialiserad på terapeutiska behandlingar och kroppsarbete, för med sig Michael 
                djup kunskap om helande praktiker.
              </p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <div className="image-placeholder">
                  <span>Teammedlem</span>
                </div>
              </div>
              <h3>Emma Williams</h3>
              <p className="member-role">Yoga- & meditationsinstruktör</p>
              <p className="member-bio">
                Emma guidar gäster genom transformativa yoga- och meditationspraktiker 
                för inre frid och balans.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

