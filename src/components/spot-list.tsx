"use client";

import { useRef, useEffect, useCallback } from "react";
import { SpotCard } from "./spot-card";
import { SurfTypeFilter } from "./surf-type-filter";
import { SurfSpot } from "@/data/surf-spots";
import { Waves } from "lucide-react";

interface SpotListProps {
  spots: SurfSpot[];
  activeSpotId: string | null;
  onSpotClick: (spot: SurfSpot) => void;
  selectedType: SurfSpot["surfType"] | null;
  onSelectType: (type: SurfSpot["surfType"] | null) => void;
}

export function SpotList({
  spots,
  activeSpotId,
  onSpotClick,
  selectedType,
  onSelectType,
}: SpotListProps) {
  const cardRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  
  const setCardRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(id, el);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);

  useEffect(() => {
    if (activeSpotId) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const cardEl = cardRefs.current.get(activeSpotId);
        if (cardEl) {
          cardEl.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeSpotId]);

  const filteredSpots = selectedType
    ? spots.filter((spot) => spot.surfType === selectedType)
    : spots;

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b px-6 py-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Waves className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Surf Gems</h1>
            <p className="text-sm text-muted-foreground">
              {filteredSpots.length} {filteredSpots.length === 1 ? "спот" : filteredSpots.length < 5 ? "спота" : "спотов"}
              {selectedType && ` (отфильтровано из ${spots.length})`}
            </p>
          </div>
        </div>
        <SurfTypeFilter
          selectedType={selectedType}
          onSelectType={onSelectType}
        />
      </div>

      <div className="p-6 space-y-4">
        {filteredSpots.length > 0 ? (
          filteredSpots.map((spot, index) => (
            <div
              key={spot.id}
              ref={setCardRef(spot.id)}
            >
              <SpotCard
                spot={spot}
                isActive={activeSpotId === spot.id}
                onClick={() => onSpotClick(spot)}
                isPriority={index < 2}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Waves className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">Нет спотов по вашему фильтру</p>
            <button
              onClick={() => onSelectType(null)}
              className="text-xs text-primary hover:underline mt-2"
            >
              Показать все
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

