
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Navigation } from 'lucide-react';

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

  // Initialize Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && mapRef.current) {
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
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = loadGoogleMaps;
      document.head.appendChild(script);
    } else {
      loadGoogleMaps();
    }
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (map && userLocation) {
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
    }
  }, [map, userLocation]);

  // Update hospital markers
  useEffect(() => {
    if (!map) return;

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
  }, [map, hospitals, onHospitalSelect, userLocation]);

  if (loading) {
    return (
      <div className="relative h-full min-h-[400px] bg-gray-100 rounded-lg">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading interactive map...</p>
        </div>
      </div>
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

export default HospitalMap;
