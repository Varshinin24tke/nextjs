"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Custom blue icon
const BlueIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = BlueIcon;

// 👇 This helper component will fly the map to new location on update
const FlyToLocation = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, { duration: 1.5 }); // Fly smoothly to the new location
    }
  }, [lat, lng, map]);

  return null;
};

// Allows clicking on the map to select location
const LocationMarker = ({
  onClick,
}: {
  onClick: (loc: { lat: number; lng: number }) => void;
}) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

// Main Component
const MapClient = ({
  currentLocation,
  onLocationSelect,
}: {
  currentLocation: { lat: number; lng: number } | null;
  onLocationSelect: (loc: { lat: number; lng: number }) => void;
}) => {
  const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore
  const position = currentLocation || defaultCenter;

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden">
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 👇 Fly to location if set */}
        {currentLocation && (
          <>
            <FlyToLocation lat={currentLocation.lat} lng={currentLocation.lng} />
            <Marker position={currentLocation}>
              <Popup>
                Selected Location <br />
                {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </Popup>
            </Marker>
          </>
        )}

        {/* Allow user to click and select a location */}
        <LocationMarker onClick={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default MapClient;
