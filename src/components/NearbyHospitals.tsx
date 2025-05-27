
import React, { useState, useEffect } from 'react';
import { useLocationManager } from '@/hooks/useLocationManager';
import { useHospitalSearch } from '@/hooks/useHospitalSearch';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchTriggered, setSearchTriggered] = useState(false);
  
  const { userLocation, setUserLocation, getCurrentLocation, loading: locationLoading } = useLocationManager();
  const { hospitals, loading: searchLoading, searchNearbyHospitals, searchByAddress } = useHospitalSearch();

  const loading = locationLoading || searchLoading;

  // Handle search with geocoding or current location
  const handleSearch = () => {
    setSearchTriggered(true);
    if (searchQuery.trim()) {
      console.log('Searching by address:', searchQuery);
      searchByAddress(searchQuery, (location) => {
        setUserLocation(location);
        searchNearbyHospitals(location, 'hospital');
      });
    } else if (userLocation) {
      console.log('Searching with current location:', userLocation);
      searchNearbyHospitals(userLocation);
    } else {
      console.log('Getting current location for search');
      getCurrentLocation();
    }
  };

  // Handle current location button
  const handleCurrentLocation = () => {
    setSearchTriggered(true);
    setSearchQuery(''); // Clear search query when using current location
    getCurrentLocation();
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

  // Search hospitals when location is obtained and search was triggered
  useEffect(() => {
    if (userLocation && searchTriggered) {
      console.log('Location obtained, searching for hospitals:', userLocation);
      searchNearbyHospitals(userLocation);
      setSearchTriggered(false);
    }
  }, [userLocation, searchTriggered]);

  // Auto-initialize with user location on mount
  useEffect(() => {
    console.log('NearbyHospitals component mounted, getting current location');
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
          onCurrentLocation={handleCurrentLocation}
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
