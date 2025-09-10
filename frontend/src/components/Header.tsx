import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Déterminer la section active
      const sections = ['home', 'services', 'about', 'gallery', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openLogoModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la navigation vers accueil
    setIsLogoModalOpen(true);
  };

  const closeLogoModal = () => {
    setIsLogoModalOpen(false);
  };

  // Fermer le modal avec la touche Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLogoModal();
      }
    };

    if (isLogoModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Empêcher le scroll en arrière-plan
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isLogoModalOpen]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <img 
            src="/assets/images/Logo.PNG" 
            alt="Ets ROUSEZ - SARL Jérémie Arrivé" 
            className="logo"
            onClick={openLogoModal}
            title="Cliquez pour agrandir le logo"
          />
        </div>
        
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => scrollToSection('home')}
            >
              Accueil
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}
              onClick={() => scrollToSection('services')}
            >
              Services
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => scrollToSection('about')}
            >
              À propos
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeSection === 'gallery' ? 'active' : ''}`}
              onClick={() => scrollToSection('gallery')}
            >
              Réalisations
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
          </li>
        </ul>
        
        <div 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
      
      {/* Modal du logo */}
      {isLogoModalOpen && (
        <div className="logo-modal-overlay" onClick={closeLogoModal}>
          <div className="logo-modal-content" onClick={closeLogoModal}>
            <div className="logo-modal-image">
              <img 
                src="/assets/images/Logo.PNG" 
                alt="Ets ROUSEZ - SARL Jérémie Arrivé - Logo agrandie" 
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
