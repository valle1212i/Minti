import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <video
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
            poster="/twowomenspa.png"
          >
            <source src="/spa.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Wellness on Your Terms</h1>
            <p className="hero-subtitle">
              Discover tranquility and renewal in our serene sanctuary. 
              A place where modern wellness meets timeless serenity.
            </p>
            <div className="hero-buttons">
              <Link to="/contact" className="btn btn-primary">Book Your Stay</Link>
              <Link to="/services" className="btn btn-secondary">Explore Services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section">
        <div className="container">
          <div className="intro-content">
            <h2 className="section-title">Welcome to Minti</h2>
            <p className="section-text">
              Stripped-down drama and elegant environments, where you are at the center. 
              Discover our unique wellness sanctuary – Minti is an oasis nestled in serene 
              natural surroundings where traditional wellness practices meet modern design. 
              Here awaits wellness on your terms, from warm therapeutic treatments to 
              refreshing cold plunges, or simply a truly good moment with captivating views.
            </p>
            <p className="section-text">
              Whether you want a moment of stillness or to rejoice with loved ones, 
              there are all possibilities to shape your visit as you wish. Welcome!
            </p>
          </div>
        </div>
      </section>

      {/* Wellness Experience Section */}
      <section className="wellness-section">
        <div className="wellness-image">
          <img 
            src="/twowomenspa.png" 
            alt="Wellness Experience" 
            className="wellness-section-image"
          />
        </div>
        <div className="wellness-content">
          <div className="wellness-text">
            <h2 className="section-title">The Wellness Experience</h2>
            <p className="section-description">
              A place for all senses. Begin with our cleansing ritual, let go of all 
              the must-dos of everyday life, and let yourself be enveloped by warm 
              therapeutic waters or awaken your life force with a refreshing cold plunge. 
              Our saunas and outdoor baths awaken your senses, and you decide what suits you.
            </p>
            <Link to="/services" className="btn-link">Learn More →</Link>
          </div>
        </div>
      </section>

      {/* Visit Options Section */}
      <section className="visit-section">
        <div className="container">
          <h2 className="section-title center">Visit Our Wellness Center</h2>
          <p className="section-subtitle center">
            Overnight stay or day visit?
          </p>
          <div className="visit-cards">
            <div className="visit-card">
              <div className="card-image">
                <img 
                  src="/spapictureofapart.png" 
                  alt="Wellness with Overnight Stay" 
                  className="card-image-img"
                />
              </div>
              <div className="card-content">
                <h3>Wellness with Overnight Stay</h3>
                <p>
                  Experience relaxation in our wellness center, participate in 
                  beneficial activities, and enjoy exquisite meals inspired by 
                  holistic nutrition in one of our restaurants. Stay overnight or visit for the day.
                </p>
                <Link to="/contact" className="btn btn-primary">Book Stay</Link>
              </div>
            </div>
            <div className="visit-card">
              <div className="card-image">
                <img 
                  src="/dasspaspic.png" 
                  alt="Day Spa / Evening Spa" 
                  className="card-image-img"
                />
              </div>
              <div className="card-content">
                <h3>Day Spa / Evening Spa</h3>
                <p>
                  Perfect for a day of rejuvenation. Enjoy our full range of 
                  wellness services, treatments, and facilities during the day 
                  or evening. A complete wellness experience in a single visit.
                </p>
                <Link to="/contact" className="btn btn-primary">Book Day Spa</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dining Section */}
      <section className="dining-section">
        <div className="dining-content">
          <div className="dining-text">
            <h2 className="section-title">Dining & Nourishment</h2>
            <p className="section-description">
              A taste journey for the senses. Lunch in wellness spirit, unique 
              dinner experiences, and well-crafted beverages – Minti is so much 
              more than just a wellness experience. Get acquainted with influences 
              from modern, holistic cuisine in our restaurant, at the bar, or on 
              the terrace with dreamy views. Welcome to a taste journey for all senses.
            </p>
            <Link to="/services" className="btn-link">Our Restaurant →</Link>
          </div>
        </div>
        <div className="dining-image">
          <div className="image-placeholder">
            <span>Dining Experience Image</span>
          </div>
        </div>
      </section>

      {/* Accommodation Section */}
      <section className="accommodation-section">
        <div className="container">
          <div className="accommodation-content">
            <div className="accommodation-image">
              <div className="image-placeholder large">
                <span>Accommodation Image</span>
              </div>
            </div>
            <div className="accommodation-text">
              <h2 className="section-title">Accommodation</h2>
              <p className="section-description">
                Minimalist design with serene views. We have thoughtfully designed 
                rooms, all in a style with clear inspiration from wellness and 
                tranquility. The simple, yet well-thought-out aesthetic is created 
                to invite inner calm. The focus is intended to lie primarily on 
                your inner experience itself and not the decoration. All rooms have 
                views over the surrounding natural landscape. Breakfast buffet is 
                always included when you book overnight packages with us.
              </p>
              <div className="accommodation-buttons">
                <Link to="/contact" className="btn btn-primary">Book Accommodation</Link>
                <Link to="/gallery" className="btn btn-secondary">View Rooms</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

