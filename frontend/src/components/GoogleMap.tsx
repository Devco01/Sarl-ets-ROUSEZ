import React, { useEffect, useRef, useState } from 'react';
import './GoogleMap.css';

interface GoogleMapProps {
  address?: string;
  zoom?: number;
  height?: string;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  address = "4 Zac des Bregaudieres, 17390 La Tremblade, France",
  zoom = 15,
  height = "400px",
  className = ""
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');

  // Coordonnées approximatives de La Tremblade
  const defaultCoords = {
    lat: 45.7667,
    lng: -1.1333
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      // Créer la carte
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: zoom,
        center: defaultCoords,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [{"weight": "2.00"}]
          },
          {
            "featureType": "all",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#9c9c9c"}]
          },
          {
            "featureType": "all",
            "elementType": "labels.text",
            "stylers": [{"visibility": "on"}]
          },
          {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{"color": "#f2f2f2"}]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#ffffff"}]
          },
          {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#ffffff"}]
          },
          {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
          },
          {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{"saturation": -100}, {"lightness": 45}]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#eeeeee"}]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#7b7b7b"}]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#ffffff"}]
          },
          {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{"visibility": "simplified"}]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "off"}]
          },
          {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#c8d7d4"}]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#070707"}]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#ffffff"}]
          }
        ]
      });

      // Créer le service de géocodage
      const geocoder = new window.google.maps.Geocoder();

      // Géocoder l'adresse
      geocoder.geocode({ address: address }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          
          // Centrer la carte sur l'adresse trouvée
          map.setCenter(location);

          // Créer un marqueur personnalisé
          const marker = new window.google.maps.Marker({
            position: location,
            map: map,
            title: 'Ets ROUSEZ - SARL Jérémie Arrivé',
            animation: window.google.maps.Animation.DROP,
            icon: {
              url: 'data:image/svg+xml;base64,' + btoa(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#e74c3c" stroke="#fff" stroke-width="2"/>
                  <circle cx="20" cy="20" r="8" fill="#fff"/>
                  <text x="20" y="25" text-anchor="middle" fill="#e74c3c" font-size="12" font-weight="bold">📍</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(20, 40)
            }
          });

          // InfoWindow avec les détails de l'entreprise
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px;">
                  Ets ROUSEZ - SARL Jérémie Arrivé
                </h3>
                <p style="margin: 0 0 8px 0; color: #7f8c8d; font-size: 14px;">
                  ${address}
                </p>
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                  <a href="tel:0546368283" style="background: #e74c3c; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 12px;">
                    📞 Appeler
                  </a>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}" target="_blank" style="background: #3498db; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 12px;">
                    🗺️ Itinéraire
                  </a>
                </div>
              </div>
            `
          });

          // Ouvrir l'InfoWindow au clic sur le marqueur
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          setIsLoaded(true);
        } else {
          console.warn('Géocodage échoué:', status);
          setError('Impossible de localiser l\'adresse sur la carte');
          
          // Fallback: créer quand même une carte centrée sur La Tremblade
          const fallbackMarker = new window.google.maps.Marker({
            position: defaultCoords,
            map: map,
            title: 'Ets ROUSEZ - SARL Jérémie Arrivé'
          });
          
          setIsLoaded(true);
        }
      });

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la carte:', err);
      setError('Erreur lors du chargement de la carte');
    }
  };

  useEffect(() => {
    // Vérifier si Google Maps est déjà chargé
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Attendre que le script soit chargé
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          initializeMap();
        }
      }, 100);

      // Nettoyer l'interval après 10 secondes
      setTimeout(() => {
        clearInterval(checkGoogleMaps);
        if (!isLoaded) {
          setError('Timeout: Google Maps n\'a pas pu être chargé');
        }
      }, 10000);
    }
  }, []);

  if (error) {
    return (
      <div className={`google-map-error ${className}`} style={{ height }}>
        <div className="error-content">
          <div className="error-icon">🗺️</div>
          <h3>Carte temporairement indisponible</h3>
          <p>{error}</p>
          <div className="fallback-info">
            <p><strong>Notre adresse :</strong></p>
            <p>{address}</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Voir sur Google Maps
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`google-map-container ${className}`}>
      <div 
        ref={mapRef} 
        className="google-map"
        style={{ height, width: '100%' }}
      />
      {!isLoaded && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Chargement de la carte...</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
