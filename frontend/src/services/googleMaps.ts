// Google Maps API Service
export interface GoogleMapsConfig {
  apiKey: string;
  libraries: string[];
  region?: string;
  language?: string;
}

export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  /**
   * Charge le script Google Maps API
   */
  public async loadGoogleMaps(config: GoogleMapsConfig): Promise<void> {
    // Si déjà chargé, retourner immédiatement
    if (this.isLoaded && window.google && window.google.maps) {
      return Promise.resolve();
    }

    // Si en cours de chargement, retourner la promesse existante
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    // Marquer comme en cours de chargement
    this.isLoading = true;

    this.loadPromise = new Promise((resolve, reject) => {
      try {
        // Vérifier si le script existe déjà
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          // Script déjà présent, attendre qu'il soit chargé
          const checkGoogleMaps = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(checkGoogleMaps);
              this.isLoaded = true;
              this.isLoading = false;
              resolve();
            }
          }, 100);

          // Timeout après 10 secondes
          setTimeout(() => {
            clearInterval(checkGoogleMaps);
            if (!this.isLoaded) {
              this.isLoading = false;
              reject(new Error('Timeout lors du chargement de Google Maps'));
            }
          }, 10000);
          return;
        }

        // Créer le script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;

        // Construire l'URL avec les paramètres
        const params = new URLSearchParams({
          key: config.apiKey,
          libraries: config.libraries.join(','),
          callback: 'initGoogleMaps'
        });

        if (config.region) {
          params.append('region', config.region);
        }

        if (config.language) {
          params.append('language', config.language);
        }

        script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;

        // Callback global pour l'initialisation
        (window as any).initGoogleMaps = () => {
          this.isLoaded = true;
          this.isLoading = false;
          resolve();
        };

        // Gérer les erreurs de chargement
        script.onerror = () => {
          this.isLoading = false;
          reject(new Error('Erreur lors du chargement du script Google Maps'));
        };

        // Ajouter le script au document
        document.head.appendChild(script);

      } catch (error) {
        this.isLoading = false;
        reject(error);
      }
    });

    return this.loadPromise;
  }

  /**
   * Vérifie si Google Maps est disponible
   */
  public isGoogleMapsLoaded(): boolean {
    return this.isLoaded && window.google && window.google.maps;
  }

  /**
   * Géocode une adresse
   */
  public async geocodeAddress(address: string): Promise<any[]> {
    if (!this.isGoogleMapsLoaded()) {
      throw new Error('Google Maps n\'est pas chargé');
    }

    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results) {
          resolve(results);
        } else {
          reject(new Error(`Erreur de géocodage: ${status}`));
        }
      });
    });
  }

  /**
   * Calcule un itinéraire
   */
  public async calculateRoute(
    origin: string | any,
    destination: string | any,
    travelMode: string = 'DRIVING'
  ): Promise<any> {
    if (!this.isGoogleMapsLoaded()) {
      throw new Error('Google Maps n\'est pas chargé');
    }

    return new Promise((resolve, reject) => {
      const directionsService = new window.google.maps.DirectionsService();
      
      directionsService.route({
        origin,
        destination,
        travelMode
      }, (result: any, status: any) => {
        if (status === 'OK' && result) {
          resolve(result);
        } else {
          reject(new Error(`Erreur de calcul d'itinéraire: ${status}`));
        }
      });
    });
  }

  /**
   * Nettoie le service (supprime le script et reset l'état)
   */
  public cleanup(): void {
    const script = document.querySelector('script[src*="maps.googleapis.com"]');
    if (script) {
      script.remove();
    }

    // Nettoyer les références globales
    if ((window as any).initGoogleMaps) {
      delete (window as any).initGoogleMaps;
    }

    if ((window as any).google) {
      delete (window as any).google;
    }

    this.isLoaded = false;
    this.isLoading = false;
    this.loadPromise = null;
  }
}

// Configuration par défaut
export const DEFAULT_GOOGLE_MAPS_CONFIG: GoogleMapsConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  libraries: ['geometry', 'places'],
  region: 'FR',
  language: 'fr'
};

// Instance singleton
export const googleMapsService = GoogleMapsService.getInstance();
