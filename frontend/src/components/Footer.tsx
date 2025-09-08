import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section footer-main">
            <img src="/assets/images/Logo.PNG" alt="Ets ROUSEZ" className="footer-logo" />
            <p>SARL Jérémie Arrivé - Votre expert en chauffage, climatisation, plomberie et sanitaire.</p>
          </div>
          
          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li>
                <button onClick={() => scrollToSection('home')}>
                  <i className="fas fa-home"></i>
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')}>
                  <i className="fas fa-cog"></i>
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')}>
                  <i className="fas fa-info-circle"></i>
                  À propos
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('gallery')}>
                  <i className="fas fa-images"></i>
                  Réalisations
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')}>
                  <i className="fas fa-envelope"></i>
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Nous contacter</h4>
            <div className="contact-links">
              <a href="tel:0546368283" className="contact-link">
                <i className="fas fa-phone"></i>
                <span>05 46 36 82 83</span>
              </a>
              <a href="mailto:etsrousez@gmail.com" className="contact-link">
                <i className="fas fa-envelope"></i>
                <span>etsrousez@gmail.com</span>
              </a>
              <div className="contact-link">
                <i className="fas fa-map-marker-alt"></i>
                <span>4 Zac des Bregaudieres<br />17390 La Tremblade</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Ets ROUSEZ - SARL Jérémie Arrivé. Tous droits réservés.</p>
          </div>
          <div className="footer-legal">
            <a href="/mentions-legales.html" target="_blank" rel="noopener noreferrer">
              Mentions légales
            </a>
            <span className="separator">|</span>
            <a href="/politique-confidentialite.html" target="_blank" rel="noopener noreferrer">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
