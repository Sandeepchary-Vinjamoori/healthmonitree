
import React from 'react';
import NavBar from '@/components/NavBar';
import NearbyHospitals from '@/components/NearbyHospitals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Navigation } from 'lucide-react';

const NearbyHospitalsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-8 w-8 text-red-600 mr-3" />
              Nearby Hospitals
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Find hospitals and medical facilities near you with real-time locations, ratings, and contact information.
            </p>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-600" />
                  Smart Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Search by location, hospital name, or use your current location for instant results.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Interactive Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  View hospital locations on an interactive map with detailed information on click.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Navigation className="h-5 w-5 mr-2 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Call directly or get directions to any hospital with one-tap actions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Interface */}
          <Card className="h-[70vh]">
            <NearbyHospitals className="h-full" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NearbyHospitalsPage;
