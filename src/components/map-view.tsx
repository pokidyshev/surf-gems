"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SurfSpot } from "@/data/surf-spots";
import { Waves, Calendar } from "lucide-react";

interface MapViewProps {
  spots: SurfSpot[];
  activeSpotId: string | null;
  onMarkerClick: (spot: SurfSpot) => void;
  onGoToList?: () => void;
}

function MapController({
  activeSpot,
  markerRefs,
}: {
  activeSpot: SurfSpot | null;
  markerRefs: React.MutableRefObject<Map<string, L.Marker>>;
}) {
  const map = useMap();
  const lastSpotIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!activeSpot) {
      lastSpotIdRef.current = null;
      return;
    }

    // Skip if we already flew to this spot
    if (lastSpotIdRef.current === activeSpot.id) {
      return;
    }

    try {
      const [lat, lng] = activeSpot.coordinates;
      if (isFinite(lat) && isFinite(lng)) {
        map.stop();
        map.setView([lat, lng], 10, { animate: true, duration: 1 });
        lastSpotIdRef.current = activeSpot.id;
        
        // Open popup after map animation
        setTimeout(() => {
          const marker = markerRefs.current.get(activeSpot.id);
          if (marker) {
            marker.openPopup();
          }
        }, 300);
      }
    } catch {
      // Ignore animation errors
    }
  }, [activeSpot, map, markerRefs]);

  return null;
}

const surfTypeLabels: Record<SurfSpot["surfType"], string> = {
  ocean: "Океан",
  rapid: "Rapid",
  wake: "Вейк",
};

const surfTypeColors: Record<SurfSpot["surfType"], string> = {
  ocean: "bg-blue-100 text-blue-800",
  rapid: "bg-emerald-100 text-emerald-800",
  wake: "bg-violet-100 text-violet-800",
};

export function MapView({ spots, activeSpotId, onMarkerClick, onGoToList }: MapViewProps) {
  const activeSpot = spots.find((s) => s.id === activeSpotId) || null;
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());
  
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
        <MapController activeSpot={activeSpot} markerRefs={markerRefs} />
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={spot.coordinates}
            icon={spot.id === activeSpotId ? activeIcon : defaultIcon}
            ref={(ref) => {
              if (ref) {
                markerRefs.current.set(spot.id, ref);
              }
            }}
            eventHandlers={{
              click: () => {
                onMarkerClick(spot);
              },
            }}
          >
            <Popup>
              <div className="min-w-[200px] max-w-[250px]">
                <h3 className="font-semibold text-slate-900 mb-1">
                  {spot.name}
                </h3>
                <p className="text-xs text-slate-600 mb-2">{spot.location}</p>
                
                {/* Wave Type Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${surfTypeColors[spot.surfType]}`}>
                    <Waves className="h-3 w-3" />
                    {surfTypeLabels[spot.surfType]}
                  </span>
                </div>
                
                {/* Best Season */}
                {spot.bestSeason && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span>{spot.bestSeason}</span>
                  </div>
                )}
                
                {/* Go to spot button */}
                {onGoToList && (
                  <button
                    type="button"
                    onClick={() => {
                      onMarkerClick(spot);
                      onGoToList();
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors active:bg-primary/80"
                  >
                    Перейти к споту
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

