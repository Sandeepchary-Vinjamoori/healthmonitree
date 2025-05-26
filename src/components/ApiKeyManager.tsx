
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Key, Save, Eye, EyeOff } from 'lucide-react';

const ApiKeyManager = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkExistingKey();
  }, []);

  const checkExistingKey = async () => {
    try {
      const { data } = await supabase
        .from('api_config')
        .select('api_key')
        .eq('service_name', 'google_maps')
        .single();
      
      if (data?.api_key && data.api_key !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        setHasExistingKey(true);
        setApiKey('••••••••••••••••••••••••••••••••••••••••');
      }
    } catch (error) {
      console.log('No existing API key found');
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('api_config')
        .upsert({
          service_name: 'google_maps',
          api_key: apiKey.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Google Maps API key saved successfully!",
      });
      
      setHasExistingKey(true);
      setApiKey('••••••••••••••••••••••••••••••••••••••••');
      setShowKey(false);
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setApiKey('');
    setShowKey(true);
    setHasExistingKey(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="h-5 w-5 mr-2" />
          Google Maps API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          To use the Nearby Hospitals feature, you need to provide a Google Maps API key with Places API enabled.
        </p>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="Enter your Google Maps API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveApiKey} disabled={loading || !apiKey.trim()}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save API Key'}
            </Button>
            
            {hasExistingKey && (
              <Button variant="outline" onClick={handleEdit}>
                Edit Key
              </Button>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How to get a Google Maps API key:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
            <li>Create a new project or select an existing one</li>
            <li>Enable the "Places API" and "Maps JavaScript API"</li>
            <li>Go to "Credentials" and create an API key</li>
            <li>Restrict the API key to your domain for security</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;
