
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Navigation, MapPin, Filter, X } from 'lucide-react';

interface HospitalSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onCurrentLocation: () => void;
  loading: boolean;
  resultsCount: number;
}

const HospitalSearch: React.FC<HospitalSearchProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  onCurrentLocation,
  loading,
  resultsCount
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filterOptions = [
    'Emergency Services',
    'Specialty Care',
    'Pediatric',
    'Cardiac Care',
    'Maternity',
    'Mental Health',
    'Rehabilitation',
    'Urgent Care'
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const clearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        {/* Main Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              ref={inputRef}
              placeholder="Search by location, hospital name, or specialty..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-10 h-12 text-base border-gray-200 focus:border-red-500 focus:ring-red-500"
            />
            {searchQuery && (
              <Button
                onClick={clearSearch}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Button 
            onClick={onSearch} 
            disabled={loading}
            className="h-12 px-6 bg-red-600 hover:bg-red-700 text-white"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
          
          <Button 
            onClick={onCurrentLocation} 
            variant="outline" 
            disabled={loading}
            className="h-12 px-6 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
          >
            <Navigation className="h-5 w-5 mr-2" />
            My Location
          </Button>
        </div>

        {/* Filter Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {selectedFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedFilters.length}
                </Badge>
              )}
            </Button>
            
            {selectedFilters.length > 0 && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <Badge
                  key={filter}
                  variant={selectedFilters.includes(filter) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedFilters.includes(filter)
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          )}

          {/* Active Filters Display */}
          {selectedFilters.length > 0 && !showFilters && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 py-1">Active filters:</span>
              {selectedFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="default"
                  className="bg-red-600 text-white cursor-pointer hover:bg-red-700"
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Results Summary */}
        {resultsCount > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  Found <strong>{resultsCount}</strong> hospital{resultsCount !== 1 ? 's' : ''} nearby
                </span>
              </div>
              <div className="text-xs">
                Results sorted by distance
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HospitalSearch;
