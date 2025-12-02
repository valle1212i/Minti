import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        video.classList.add('playing');
      };
      
      video.addEventListener('canplay', handleCanPlay);
      
      // If video is already loaded
      if (video.readyState >= 3) {
        video.classList.add('playing');
      }

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="/spa.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <p className="hero-subheading">Välkommen till Minti</p>
            <h1 className="hero-title">Wellness på ditt vis</h1>
            <p className="hero-subtitle">
              Upptäck lugn och förnyelse i vår fridfulla oas. 
              En plats där modern wellness möter tidlös frid.
            </p>
            <div className="hero-buttons">
              <Link to="/contact" className="btn btn-primary">Boka ditt besök</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section">
        <div className="container">
          <div className="intro-content">
            <h2 className="section-title">Om Minti</h2>
            <p className="section-text">
              Avskalad dramatik och eleganta miljöer, där du är i centrum. 
              Upptäck vår unika wellness-oas – Minti är en oas inbäddad i fridfulla 
              naturliga omgivningar där traditionella wellness-praktiker möter modern design. 
              Här väntar wellness på ditt vis, från varma terapeutiska behandlingar till 
              uppfriskande kalla dopp, eller helt enkelt ett riktigt gott ögonblick med fängslande utsikter.
            </p>
            <p className="section-text">
              Oavsett om du vill ha ett ögonblick av stillhet eller glädjas med nära och kära, 
              finns det alla möjligheter att forma ditt besök som du önskar. Välkommen!
            </p>
          </div>
        </div>
      </section>

      {/* Wellness Experience Section */}
      <section className="wellness-section">
        <div className="wellness-image">
          <img 
            src="/twowomenspa.png" 
            alt="Välmående-upplevelse" 
            className="wellness-section-image"
          />
        </div>
        <div className="wellness-content">
          <div className="wellness-text">
            <h2 className="section-title">Välmående-upplevelsen</h2>
            <p className="section-subheading">En plats för alla sinnen</p>
            <p className="section-description">
              En plats för alla sinnen. Börja med vår rengöringsritual, släpp alla 
              måsten från vardagslivet och låt dig omslutas av varma terapeutiska vatten 
              eller väck din livskraft med ett uppfriskande kallt dopp. 
              Våra bastur och utomhusbad väcker dina sinnen, och du bestämmer vad som passar dig.
            </p>
            <Link to="/wellness-experience" className="btn-link">Läs mer →</Link>
          </div>
        </div>
      </section>

      {/* Visit Options Section */}
      <section className="visit-section">
        <div className="container">
          <h2 className="section-title center">Besök vårt wellnesscenter</h2>
          <p className="section-subtitle center">
            Övernattning eller besök över dagen?
          </p>
          <div className="visit-cards">
            <div className="visit-card">
              <div className="card-image">
                <img 
                  src="/spapictureofapart.png" 
                  alt="Wellness med övernattning" 
                  className="card-image-img"
                />
              </div>
              <div className="card-content">
                <h3>Wellness med övernattning</h3>
                <p>
                  Upplev avkoppling i vårt wellnesscenter, delta i välgörande aktiviteter 
                  och njut av utsökta måltider inspirerade av holistisk näring i en av våra restauranger. 
                  Stanna över natten eller besök för dagen.
                </p>
                <Link to="/contact" className="btn btn-primary">Boka vistelse</Link>
              </div>
            </div>
            <div className="visit-card">
              <div className="card-image">
                <img 
                  src="/dasspaspic.png" 
                  alt="Dagspa / Kvällsspa" 
                  className="card-image-img"
                />
              </div>
              <div className="card-content">
                <h3>Dagspa / Kvällsspa</h3>
                <p>
                  Perfekt för en dag av förnyelse. Njut av vårt fulla utbud av 
                  wellness-tjänster, behandlingar och faciliteter under dagen 
                  eller kvällen. En komplett wellness-upplevelse i ett enda besök.
                </p>
                <Link to="/contact" className="btn btn-primary">Boka dagspa</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dining Section */}
      <section className="dining-section">
        <div className="dining-content">
          <div className="dining-text">
            <h2 className="section-title">Mat & Näring</h2>
            <p className="section-subheading">Smakresa för sinnena</p>
            <p className="section-description">
              En smakresa för sinnena. Lunch i wellnessanda, unika middagsupplevelser 
              och välgjorda drycker – Minti är så mycket mer än bara en wellness-upplevelse. 
              Bekanta dig med influenser från modern, holistisk matlagning i vår restaurang, 
              vid baren eller på terrassen med drömlika utsikter. Välkommen till en smakresa för alla sinnen.
            </p>
            <Link to="/services" className="btn-link">Vår restaurang →</Link>
          </div>
        </div>
        <div className="dining-image">
          <div className="image-placeholder">
            <span>Matupplevelse</span>
          </div>
        </div>
      </section>

      {/* Accommodation Section */}
      <section className="accommodation-section">
        <div className="container">
          <div className="accommodation-content">
            <div className="accommodation-image">
              <div className="image-placeholder large">
                <span>Boende</span>
              </div>
            </div>
            <div className="accommodation-text">
              <h2 className="section-title">Boende</h2>
              <p className="section-subheading">Minimalistisk design med fridfulla utsikter</p>
              <p className="section-description">
                Minimalistisk design med fridfulla utsikter. Vi har genomtänkt designade 
                rum, alla i en stil med tydlig inspiration från wellness och 
                frid. Den enkla, men välgenomtänkta estetiken är skapad 
                för att inbjuda till inre lugn. Fokuset är avsett att ligga främst på 
                din inre upplevelse i sig och inte på dekorationen. Alla rum har 
                utsikt över det omgivande naturlandskapet. Frukostbuffé är 
                alltid inkluderad när du bokar övernattningspaket hos oss.
              </p>
              <div className="accommodation-buttons">
                <Link to="/contact" className="btn btn-primary">Boka boende</Link>
                <Link to="/gallery" className="btn btn-outline">Se rum</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

