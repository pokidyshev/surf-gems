"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SurfSpot } from "@/data/surf-spots";

interface MapViewProps {
  spots: SurfSpot[];
  activeSpotId: string | null;
  onMarkerClick: (spot: SurfSpot) => void;
}

function MapController({
  activeSpot,
}: {
  activeSpot: SurfSpot | null;
}) {
  const map = useMap();
  const initialFlyDone = useRef(false);

  useEffect(() => {
    if (activeSpot && initialFlyDone.current) {
      try {
        const [lat, lng] = activeSpot.coordinates;
        if (isFinite(lat) && isFinite(lng)) {
          // Stop any current animation first
          map.stop();
          // Use setView with animation instead of flyTo to avoid race conditions
          map.setView([lat, lng], 10, { animate: true, duration: 1 });
        }
      } catch {
        // Ignore animation errors
      }
    }
    initialFlyDone.current = true;
  }, [activeSpot, map]);

  return null;
}

export function MapView({ spots, activeSpotId, onMarkerClick }: MapViewProps) {
  const activeSpot = spots.find((s) => s.id === activeSpotId) || null;
  
  // Create icons using useMemo to avoid recreating on every render
  const { defaultIcon, activeIcon } = useMemo(() => {
    const defaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const activeIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [30, 49],
      iconAnchor: [15, 49],
      popupAnchor: [1, -40],
      shadowSize: [49, 49],
      className: "active-marker",
    });

    return { defaultIcon, activeIcon };
  }, []);

  // Calculate center based on all spots or default to world center
  const center: [number, number] = useMemo(() => {
    if (spots.length === 0) return [20, 0] as [number, number];
    
    const validSpots = spots.filter(s => 
      Array.isArray(s.coordinates) && 
      s.coordinates.length === 2 &&
      typeof s.coordinates[0] === 'number' && 
      typeof s.coordinates[1] === 'number' &&
      !isNaN(s.coordinates[0]) && 
      !isNaN(s.coordinates[1])
    );
    
    if (validSpots.length === 0) return [20, 0] as [number, number];
    
    return [
      validSpots.reduce((sum, s) => sum + s.coordinates[0], 0) / validSpots.length,
      validSpots.reduce((sum, s) => sum + s.coordinates[1], 0) / validSpots.length,
    ] as [number, number];
  }, [spots]);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={2}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapController activeSpot={activeSpot} />
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={spot.coordinates}
            icon={spot.id === activeSpotId ? activeIcon : defaultIcon}
            eventHandlers={{
              click: () => {
                onMarkerClick(spot);
              },
            }}
          >
            <Popup>
              <div className="min-w-[150px]">
                <h3 className="font-semibold text-slate-900">{spot.name}</h3>
                <p className="text-xs text-slate-600">{spot.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

