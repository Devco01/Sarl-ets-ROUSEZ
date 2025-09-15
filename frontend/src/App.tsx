import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Zone from './components/Zone';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { initScrollAnimations, initMobileScrollEffects, initMobileButtonEffects } from './utils/animations';

function App() {
  useEffect(() => {
    const observer = initScrollAnimations();
    const mobileEffectsCleanup = initMobileScrollEffects();
    initMobileButtonEffects();
    
    return () => {
      observer.disconnect();
      if (mobileEffectsCleanup) {
        mobileEffectsCleanup();
      }
    };
  }, []);

  return (
    <div className="App">
      <Header />
      <Hero />
      
      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Nos Services</h2>
            <p className="section-subtitle">
              Des solutions complètes pour tous vos besoins en chauffage, climatisation, plomberie et sanitaire
            </p>
          </div>
          
          <div className="services-grid">
            <div className="service-card animate-on-scroll" style={{"--animation-order": 0} as React.CSSProperties}>
              <div className="service-icon">
                <i className="fas fa-fire-alt"></i>
              </div>
              <h3 className="service-title">Chauffage</h3>
              <p className="service-description">
                Installation, maintenance et réparation de systèmes de chauffage. 
                Chaudières, radiateurs, planchers chauffants.
              </p>
              <ul className="service-features">
                <li>Installation de chaudières</li>
                <li>Maintenance préventive</li>
                <li>Dépannages rapides</li>
                <li>Planchers chauffants</li>
              </ul>
            </div>
            
            <div className="service-card animate-on-scroll" style={{"--animation-order": 1} as React.CSSProperties}>
              <div className="service-icon">
                <i className="fas fa-snowflake"></i>
              </div>
              <h3 className="service-title">Climatisation</h3>
              <p className="service-description">
                Solutions de climatisation adaptées à vos espaces. 
                Installation et entretien de systèmes performants.
              </p>
              <ul className="service-features">
                <li>Climatisation réversible</li>
                <li>Systèmes multi-split</li>
                <li>Entretien annuel</li>
                <li>Pompes à chaleur</li>
              </ul>
            </div>
            
            <div className="service-card animate-on-scroll" style={{"--animation-order": 2} as React.CSSProperties}>
              <div className="service-icon">
                <i className="fas fa-wrench"></i>
              </div>
              <h3 className="service-title">Plomberie</h3>
              <p className="service-description">
                Travaux de plomberie générale, installation et réparation. 
                Intervention rapide pour tous vos problèmes.
              </p>
              <ul className="service-features">
                <li>Réparations et dépannages</li>
                <li>Installation sanitaire</li>
                <li>Canalisations</li>
                <li>Détection de fuites</li>
              </ul>
            </div>
            
            <div className="service-card animate-on-scroll" style={{"--animation-order": 3} as React.CSSProperties}>
              <div className="service-icon">
                <i className="fas fa-shower"></i>
              </div>
              <h3 className="service-title">Sanitaire</h3>
              <p className="service-description">
                Aménagement de salles de bains, installation d'équipements sanitaires. 
                Rénovation complète ou partielle.
              </p>
              <ul className="service-features">
                <li>Salles de bains clés en main</li>
                <li>Équipements modernes</li>
                <li>Accessibilité PMR</li>
                <li>Design personnalisé</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

            <About />
            <Zone />
            <Gallery />
            <Contact />
            <Footer />
    </div>
  );
}

export default App;
