
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useGoogleMapsKey } from '@/hooks/useGoogleMapsKey';
import { MapPin, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Hospital {
  id: string;
  name: string;
  address: string;
  formatted_address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  user_ratings_total?: number;
  phone?: string;
  website?: string;
  opening_hours?: any;
  photos: string[];
  distance?: number;
}

interface HospitalMapProps {
  hospitals: Hospital[];
  userLocation: { lat: number; lng: number } | null;
  onHospitalSelect: (hospital: Hospital) => void;
  loading: boolean;
}

const HospitalMap: React.FC<HospitalMapProps> = ({ 
  hospitals, 
  userLocation, 
  onHospitalSelect,
  loading 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [initRetries, setInitRetries] = useState(0);
  const { toast } = useToast();
  
  const { apiKey, loading: keyLoading, error: keyError } = useGoogleMapsKey();

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  // Check if Google Maps API is fully ready
  const isGoogleMapsReady = () => {
    return window.google && 
           window.google.maps && 
           window.google.maps.Map && 
           typeof window.google.maps.Map === 'function' &&
           window.google.maps.Marker &&
           window.google.maps.InfoWindow;
  };

  // Validate API key format
  const isValidApiKey = (key: string) => {
    return key && key.length > 20 && key.startsWith('AIzaSy');
  };

  // Load Google Maps script with API key
  useEffect(() => {
    if (!apiKey || scriptLoaded) return;

    if (!isValidApiKey(apiKey)) {
      setMapError('Invalid Google Maps API key format. Please check your API key configuration.');
      return;
    }

    const loadGoogleMaps = () => {
      console.log('Loading Google Maps script with API key');
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.remove();
        console.log('Removed existing Google Maps script');
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      // Add global callback function
      window.initGoogleMaps = () => {
        console.log('Google Maps script loaded successfully via callback');
        setScriptLoaded(true);
        
        // Wait a bit for the API to be fully ready before initializing
        setTimeout(() => {
          if (isGoogleMapsReady()) {
            console.log('Google Maps API is ready, initializing map');
            initializeMap();
          } else {
            console.log('Google Maps API not ready yet, retrying...');
            retryInitialization();
          }
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Google Maps script:', error);
        setMapError('Failed to load Google Maps. Please check your internet connection and API key configuration.');
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    // Cleanup function
    return () => {
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
    };
  }, [apiKey]);

  const retryInitialization = () => {
    if (initRetries < MAX_RETRIES) {
      console.log(`Retrying map initialization (attempt ${initRetries + 1}/${MAX_RETRIES})`);
      setInitRetries(prev => prev + 1);
      
      setTimeout(() => {
        if (isGoogleMapsReady()) {
          initializeMap();
        } else {
          retryInitialization();
        }
      }, RETRY_DELAY);
    } else {
      console.error('Max retries reached for map initialization');
      setMapError('Failed to initialize Google Maps after multiple attempts. Please check your API key permissions and try refreshing the page.');
    }
  };

  const initializeMap = () => {
    if (!isGoogleMapsReady() || !mapRef.current) {
      console.log('Google Maps not ready or map container not available');
      return;
    }

    try {
      console.log('Initializing Google Maps with location:', userLocation);
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: userLocation || { lat: 40.7128, lng: -74.0060 },
        styles: [
          {
            featureType: 'poi.medical',
            elementType: 'geometry',
            stylers: [{ color: '#ffeaa7' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#f8f9fa' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
      });
      
      setMap(mapInstance);
      setMapsLoaded(true);
      setMapError(null);
      setInitRetries(0);
      console.log('Google Maps initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      
      // Provide specific error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('InvalidKeyMapError') || error.message.includes('ApiNotActivatedMapError')) {
          setMapError('Google Maps API key error. Please ensure your API key is valid and has Maps JavaScript API enabled in Google Cloud Console.');
        } else if (error.message.includes('RefererNotAllowedMapError')) {
          setMapError('Domain not authorized for this API key. Please add your domain to the API key restrictions in Google Cloud Console.');
        } else if (error.message.includes('QuotaExceededError')) {
          setMapError('Google Maps API quota exceeded. Please check your billing and usage limits in Google Cloud Console.');
        } else {
          setMapError(`Failed to initialize Google Maps: ${error.message}`);
        }
      } else {
        setMapError('Failed to initialize Google Maps. Please check your API key configuration and ensure billing is enabled.');
      }
    }
  };

  // Update map center when user location changes
  useEffect(() => {
    if (map && userLocation && mapsLoaded) {
      try {
        map.setCenter(userLocation);
        
        // Add or update user location marker
        if (userMarker) {
          userMarker.setMap(null);
        }
        
        const newUserMarker = new google.maps.Marker({
          position: userLocation,
          map,
          title: 'Your Location',
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#2563eb" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24)
          }
        });
        
        setUserMarker(newUserMarker);
      } catch (error) {
        console.error('Error updating user location marker:', error);
      }
    }
  }, [map, userLocation, mapsLoaded]);

  // Update hospital markers
  useEffect(() => {
    if (!map || !mapsLoaded) return;

    try {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));

      // Create new markers for hospitals
      const newMarkers = hospitals.map(hospital => {
        const marker = new google.maps.Marker({
          position: hospital.location,
          map,
          title: hospital.name,
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#dc2626"/>
                <path d="M12 6v6m-3-3h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32)
          }
        });

        // Add click listener
        marker.addListener('click', () => {
          onHospitalSelect(hospital);
          
          // Create detailed info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; max-width: 250px; font-family: system-ui;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${hospital.name}</h3>
                <p style="margin: 0 0 6px 0; font-size: 14px; color: #6b7280;">${hospital.formatted_address}</p>
                ${hospital.rating ? `
                  <div style="margin: 6px 0; font-size: 14px;">
                    <span style="color: #f59e0b;">⭐ ${hospital.rating}</span>
                    ${hospital.user_ratings_total ? `<span style="color: #9ca3af;"> (${hospital.user_ratings_total} reviews)</span>` : ''}
                  </div>
                ` : ''}
                ${hospital.distance ? `
                  <p style="margin: 6px 0 0 0; font-size: 14px; color: #059669; font-weight: 500;">
                    📍 ${hospital.distance.toFixed(1)} km away
                  </p>
                ` : ''}
                ${hospital.phone ? `
                  <div style="margin-top: 8px;">
                    <a href="tel:${hospital.phone}" style="color: #2563eb; text-decoration: none; font-size: 14px;">
                      📞 ${hospital.phone}
                    </a>
                  </div>
                ` : ''}
              </div>
            `
          });
          infoWindow.open(map, marker);
        });

        return marker;
      });

      setMarkers(newMarkers);

      // Fit map to show all markers
      if (newMarkers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        newMarkers.forEach(marker => bounds.extend(marker.getPosition()!));
        if (userLocation) {
          bounds.extend(new google.maps.LatLng(userLocation.lat, userLocation.lng));
        }
        map.fitBounds(bounds);
        
        // Ensure minimum zoom level
        const listener = google.maps.event.addListener(map, "idle", function() {
          if (map.getZoom()! > 15) map.setZoom(15);
          google.maps.event.removeListener(listener);
        });
      }
    } catch (error) {
      console.error('Error updating hospital markers:', error);
      setMapError('Error displaying hospital markers on the map.');
    }
  }, [map, hospitals, onHospitalSelect, userLocation, mapsLoaded]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (map) {
        // Clear all markers
        markers.forEach(marker => marker.setMap(null));
        if (userMarker) {
          userMarker.setMap(null);
        }
      }
    };
  }, []);

  const handleRetry = () => {
    setMapError(null);
    setScriptLoaded(false);
    setMapsLoaded(false);
    setInitRetries(0);
    window.location.reload();
  };

  if (loading || keyLoading) {
    return (
      <div className="relative h-full min-h-[400px] bg-gray-100 rounded-lg">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">
            {keyLoading ? 'Loading map configuration...' : 'Loading interactive map...'}
          </p>
        </div>
      </div>
    );
  }

  if (keyError || mapError) {
    return (
      <Card className="h-full min-h-[400px] flex items-center justify-center">
        <CardContent className="text-center p-8">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map Configuration Error</h3>
          <p className="text-gray-600 mb-4">{keyError || mapError}</p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Please ensure your Google Maps API key is properly configured with:
            </p>
            <ul className="text-sm text-gray-500 text-left space-y-1">
              <li>• Maps JavaScript API enabled</li>
              <li>• Places API enabled</li>
              <li>• Geocoding API enabled</li>
              <li>• Billing enabled for your Google Cloud project</li>
              <li>• Domain restrictions properly configured (if any)</li>
            </ul>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden border">
      <div ref={mapRef} className="absolute inset-0" />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{hospitals.length} hospitals found</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Hospitals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extend Window interface for the callback
declare global {
  interface Window {
    initGoogleMaps: () => void;
  }
}

export default HospitalMap;
