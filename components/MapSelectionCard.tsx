import React, { Suspense } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";

interface MapSelectionCardProps {
  selectedLocation: { lat: number; lng: number } | null;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

// Dynamic import of MapClient with SSR disabled
const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
});

const MapSelectionCard: React.FC<MapSelectionCardProps> = ({
  selectedLocation,
  onLocationSelect,
}) => {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
          <MapPin className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
          Select Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-colors duration-300">
          <Suspense
            fallback={
              <div className="h-48 md:h-64 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center animate-pulse">
                  <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm md:text-base">
                    Loading map...
                  </p>
                </div>
              </div>
            }
          >
            <MapClient
              onLocationSelect={onLocationSelect}
              currentLocation={selectedLocation}
            />
          </Suspense>
        </div>
        {selectedLocation && (
          <div className="mt-4 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200 animate-scale-in">
            <p className="text-xs md:text-sm text-blue-800 font-medium">
              📍 Selected: {selectedLocation.lat.toFixed(5)},{" "}
              {selectedLocation.lng.toFixed(5)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapSelectionCard;
