"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SpotList } from "@/components/spot-list";
import { MobileMapToggle } from "@/components/mobile-map-toggle";
import { surfSpots, SurfSpot } from "@/data/surf-spots";

// Dynamic import to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/map-view").then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-100">
      <div className="text-slate-500">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedType, setSelectedType] = useState<SurfSpot["surfType"] | null>(null);

  const handleSpotClick = (spot: SurfSpot) => {
    setActiveSpotId(spot.id);
    // On mobile, switch to map view when clicking a spot
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowMap(true);
    }
  };

  const handleMarkerClick = (spot: SurfSpot) => {
    setActiveSpotId(spot.id);
  };

  const toggleMapView = () => {
    setShowMap((prev) => !prev);
  };

  const handleSelectType = (type: SurfSpot["surfType"] | null) => {
    setSelectedType(type);
  };

  const filteredSpots = selectedType
    ? surfSpots.filter((spot) => spot.surfType === selectedType)
    : surfSpots;

  return (
    <main className="h-screen overflow-hidden bg-white">
      {/* Desktop Layout: Split Screen */}
      <div className="hidden md:flex h-full">
        {/* Left Panel: Spot List (40%) */}
        <div className="w-[40%] h-full border-r border-slate-200">
          <SpotList
            spots={surfSpots}
            activeSpotId={activeSpotId}
            onSpotClick={handleSpotClick}
            selectedType={selectedType}
            onSelectType={handleSelectType}
          />
        </div>

        {/* Right Panel: Map (60%) */}
        <div className="w-[60%] h-full sticky top-0">
          <MapView
            spots={filteredSpots}
            activeSpotId={activeSpotId}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>

      {/* Mobile Layout: Conditional rendering */}
      <div className="md:hidden h-full">
        {showMap ? (
          <div className="h-full">
            <MapView
              spots={filteredSpots}
              activeSpotId={activeSpotId}
              onMarkerClick={handleMarkerClick}
              onGoToList={() => setShowMap(false)}
            />
          </div>
        ) : (
          <SpotList
            spots={surfSpots}
            activeSpotId={activeSpotId}
            onSpotClick={handleSpotClick}
            selectedType={selectedType}
            onSelectType={handleSelectType}
          />
        )}
      </div>

      {/* Mobile Toggle Button */}
      <MobileMapToggle showMap={showMap} onClick={toggleMapView} />
    </main>
  );
}
