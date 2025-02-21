
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, MessageSquare, Bell, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const EmergencyAccess = () => {
  const { toast } = useToast();
  const [mapApiKey, setMapApiKey] = useState('');

  const handleSOS = () => {
    // In a real application, this would trigger emergency services
    toast({
      title: "Emergency Alert Sent",
      description: "Emergency services have been notified of your location.",
    });
  };

  const handleWhatsAppSOS = () => {
    // Add WhatsApp integration here
    window.open(`https://wa.me/911?text=${encodeURIComponent('Emergency: Need immediate assistance')}`);
  };

  const handleSMSAlert = () => {
    // Add SMS integration here
    toast({
      title: "SMS Alert Sent",
      description: "Emergency contacts have been notified via SMS.",
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Emergency Healthcare Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - SOS Emergency Assistance */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleSOS}
                className="w-full h-24 text-2xl font-bold bg-red-600 hover:bg-red-700 animate-pulse"
              >
                SOS EMERGENCY
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleWhatsAppSOS}
                variant="outline"
                className="w-full"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                WhatsApp SOS
              </Button>
              <Button
                onClick={handleSMSAlert}
                variant="outline"
                className="w-full"
              >
                <Bell className="mr-2 h-4 w-4" />
                SMS Alert
              </Button>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Emergency Contacts</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Ambulance
                  </div>
                  <a href="tel:911" className="text-primary hover:underline">911</a>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Mental Health Helpline
                  </div>
                  <a href="tel:988" className="text-primary hover:underline">988</a>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Poison Control
                  </div>
                  <a href="tel:18002221222" className="text-primary hover:underline">1-800-222-1222</a>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Hospital Map */}
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for nearby hospitals..."
                className="w-full pl-10"
              />
              <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <div className="h-[400px] bg-gray-100 rounded-lg relative">
              <div id="map" className="absolute inset-0 rounded-lg" />
              {/* Map will be initialized here */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyAccess;
