import React, { useState } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { id: 1, category: 'facilities', title: 'Wellness Center' },
    { id: 2, category: 'facilities', title: 'Spa Treatment Room' },
    { id: 3, category: 'accommodation', title: 'Luxury Suite' },
    { id: 4, category: 'accommodation', title: 'Standard Room' },
    { id: 5, category: 'dining', title: 'Restaurant' },
    { id: 6, category: 'dining', title: 'Dining Area' },
    { id: 7, category: 'facilities', title: 'Sauna' },
    { id: 8, category: 'facilities', title: 'Outdoor Pool' },
    { id: 9, category: 'activities', title: 'Yoga Studio' },
    { id: 10, category: 'activities', title: 'Meditation Space' },
    { id: 11, category: 'facilities', title: 'Relaxation Area' },
    { id: 12, category: 'accommodation', title: 'Suite Bathroom' },
  ];

  const categories = ['all', 'facilities', 'accommodation', 'dining', 'activities'];
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="gallery-hero-content">
          <h1 className="page-title">Gallery</h1>
          <p className="page-subtitle">
            Explore our serene spaces and wellness facilities
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="gallery-filters">
        <div className="container">
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-section">
        <div className="container">
          <div className="gallery-grid">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="gallery-item"
                onClick={() => openLightbox(image)}
              >
                <div className="gallery-image">
                  <div className="image-placeholder">
                    <span>{image.title}</span>
                  </div>
                  <div className="gallery-overlay">
                    <span className="gallery-title">{image.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              ×
            </button>
            <div className="lightbox-image">
              <div className="image-placeholder large">
                <span>{selectedImage.title}</span>
              </div>
            </div>
            <div className="lightbox-title">{selectedImage.title}</div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="gallery-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Experience It Yourself</h2>
            <p className="cta-text">
              Ready to visit our wellness center? Book your stay or day visit today.
            </p>
            <a href="/contact" className="btn btn-primary">Book Now</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

