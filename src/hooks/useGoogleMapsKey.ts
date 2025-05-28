
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGoogleMapsKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-google-maps-key');
        
        if (error) {
          console.error('Error fetching Google Maps API key:', error);
          setError('Failed to retrieve Google Maps API key');
        } else if (data?.apiKey) {
          setApiKey(data.apiKey);
        } else {
          setError('Google Maps API key not configured');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch API key');
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  return { apiKey, loading, error };
};
