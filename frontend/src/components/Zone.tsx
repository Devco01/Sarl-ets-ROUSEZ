import React from 'react';
import './Zone.css';

const Zone: React.FC = () => {
  return (
    <section id="zone-intervention" className="zone-intervention">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Notre Zone d'Intervention</h2>
          <p className="section-subtitle">
            Ets ROUSEZ intervient dans toute la région de La Tremblade et ses communes environnantes
          </p>
        </div>
        
        <div className="zone-content">
          <div className="zone-text animate-on-scroll">
            <h3>Chauffage, Climatisation, Plomberie et Sanitaire en Charente-Maritime</h3>
            <p>
              <strong>SARL Jérémie Arrivé - Ets ROUSEZ</strong> est votre spécialiste local en chauffage, climatisation, 
              plomberie et sanitaire. Basée à <strong>La Tremblade (17390)</strong>, notre entreprise intervient 
              rapidement dans la région pour tous vos besoins.
            </p>
            
            <div className="zone-services">
              <div className="service-zone">
                <h4><i className="fas fa-fire-alt"></i> Installation et maintenance de chauffage</h4>
                <p>Chaudières, radiateurs, planchers chauffants dans la région</p>
              </div>
              
              <div className="service-zone">
                <h4><i className="fas fa-snowflake"></i> Climatisation et pompes à chaleur</h4>
                <p>Solutions de climatisation réversible et pompes à chaleur performantes</p>
              </div>
              
              <div className="service-zone">
                <h4><i className="fas fa-wrench"></i> Plomberie générale et dépannages</h4>
                <p>Interventions rapides pour tous problèmes de plomberie</p>
              </div>
              
              <div className="service-zone">
                <h4><i className="fas fa-shower"></i> Aménagement sanitaire et salles de bains</h4>
                <p>Rénovation complète de salles de bains et équipements sanitaires</p>
              </div>
            </div>
            
            <div className="zone-contact">
              <p><strong>Besoin d'une intervention ?</strong></p>
              <p>Contactez-nous au <a href="tel:0546368283"><strong>05 46 36 82 83</strong></a> ou par email à 
              <a href="mailto:etsrousez@gmail.com"><strong>etsrousez@gmail.com</strong></a></p>
            </div>
          </div>
          
          <div className="communes-list animate-on-scroll">
            <h3>Communes desservies autour de La Tremblade</h3>
            <div className="communes-grid">
              <div className="commune-group">
                <h4>Presqu'île d'Arvert</h4>
                <ul>
                  <li>La Tremblade</li>
                  <li>Arvert</li>
                  <li>Les Mathes</li>
                  <li>La Palmyre</li>
                  <li>Ronce-les-Bains</li>
                  <li>Étaules</li>
                </ul>
              </div>
              
              <div className="commune-group">
                <h4>Marennes et environs</h4>
                <ul>
                  <li>Marennes</li>
                  <li>Hiers-Brouage</li>
                  <li>Saint-Agnant</li>
                  <li>Moëze</li>
                  <li>Bourcefranc-le-Chapus</li>
                  <li>Saint-Just-Luzac</li>
                </ul>
              </div>
              
              <div className="commune-group">
                <h4>Royan et alentours</h4>
                <ul>
                  <li>Royan</li>
                  <li>Saint-Palais-sur-Mer</li>
                  <li>Vaux-sur-Mer</li>
                  <li>Saint-Georges-de-Didonne</li>
                  <li>Meschers-sur-Gironde</li>
                  <li>Médis</li>
                </ul>
              </div>
              
              <div className="commune-group">
                <h4>Autres secteurs</h4>
                <ul>
                  <li>Saintes</li>
                  <li>Rochefort</li>
                  <li>Saint-Jean-d'Angély</li>
                  <li>Pons</li>
                  <li>Jonzac</li>
                  <li>Et communes environnantes</li>
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Zone;
