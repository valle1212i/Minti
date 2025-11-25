import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Spa Treatments',
      description: 'Indulge in our range of therapeutic spa treatments designed to rejuvenate your body and mind. From deep tissue massages to aromatherapy sessions.',
      image: 'Spa Treatments',
      features: ['Swedish Massage', 'Deep Tissue', 'Hot Stone Therapy', 'Aromatherapy']
    },
    {
      id: 2,
      title: 'Wellness Programs',
      description: 'Comprehensive wellness programs tailored to your needs. Experience a holistic approach to health and wellbeing with our expert-guided programs.',
      image: 'Wellness Programs',
      features: ['Detox Programs', 'Weight Management', 'Stress Relief', 'Energy Boost']
    },
    {
      id: 3,
      title: 'Yoga & Meditation',
      description: 'Find inner peace and balance through our yoga and meditation classes. Suitable for all levels, from beginners to advanced practitioners.',
      image: 'Yoga & Meditation',
      features: ['Hatha Yoga', 'Vinyasa Flow', 'Meditation Sessions', 'Breathing Techniques']
    },
    {
      id: 4,
      title: 'Thermal Experiences',
      description: 'Experience the healing power of heat and cold with our thermal facilities. From saunas to cold plunges, restore your body\'s natural balance.',
      image: 'Thermal Experiences',
      features: ['Finnish Sauna', 'Steam Room', 'Cold Plunge', 'Infrared Therapy']
    },
    {
      id: 5,
      title: 'Nutritional Guidance',
      description: 'Nourish your body with personalized nutritional guidance. Our experts will help you create a meal plan that supports your wellness goals.',
      image: 'Nutritional Guidance',
      features: ['Personal Consultations', 'Meal Planning', 'Dietary Analysis', 'Recipe Guidance']
    },
    {
      id: 6,
      title: 'Holistic Therapies',
      description: 'Explore alternative healing modalities including acupuncture, reflexology, and energy healing. Restore harmony to your body\'s energy systems.',
      image: 'Holistic Therapies',
      features: ['Acupuncture', 'Reflexology', 'Reiki', 'Crystal Healing']
    }
  ];

  return (
    <div className="services">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="services-hero-content">
          <h1 className="page-title">Our Services</h1>
          <p className="page-subtitle">
            A comprehensive range of wellness experiences tailored to your needs
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
                  <Link to="/contact" className="service-btn">Book Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="packages-section">
        <div className="container">
          <h2 className="section-title center">Wellness Packages</h2>
          <p className="section-subtitle center">
            Choose from our curated packages for a complete wellness experience
          </p>
          <div className="packages-grid">
            <div className="package-card">
              <h3 className="package-name">Day Retreat</h3>
              <div className="package-price">$199</div>
              <p className="package-duration">Full Day Experience</p>
              <ul className="package-features">
                <li>Access to all facilities</li>
                <li>2 spa treatments</li>
                <li>Yoga & meditation class</li>
                <li>Healthy lunch included</li>
                <li>Wellness consultation</li>
              </ul>
              <Link to="/contact" className="btn btn-primary">Book Package</Link>
            </div>
            <div className="package-card featured">
              <div className="package-badge">Most Popular</div>
              <h3 className="package-name">Weekend Escape</h3>
              <div className="package-price">$599</div>
              <p className="package-duration">2 Nights / 3 Days</p>
              <ul className="package-features">
                <li>Accommodation included</li>
                <li>All meals included</li>
                <li>4 spa treatments</li>
                <li>Daily yoga classes</li>
                <li>Wellness program</li>
                <li>Personal consultation</li>
              </ul>
              <Link to="/contact" className="btn btn-primary">Book Package</Link>
            </div>
            <div className="package-card">
              <h3 className="package-name">Wellness Week</h3>
              <div className="package-price">$1,999</div>
              <p className="package-duration">7 Days / 6 Nights</p>
              <ul className="package-features">
                <li>Luxury accommodation</li>
                <li>All meals & beverages</li>
                <li>Unlimited spa access</li>
                <li>Daily wellness activities</li>
                <li>Personalized program</li>
                <li>Follow-up support</li>
              </ul>
              <Link to="/contact" className="btn btn-primary">Book Package</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Begin Your Wellness Journey?</h2>
            <p className="cta-text">
              Contact us today to discuss your wellness goals and create a 
              personalized experience just for you.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
              <Link to="/gallery" className="btn btn-secondary">View Gallery</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

