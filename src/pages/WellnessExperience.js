import React from 'react';
import { Link } from 'react-router-dom';
import './WellnessExperience.css';

const bathExperiences = [
  {
    title: 'Daiyokujo',
    subtitle: '大浴場 · The Grand Bath',
    description:
      'The first space you enter is the heart of the house: a vast mirror of warm water framed by brutalist lines and soft light. Float beneath the skylight, watch reflections move across concrete walls, and let the stillness prepare you for everything that follows.',
    temperature: '35°C · Tranquil conversation zone',
    image: '/twowomenspa.png',
  },
  {
    title: 'Rotenburo',
    subtitle: '露天風呂 · Outdoor Springs',
    description:
      'Step outside, close your eyes, and listen to the pine trees. Our outdoor onsen pools keep a gentle 39°C all year round so you can feel winter air meeting mineral warmth. Silent half-hours each morning and afternoon invite mindful reflection.',
    temperature: '39°C · Quiet half-hours twice daily',
    image: '/spapictureofapart.png',
  },
  {
    title: 'Ashiyu',
    subtitle: '足湯 · Foot Bath Ritual',
    description:
      'Begin every visit by warming the body from the ground up. Sit, breathe, and let gratitude move through your feet and legs. The gradual heat calms the nervous system and prepares muscles for deeper immersion.',
    temperature: '39°C · Gentle entry ritual',
    image: '/dasspaspic.png',
  },
  {
    title: 'Tansanburo',
    subtitle: '炭酸風呂 · Carbonated Silence',
    description:
      'Fine micro-bubbles embrace the skin and stimulate circulation in this fully silent zone. Guests enter with hushed movements, letting the effervescent water create a meditative auditory blanket.',
    temperature: '39°C · Silent zone',
    badge: 'Quiet Zone',
    image: '/twowomenspa.png',
  },
  {
    title: 'Mizoburo',
    subtitle: '水風呂 · Cold Immersion',
    description:
      'A crystalline plunge held between 12–14°C resets the body after each heat experience. Transitioning between warmth and cold is part of our circulatory ritual and boosts mental clarity.',
    temperature: '12–14°C · Invigorating contrast',
    image: '/spapictureofapart.png',
  },
  {
    title: 'Dokutsuburo',
    subtitle: '洞窟風呂 · Rock Chamber Bath',
    description:
      'Carved directly into the bedrock, this cave bath glows with candlelight reflections. Moist air, mineral-rich water, and the surrounding stone create an intimate cocoon reserved for silent contemplation.',
    temperature: '39°C · Silent zone',
    badge: 'Quiet Zone',
    image: '/dasspaspic.png',
  },
  {
    title: 'Outdoor Sauna & Cold Plunge',
    subtitle: '露天風呂 · Fire Meets Ice',
    description:
      'Our timber sauna, inspired by Nara architecture from the 700s, opens toward the archipelago. Step directly into the 12°C plunge pool, feel the sea breeze, and repeat as your body finds its rhythm.',
    temperature: 'Sauna 80–90°C · Plunge 12°C',
    image: '/twowomenspa.png',
  },
];

const ritualSteps = [
  {
    title: 'Arrive & Breathe',
    detail: 'Collect your yukata, shower essentials, and pause to feel the shift from everyday life to ritual space.',
  },
  {
    title: 'Tvagningsritual',
    detail: 'Sit on a low stool, fill the basin, and cleanse slowly from feet to heart. Rinse thoroughly so the baths remain pristine.',
  },
  {
    title: 'Immerse & Alternate',
    detail: 'Move between warm springs, carbonated baths, saunas, and cold plunges. Listen to your body—there is no rush.',
  },
  {
    title: 'Quiet Reflection',
    detail: 'Use our tysta zoner to meditate, journal, or simply notice your breath. We ask everyone to keep devices away.',
  },
];

const wellbeingHighlights = [
  {
    title: 'Ultrafiltration',
    text: 'A built-in virus barrier exceeds public health standards, preventing pathogens from passing into our pools.',
  },
  {
    title: 'Influensavirus Policy',
    text: 'Mechanical filtration, monitored chemistry, and continuous circulation mean flu viruses cannot survive in the baths.',
  },
  {
    title: 'Onsen Etiquette',
    text: 'Move mindfully, keep towels out of the water, and remember that you are always part of someone else’s experience.',
  },
  {
    title: 'Hydration & Nutrition',
    text: 'Complimentary infused water stations and seasonal teas support the warm environment—sip often between sessions.',
  },
];

const faqs = [
  {
    question: 'When is the wellness experience open?',
    answer:
      'Our full bathhouse is open daily from early morning until late evening. Outdoor pools remain open year-round unless extreme weather requires a short closure for safety.',
  },
  {
    question: 'Is there an age limit?',
    answer:
      'Day access is available from 13 years when accompanied by an adult. Evening sessions maintain a 16+ calm policy to protect the serene atmosphere.',
  },
  {
    question: 'Do I need to book in advance?',
    answer:
      'Weekends and holidays fill quickly. Pre-book to guarantee entry, treatments, and dining. Midweek visits offer the quietest flow.',
  },
  {
    question: 'What should I bring?',
    answer:
      'We provide yukata, slippers, towels, and organic bath products. You are welcome to bring personal swimwear, though it is optional in our bathing zones.',
  },
];

const WellnessExperience = () => {
  return (
    <div className="wellness-page">
      <section className="wellness-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="eyebrow">Våra bad & källor</p>
          <h1>The Wellness Experience</h1>
          <p className="lead">
            A sensory journey where elemental water rituals meet modern Scandinavian design.
            Move through warm and cold, sound and silence, conversation and contemplation.
          </p>
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary">Book Your Ritual</Link>
            <Link to="/services" className="btn btn-secondary">View Treatments</Link>
          </div>
        </div>
      </section>

      <section className="wellness-intro">
        <div className="intro-text">
          <h2>Designed for Stillness and Conversation</h2>
          <p>
            Inspired by the Japanese concept of yasuragi—the exhale you take when you sink into a perfect bath—
            we have divided the house into distinct zones. Some welcome gentle conversation and laughter with
            loved ones; others invite silence, introspection, and a meditative pace. Visit on weekday mornings
            or evenings for the quietest atmosphere, or join our guided dojo sessions to deepen your focus.
          </p>
          <p>
            Wear the yukata we provide or bring your own swim attire if you prefer. Drink water often, place your
            phone on silent, and let our hosts guide you through every step of the ritual.
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
          <h2>The Tvagningsritual · 清め</h2>
          <p>
            In Japan, cleansing happens before bathing. Take your time—this sequence has been refined over centuries
            to calm the mind and honor the water we share.
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

      <section className="faq-section">
        <div className="faq-intro">
          <h2>Frequently Asked Questions</h2>
          <p>
            If you cannot find the answer you need, feel free to reach out to our hosts by phone, email, or chat.
            We respond daily and are happy to help you plan your visit.
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
          <p className="eyebrow">Plan Your Visit</p>
          <h2>Overnight stays, day spa rituals, and bespoke group itineraries.</h2>
          <p>
            Choose between restorative day sessions, candlelit evening visits, or multi-day escapes with curated
            dining. Our concierge team can also tailor programs for companies and private gatherings.
          </p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-primary">Book Now</Link>
            <Link to="/about" className="btn btn-secondary">Discover Our Story</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WellnessExperience;


