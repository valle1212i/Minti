import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="page-title">About Minti</h1>
          <p className="page-subtitle">
            A sanctuary for wellness, tranquility, and renewal
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section">
        <div className="container">
          <div className="philosophy-content">
            <div className="philosophy-image">
              <div className="image-placeholder">
                <span>Our Philosophy</span>
              </div>
            </div>
            <div className="philosophy-text">
              <h2 className="section-title">Our Philosophy</h2>
              <p className="section-text">
                For nearly three decades, Minti has been a place where people come 
                to disconnect from everyday life and gather new energy. Stillness, 
                beauty, and harmony were the guiding principles at the start. Today, 
                Minti offers a beautiful contrast between the hectic everyday life 
                and a moment of peace in a warm sanctuary. The soul's exhalation.
              </p>
              <p className="section-text">
                It is still the wellness experience that forms the heart of Minti. 
                Just as before, the wellness visit begins with an introduction to 
                our cleansing ritual, which everyone is encouraged to start with. 
                After the thorough cleansing, there are warm therapeutic waters 
                directly in the treatment room. Here you will also find a relaxation 
                sauna with aromatic scents.
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
              <h3>Natural Environment</h3>
              <p>
                Surrounded by serene natural landscapes, our facility is designed 
                to harmonize with the surrounding environment, creating a peaceful 
                retreat from the outside world.
              </p>
            </div>
            <div className="experience-item">
              <div className="experience-icon">
                <span>🧘</span>
              </div>
              <h3>Holistic Approach</h3>
              <p>
                We believe in treating the whole person—mind, body, and spirit. 
                Our programs integrate various wellness practices to create a 
                comprehensive healing experience.
              </p>
            </div>
            <div className="experience-item">
              <div className="experience-icon">
                <span>✨</span>
              </div>
              <h3>Personalized Care</h3>
              <p>
                Every guest receives personalized attention. Our experienced team 
                works with you to create a wellness journey tailored to your 
                individual needs and goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-section">
        <div className="container">
          <h2 className="section-title center">Our Facilities</h2>
          <p className="section-subtitle center">
            A space designed for tranquility and renewal
          </p>
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
                <span>Facilities Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title center">Our Team</h2>
          <p className="section-subtitle center">
            Experienced professionals dedicated to your wellness
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <div className="image-placeholder">
                  <span>Team Member</span>
                </div>
              </div>
              <h3>Sarah Johnson</h3>
              <p className="member-role">Wellness Director</p>
              <p className="member-bio">
                With over 15 years of experience in holistic wellness, Sarah leads 
                our team with passion and expertise.
              </p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <div className="image-placeholder">
                  <span>Team Member</span>
                </div>
              </div>
              <h3>Michael Chen</h3>
              <p className="member-role">Head Therapist</p>
              <p className="member-bio">
                Specializing in therapeutic treatments and bodywork, Michael brings 
                deep knowledge of healing practices.
              </p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <div className="image-placeholder">
                  <span>Team Member</span>
                </div>
              </div>
              <h3>Emma Williams</h3>
              <p className="member-role">Yoga & Meditation Instructor</p>
              <p className="member-bio">
                Emma guides guests through transformative yoga and meditation practices 
                for inner peace and balance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

