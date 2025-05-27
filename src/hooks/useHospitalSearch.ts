
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
    console.log('Searching for hospitals:', { location, keyword });
    
    try {
      const { data, error } = await supabase.functions.invoke('nearby-hospitals', {
        body: {
          lat: location.lat,
          lng: location.lng,
          radius: 15000, // 15km radius for better coverage
          keyword: keyword || 'hospital'
        }
      });

      console.log('Hospital search response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to fetch hospitals');
      }

      if (data?.error) {
        console.error('API error:', data.error);
        throw new Error(data.error);
      }

      // Enhanced hospital data processing with distance calculation
      const hospitalsWithDistance = (data?.hospitals || [])
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
          description: "No hospitals found in your area. Try expanding your search radius or adjusting your search terms.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Hospitals Found",
          description: `Found ${hospitalsWithDistance.length} hospital${hospitalsWithDistance.length !== 1 ? 's' : ''} near you.`,
        });
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      
      let errorMessage = "Failed to fetch nearby hospitals. ";
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage += "Google Maps API key configuration issue. Please check your API settings.";
        } else if (error.message.includes('quota') || error.message.includes('OVER_QUERY_LIMIT')) {
          errorMessage += "API quota exceeded. Please try again later.";
        } else if (error.message.includes('REQUEST_DENIED') || error.message.includes('access denied')) {
          errorMessage += "API access denied. Please check that your Google Maps API key has Places API (New) enabled.";
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += "Please check your connection and try again.";
      }
      
      toast({
        title: "Search Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Set empty array on error
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const searchByAddress = (address: string, callback: (location: Location) => void) => {
    if (window.google && window.google.maps) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          callback(location);
          toast({
            title: "Location Found",
            description: `Searching for hospitals near ${results[0].formatted_address}`,
          });
        } else {
          console.error('Geocoding failed:', status);
          toast({
            title: "Location Not Found",
            description: "Could not find the specified location. Please try a different search term.",
            variant: "destructive",
          });
        }
      });
    } else {
      toast({
        title: "Google Maps Not Available",
        description: "Google Maps is not loaded. Please refresh the page and try again.",
        variant: "destructive",
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
