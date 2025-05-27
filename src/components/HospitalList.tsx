
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Phone, Star, Navigation, Globe, Clock } from 'lucide-react';

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

interface HospitalListProps {
  hospitals: Hospital[];
  loading: boolean;
  onRefresh: () => void;
  onHospitalSelect: (hospital: Hospital) => void;
}

const HospitalList: React.FC<HospitalListProps> = ({ 
  hospitals, 
  loading, 
  onRefresh,
  onHospitalSelect 
}) => {
  const handleCall = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`tel:${phone}`);
  };

  const handleDirections = (hospital: Hospital, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`;
    window.open(url, '_blank');
  };

  const handleWebsite = (website: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(website, '_blank');
  };

  const isOpenNow = (openingHours: any): boolean => {
    return openingHours?.open_now || false;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2 text-gray-700">No hospitals found</h4>
          <p className="text-gray-600 mb-4">
            Try adjusting your search location or enable location access to find nearby hospitals.
          </p>
          <Button onClick={onRefresh} variant="outline">
            <Navigation className="h-4 w-4 mr-2" />
            Refresh Search
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {hospitals.map((hospital) => (
        <Card 
          key={hospital.id} 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-red-500"
          onClick={() => onHospitalSelect(hospital)}
        >
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1 text-gray-900 hover:text-red-600 transition-colors">
                  {hospital.name}
                </h4>
                <p className="text-gray-600 text-sm mb-2 flex items-start">
                  <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{hospital.formatted_address}</span>
                </p>
              </div>
              {hospital.photos && hospital.photos.length > 0 && (
                <img 
                  src={hospital.photos[0]} 
                  alt={hospital.name}
                  className="w-20 h-20 rounded-lg object-cover ml-3 shadow-sm"
                />
              )}
            </div>

            {/* Hospital Details */}
            <div className="flex items-center gap-4 mb-4 text-sm flex-wrap">
              {hospital.rating && (
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{hospital.rating}</span>
                  {hospital.user_ratings_total && (
                    <span className="text-gray-500 ml-1">({hospital.user_ratings_total})</span>
                  )}
                </div>
              )}
              
              {hospital.distance && (
                <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                  <Navigation className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-700 font-medium">
                    {hospital.distance.toFixed(1)} km away
                  </span>
                </div>
              )}

              {hospital.opening_hours && (
                <div className={`flex items-center px-2 py-1 rounded-full ${
                  isOpenNow(hospital.opening_hours) 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="font-medium">
                    {isOpenNow(hospital.opening_hours) ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              {hospital.phone && (
                <Button 
                  onClick={(e) => handleCall(hospital.phone!, e)}
                  variant="outline" 
                  size="sm"
                  className="flex-1 min-w-[100px] hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              )}
              
              <Button 
                onClick={(e) => handleDirections(hospital, e)}
                variant="outline" 
                size="sm"
                className="flex-1 min-w-[100px] hover:bg-green-50 hover:text-green-700 hover:border-green-300"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Directions
              </Button>

              {hospital.website && (
                <Button 
                  onClick={(e) => handleWebsite(hospital.website!, e)}
                  variant="outline" 
                  size="sm"
                  className="flex-1 min-w-[100px] hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  Website
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HospitalList;
