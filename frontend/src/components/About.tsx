import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text animate-on-scroll">
            <h2 className="section-title">À propos d'Ets ROUSEZ</h2>
            <p className="about-description">
              <strong>SARL Jérémie Arrivé</strong> met son expertise au service de vos projets depuis 2012, soit plus de 13 ans d'expérience. 
              Spécialisée dans le chauffage, la climatisation, la plomberie et le sanitaire, notre entreprise 
              vous accompagne dans tous vos travaux de rénovation et d'installation.
            </p>
            
            <div className="about-features">
              <div className="feature animate-on-scroll">
                <i className="fas fa-medal"></i>
                <div>
                  <h4>Expertise Reconnue</h4>
                  <p>Plus de 13 ans d'expérience dans le domaine</p>
                </div>
              </div>
              
              <div className="feature animate-on-scroll">
                <i className="fas fa-tools"></i>
                <div>
                  <h4>Équipements Modernes</h4>
                  <p>Outils et technologies de dernière génération</p>
                </div>
              </div>
              
              <div className="feature animate-on-scroll">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Service Rapide</h4>
                  <p>Interventions et dépannages rapides</p>
                </div>
              </div>
              
              <div className="feature animate-on-scroll">
                <i className="fas fa-certificate"></i>
                <div>
                  <h4>Qualité Garantie</h4>
                  <p>Travaux garantis et certifiés</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-image animate-on-scroll parallax-mobile" data-speed="0.1">
            <img src="/assets/images/img4.jpg" alt="Équipe Ets ROUSEZ" />
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Clients satisfaits</span>
              </div>
              <div className="stat">
                <span className="stat-number">13+</span>
                <span className="stat-label">Années d'expérience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
