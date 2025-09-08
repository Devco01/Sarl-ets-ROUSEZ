import React, { useEffect, useState } from 'react';
import GoogleMap from './GoogleMap';
import { googleMapsService, DEFAULT_GOOGLE_MAPS_CONFIG } from '../services/googleMaps';
import './GoogleMap.css';

interface MapSectionProps {
  className?: string;
}

const MapSection: React.FC<MapSectionProps> = ({ className = '' }) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState<string>('');

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Vérifier si l'API key est configurée
        if (!DEFAULT_GOOGLE_MAPS_CONFIG.apiKey) {
          console.warn('Clé API Google Maps non configurée');
          setMapError('Clé API Google Maps non configurée');
          return;
        }

        // Charger Google Maps
        await googleMapsService.loadGoogleMaps(DEFAULT_GOOGLE_MAPS_CONFIG);
        setIsMapReady(true);
      } catch (error) {
        console.error('Erreur lors du chargement de Google Maps:', error);
        setMapError('Erreur lors du chargement de Google Maps');
      }
    };

    loadGoogleMaps();
  }, []);

  const companyInfo = {
    name: 'Ets ROUSEZ - SARL Jérémie Arrivé',
    address: '4 Zac des Bregaudieres, 17390 La Tremblade',
    phone: '05 46 36 82 83',
    email: 'etsrousez@gmail.com',
    hours: 'Lun-Mar, Jeu-Ven: 9h-12h / 14h-16h • Mer: 9h-12h'
  };

  return (
    <div className={`map-section ${className}`}>
      <div className="container">
        <div className="map-header animate-on-scroll">
          <h3>Nous Trouver</h3>
          <p>Situés à La Tremblade, nous intervenons dans toute la Charente-Maritime</p>
        </div>

        <div className="map-content">
          <div className="map-info animate-on-scroll">
            <div className="map-info-item">
              <div className="map-info-icon">📍</div>
              <div className="map-info-content">
                <h4>Notre Adresse</h4>
                <p>
                  {companyInfo.address}<br />
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyInfo.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir sur Google Maps
                  </a>
                </p>
              </div>
            </div>

            <div className="map-info-item">
              <div className="map-info-icon">🚗</div>
              <div className="map-info-content">
                <h4>Accès & Parking</h4>
                <p>
                  Parking gratuit disponible<br />
                  Accès facile depuis la D728
                </p>
              </div>
            </div>

            <div className="map-info-item">
              <div className="map-info-icon">📞</div>
              <div className="map-info-content">
                <h4>Contact Direct</h4>
                <p>
                  <a href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}>
                    {companyInfo.phone}
                  </a><br />
                  <a href={`mailto:${companyInfo.email}`}>
                    {companyInfo.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="map-info-item">
              <div className="map-info-icon">🕒</div>
              <div className="map-info-content">
                <h4>Horaires d'Ouverture</h4>
                <p>{companyInfo.hours}</p>
              </div>
            </div>
          </div>

          <div className="map-container animate-on-scroll">
            {mapError ? (
              <div className="map-placeholder" style={{ height: '400px' }}>
                <div className="map-placeholder-content">
                  <div className="map-placeholder-icon">🗺️</div>
                  <h4>Carte temporairement indisponible</h4>
                  <p>
                    Utilisez l'adresse ci-contre pour nous localiser<br />
                    ou cliquez sur "Voir sur Google Maps"
                  </p>
                </div>
              </div>
            ) : (
              <GoogleMap
                address={companyInfo.address}
                zoom={15}
                height="400px"
                className="company-map"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
