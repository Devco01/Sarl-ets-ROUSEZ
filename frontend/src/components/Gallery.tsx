import React, { useState } from 'react';
import './Gallery.css';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems = [
    { src: '/assets/images/img5.jpg', alt: 'Installation chauffage', category: 'chauffage' },
    { src: '/assets/images/img6.JPG', alt: 'Climatisation', category: 'climatisation' },
    { src: '/assets/images/img7.jpg', alt: 'Salle de bain', category: 'sanitaire' },
    { src: '/assets/images/img8.JPG', alt: 'Plomberie', category: 'plomberie' },
    { src: '/assets/images/img9.JPG', alt: 'Système de chauffage', category: 'chauffage' },
    { src: '/assets/images/img10.jpg', alt: 'Équipements sanitaires', category: 'sanitaire' },
    { src: '/assets/images/img11.jpg', alt: 'Climatisation', category: 'climatisation' },
    { src: '/assets/images/img12.jpg', alt: 'Travaux plomberie', category: 'plomberie' },
    { src: '/assets/images/img13.jpg', alt: 'Installation chauffage', category: 'chauffage' },
    { src: '/assets/images/img14.jpg', alt: 'Aménagement sanitaire', category: 'sanitaire' },
    { src: '/assets/images/img15.jpg', alt: 'Climatisation bureau', category: 'climatisation' },
    { src: '/assets/images/img16.JPG', alt: 'Système chauffage moderne', category: 'chauffage' }
  ];

  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Nos Réalisations</h2>
          <p className="section-subtitle">
            Découvrez quelques-unes de nos réalisations récentes
          </p>
        </div>
        
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <div 
              key={index} 
              className="gallery-item animate-on-scroll"
              onClick={() => openModal(item.src)}
            >
              <img 
                src={item.src} 
                alt={item.alt}
                loading="lazy"
                onError={(e) => {
                  console.warn(`Erreur de chargement de l'image: ${item.src}`);
                  // Optionnel: remplacer par une image par défaut
                  // e.currentTarget.src = '/assets/images/placeholder.jpg';
                }}
              />
              <div className="gallery-overlay">
                <div className="overlay-content">
                  <i className="fas fa-expand-alt"></i>
                  <span>Voir en grand</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal pour afficher l'image en grand */}
      {selectedImage && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <img 
              src={selectedImage} 
              alt="Réalisation en grand"
              onError={(e) => {
                console.warn(`Erreur de chargement de l'image en modal: ${selectedImage}`);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
