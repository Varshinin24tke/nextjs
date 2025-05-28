"use client";

import React, { useState, useEffect, Suspense, use } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useSearchParams } from "next/navigation";

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 flex items-center justify-center">Loading map...</div>,
});

export default function ReportPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const searchParams = useSearchParams();

  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  const latFromQuery = latParam ? parseFloat(latParam) : null;
  const lngFromQuery = lngParam ? parseFloat(lngParam) : null;

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    latFromQuery && lngFromQuery ? { lat: latFromQuery, lng: lngFromQuery } : null
  );

  const [description, setDescription] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ lat: string; lon: string; display_name: string }[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in`)
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data);
          })
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSuggestionClick = (place: { lat: string; lon: string; display_name: string }) => {
    setSelectedLocation({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    setSearchQuery(place.display_name);
    setSuggestions([]);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  const handleSetHomeLocation = () => {
    if (latFromQuery && lngFromQuery) {
      setSelectedLocation({ lat: latFromQuery, lng: lngFromQuery });
    }
  };

  const getStarColor = (index: number): string => {
    if (rating >= index + 1) {
      if (rating === 1) return "text-red-500";
      if (rating === 2) return index === 0 ? "text-orange-500" : "text-yellow-500";
      if (rating === 3) return index <= 1 ? "text-yellow-500" : "text-lime-500";
      if (rating === 4) return index <= 2 ? "text-lime-500" : "text-green-500";
      if (rating === 5) return "text-green-500";
    }
    return "text-gray-300";
  };

  const handleSubmit = async () => {
    if (!description || !selectedLocation) {
      setSubmitMessage("Please fill all fields and select location.");
      return;
    }

    const body = {
      userid: userId,
      description,
      latt: selectedLocation.lat,
      long: selectedLocation.lng,
      rating,
    };

    try {
      setSubmitting(true);
      setSubmitMessage("");

      const URL = "https://vedanta-testmodel.hf.space/app/buffer_review";
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setSubmitMessage("Report submitted successfully!");
      setDescription("");
      setRating(0);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitMessage(`Failed to submit report. ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 md:p-6 max-w-xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-emerald-700">Report a Location</h1>

      <p className="text-sm text-gray-600 mb-4">Reporting as: <span className="font-semibold">{userId}</span></p>

      {latFromQuery && lngFromQuery && (
        <div className="mb-4">
          <p className="text-blue-600 font-medium">
            From URL Query: {latFromQuery.toFixed(5)}, {lngFromQuery.toFixed(5)}
          </p>
          <button
            onClick={handleSetHomeLocation}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded mt-2"
          >
            Set as Home Location
          </button>
        </div>
      )}

      <form onSubmit={handleSearchSubmit} className="mb-4 relative">
        <label className="block font-semibold mb-1">Search Location</label>
        <input
          type="text"
          placeholder="Start typing a location..."
          className="text-black p-2 rounded border w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border w-full mt-1 max-h-52 overflow-auto z-50 rounded shadow">
            {suggestions.map((place, idx) => (
              <li
                key={idx}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(place)}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </form>

      <div className="relative z-10 mb-2">
        <Suspense fallback={<div className="h-64 bg-gray-100 flex items-center justify-center">Loading map...</div>}>
          <MapClient
            onLocationSelect={setSelectedLocation}
            currentLocation={selectedLocation}
          />
        </Suspense>
      </div>

      {selectedLocation && (
        <p className="text-gray-700 font-medium mt-2">
          Selected: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
        </p>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            className="w-full p-2 border rounded text-black"
            placeholder="Describe the issue here..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Rate This Location</label>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setRating(index + 1)}
                className={`text-2xl ${getStarColor(index)} focus:outline-none`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <button
          className={`bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded w-full ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>

        {submitMessage && (
          <p className={`text-sm font-medium text-center ${submitMessage.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
            {submitMessage}
          </p>
        )}
      </div>
    </div>
  );
}
