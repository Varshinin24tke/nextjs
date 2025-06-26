"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ReportHeader from "@/components/ReportHeader";
import LocationSearchCard from "@/components/LocationSearchCard";
import MapSelectionCard from "@/components/MapSelectionCard";
import ReportDetailsCard from "@/components/ReportDetailsCard";

export default function ReportPage() {
  const searchParams = useSearchParams();
  const userId =
    searchParams.get("userID") || "00000000-0000-0000-0000-000000000000";

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [description, setDescription] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { lat: string; lon: string; display_name: string }[]
  >([]);
  const [isClient, setIsClient] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&countrycodes=in`
        )
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

  const handleSuggestionClick = (place: {
    lat: string;
    lon: string;
    display_name: string;
  }) => {
    setSelectedLocation({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    });
    setSearchQuery(place.display_name);
    setSuggestions([]);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  const handleSubmit = async () => {
    if (!description || !selectedLocation || rating === 0) {
      setSubmitMessage(
        "Please fill all fields and select location and rating."
      );
      return;
    }

    const body = {
      userid: userId,
      description,
      latt: selectedLocation.lat,
      long: selectedLocation.lng,
      rating,
    };

    console.log("Submitting data:", body);

    try {
      setSubmitting(true);
      setSubmitMessage("");

      const URL = "https://yashdb18-hersafety.hf.space/app/save_review";
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const textResponse = await response.text();
      let data;

      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (error) {
        console.error("JSON parse error:", error);
        data = { status: textResponse };
      }

      console.log("API Response:", {
        status: response.status,
        data: data,
      });

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      setSubmitMessage("Report submitted successfully!");
      setDescription("");
      setRating(0);
      setSelectedLocation(null);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitMessage(`Failed to submit report. ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
  <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div className="container mx-auto px-4 pt-6 pb-28 max-w-6xl">
      <ReportHeader userId={userId} />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column - Location Search & Map */}
        <div className="space-y-6 order-1 lg:order-1">
          <LocationSearchCard
            searchQuery={searchQuery}
            suggestions={suggestions}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            onSuggestionClick={handleSuggestionClick}
          />

          <MapSelectionCard
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
        </div>

        {/* Right Column - Report Details */}
        <div className="space-y-6 order-2 lg:order-2">
          <ReportDetailsCard
            description={description}
            rating={rating}
            hoverRating={hoverRating}
            submitting={submitting}
            submitMessage={submitMessage}
            selectedLocation={selectedLocation}
            onDescriptionChange={setDescription}
            onRatingChange={setRating}
            onRatingHover={setHoverRating}
            onRatingLeave={() => setHoverRating(0)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  </div>
);

}
