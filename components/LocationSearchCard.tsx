import React from "react";
import { Search, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LocationSearchCardProps {
  searchQuery: string;
  suggestions: { lat: string; lon: string; display_name: string }[];
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSuggestionClick: (place: {
    lat: string;
    lon: string;
    display_name: string;
  }) => void;
}

const LocationSearchCard: React.FC<LocationSearchCardProps> = ({
  searchQuery,
  suggestions,
  onSearchChange,
  onSearchSubmit,
  onSuggestionClick,
}) => {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-visible">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
  <span className="flex items-center gap-1 px-2 py-1 rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm">
    <Search className="h-4 w-4" />
    Location Search
  </span>
</CardTitle>


      </CardHeader>
      <CardContent>
        <form onSubmit={onSearchSubmit} className="relative z-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a location..."
              className="pl-10 md:pl-12 h-12 md:h-14 text-sm md:text-base border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 rounded-xl"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          {suggestions.length > 0 && (
            <div className="mt-2 bg-white border-2 border-gray-200 border-t-0 rounded-b-xl shadow-xl z-50 animate-fade-in">
              {suggestions.map((place, idx) => (
                <div
                  key={idx}
                  className="p-3 md:p-4 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 hover:scale-[1.02] transition-transform duration-200"
                  onClick={() => onSuggestionClick(place)}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs md:text-sm text-gray-700 line-clamp-2">
                      {place.display_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default LocationSearchCard;
