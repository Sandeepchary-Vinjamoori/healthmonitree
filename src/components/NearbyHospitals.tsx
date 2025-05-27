
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import HospitalSearch from './HospitalSearch';
import HospitalMap from './HospitalMap';
import HospitalList from './HospitalList';

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
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const { toast } = useToast();

  // Get user's current location with high accuracy
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation. Please search manually.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        searchNearbyHospitals(location);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Unable to get your location. ";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please enable location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }
        
        toast({
          title: "Location Access Error",
          description: errorMessage,
          variant: "destructive",
        });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Calculate distance between two points using Haversine formula
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

  // Search nearby hospitals using enhanced API call
  const searchNearbyHospitals = async (location: { lat: number; lng: number }, keyword: string = '') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nearby-hospitals', {
        body: {
          lat: location.lat,
          lng: location.lng,
          radius: 15000, // 15km radius for better coverage
          keyword: keyword || 'hospital'
        }
      });

      if (error) throw error;

      // Enhanced hospital data processing with distance calculation
      const hospitalsWithDistance = data.hospitals
        .map((hospital: Hospital) => ({
          ...hospital,
          distance: calculateDistance(
            location.lat,
            location.lng,
            hospital.location.lat,
            hospital.location.lng
          )
        }))
        .sort((a: Hospital, b: Hospital) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 20); // Limit to top 20 results

      setHospitals(hospitalsWithDistance);
      
      if (hospitalsWithDistance.length === 0) {
        toast({
          title: "No Hospitals Found",
          description: "No hospitals found in your area. Try expanding your search or check your location.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast({
        title: "Search Error",
        description: "Failed to fetch nearby hospitals. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search with geocoding
  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (window.google) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: searchQuery }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            };
            setUserLocation(location);
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

  // Handle hospital selection
  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  // Refresh search
  const handleRefresh = () => {
    if (userLocation) {
      searchNearbyHospitals(userLocation);
    } else {
      getCurrentLocation();
    }
  };

  // Initialize with user location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
      {/* Enhanced Search Interface */}
      <div className="p-6 bg-white border-b shadow-sm">
        <HospitalSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          onCurrentLocation={getCurrentLocation}
          loading={loading}
          resultsCount={hospitals.length}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Map Section */}
        <div className="lg:w-1/2 h-64 lg:h-auto">
          <HospitalMap
            hospitals={hospitals}
            userLocation={userLocation}
            onHospitalSelect={handleHospitalSelect}
            loading={loading}
          />
        </div>

        {/* Hospital List Section */}
        <div className="lg:w-1/2 h-96 lg:h-auto overflow-y-auto bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Nearby Hospitals ({hospitals.length})
            </h3>
          </div>

          <HospitalList
            hospitals={hospitals}
            loading={loading}
            onRefresh={handleRefresh}
            onHospitalSelect={handleHospitalSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default NearbyHospitals;
