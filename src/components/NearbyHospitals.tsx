
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Phone, Star, Navigation, RefreshCw, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

interface NearbyHospitalsProps {
  className?: string;
}

const NearbyHospitals: React.FC<NearbyHospitalsProps> = ({ className }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && mapRef.current) {
        const mapInstance = new google.maps.Map(mapRef.current, {
          zoom: 13,
          center: userLocation || { lat: 40.7128, lng: -74.0060 }, // Default to NYC
          styles: [
            {
              featureType: 'poi.medical',
              elementType: 'geometry',
              stylers: [{ color: '#ffeaa7' }]
            }
          ]
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
  }, [userLocation]);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          if (map) {
            map.setCenter(location);
          }
          searchNearbyHospitals(location);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Access Denied",
            description: "Please enable location access or search manually.",
            variant: "destructive",
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation. Please search manually.",
        variant: "destructive",
      });
    }
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Search nearby hospitals
  const searchNearbyHospitals = async (location: { lat: number; lng: number }, keyword: string = 'hospital') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nearby-hospitals', {
        body: {
          lat: location.lat,
          lng: location.lng,
          radius: 10000, // 10km radius
          keyword
        }
      });

      if (error) throw error;

      const hospitalsWithDistance = data.hospitals.map((hospital: Hospital) => ({
        ...hospital,
        distance: calculateDistance(
          location.lat,
          location.lng,
          hospital.location.lat,
          hospital.location.lng
        )
      })).sort((a: Hospital, b: Hospital) => (a.distance || 0) - (b.distance || 0));

      setHospitals(hospitalsWithDistance);
      updateMapMarkers(hospitalsWithDistance);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby hospitals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update map markers
  const updateMapMarkers = (hospitalList: Hospital[]) => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = hospitalList.map(hospital => {
      const marker = new google.maps.Marker({
        position: hospital.location,
        map,
        title: hospital.name,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#dc2626"/>
              <path d="M12 6v6m-3-3h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(30, 30)
        }
      });

      // Add click listener to show hospital info
      marker.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${hospital.name}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${hospital.address}</p>
              ${hospital.rating ? `<p style="margin: 0; font-size: 12px;">⭐ ${hospital.rating} (${hospital.user_ratings_total || 0} reviews)</p>` : ''}
              ${hospital.distance ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #059669;">${hospital.distance.toFixed(1)} km away</p>` : ''}
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
    }
  };

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Try to geocode the search query
      if (window.google) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: searchQuery }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            };
            setUserLocation(location);
            if (map) {
              map.setCenter(location);
            }
            searchNearbyHospitals(location, 'hospital');
          } else {
            toast({
              title: "Location Not Found",
              description: "Could not find the specified location. Please try a different search term.",
              variant: "destructive",
            });
          }
        });
      }
    } else if (userLocation) {
      searchNearbyHospitals(userLocation);
    } else {
      getCurrentLocation();
    }
  };

  // Handle phone call
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  // Handle directions
  const handleDirections = (hospital: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Search Bar */}
      <div className="p-4 border-b bg-white">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by location or hospital name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4" />
          </Button>
          <Button onClick={getCurrentLocation} variant="outline" disabled={loading}>
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1 min-h-[300px]">
        <div ref={mapRef} className="absolute inset-0" />
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading hospitals...</span>
            </div>
          </div>
        )}
      </div>

      {/* Hospital List */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Nearby Hospitals ({hospitals.length})</h3>
          <Button 
            onClick={() => userLocation && searchNearbyHospitals(userLocation)} 
            variant="outline" 
            size="sm"
            disabled={loading || !userLocation}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : hospitals.length > 0 ? (
          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{hospital.name}</h4>
                      <p className="text-gray-600 text-sm mb-2 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {hospital.formatted_address}
                      </p>
                    </div>
                    {hospital.photos && hospital.photos.length > 0 && (
                      <img 
                        src={hospital.photos[0]} 
                        alt={hospital.name}
                        className="w-16 h-16 rounded-lg object-cover ml-2"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-sm">
                    {hospital.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{hospital.rating}</span>
                        {hospital.user_ratings_total && (
                          <span className="text-gray-500 ml-1">({hospital.user_ratings_total})</span>
                        )}
                      </div>
                    )}
                    {hospital.distance && (
                      <span className="text-green-600 font-medium">
                        {hospital.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {hospital.phone && (
                      <Button 
                        onClick={() => handleCall(hospital.phone!)}
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleDirections(hospital)}
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">No hospitals found</h4>
              <p className="text-gray-600 mb-4">
                Try adjusting your search location or allow location access to find nearby hospitals.
              </p>
              <Button onClick={getCurrentLocation}>
                <Navigation className="h-4 w-4 mr-2" />
                Use My Location
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NearbyHospitals;
