
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance } from '@/utils/distanceCalculator';

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

interface Location {
  lat: number;
  lng: number;
}

export const useHospitalSearch = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchNearbyHospitals = async (location: Location, keyword: string = '') => {
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

  const searchByAddress = (address: string, callback: (location: Location) => void) => {
    if (window.google) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          callback(location);
        } else {
          toast({
            title: "Location Not Found",
            description: "Could not find the specified location. Please try a different search term.",
            variant: "destructive",
          });
        }
      });
    }
  };

  return {
    hospitals,
    loading,
    searchNearbyHospitals,
    searchByAddress
  };
};
