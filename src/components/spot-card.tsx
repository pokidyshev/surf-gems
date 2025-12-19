"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Waves, ExternalLink, Calendar, User, Phone, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SurfSpot } from "@/data/surf-spots";
import { cn } from "@/lib/utils";

interface SpotCardProps {
  spot: SurfSpot;
  isActive: boolean;
  onClick: () => void;
}

const surfTypeLabels: Record<SurfSpot["surfType"], string> = {
  ocean: "Ocean",
  rapid: "River Rapid",
  wake: "Wakesurf",
};

const surfTypeColors: Record<SurfSpot["surfType"], string> = {
  ocean: "bg-blue-100 text-blue-800",
  rapid: "bg-emerald-100 text-emerald-800",
  wake: "bg-violet-100 text-violet-800",
};

export function SpotCard({ spot, isActive, onClick }: SpotCardProps) {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? spot.imageUrls.length - 1 : prev - 1
    );
    setImageError(false);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === spot.imageUrls.length - 1 ? 0 : prev + 1
    );
    setImageError(false);
  };

  const hasMultipleImages = spot.imageUrls.length > 1;

  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        isActive && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onClick}
    >
      <div className="relative aspect-4/5 overflow-hidden bg-linear-to-br from-sky-100 to-blue-200">
        {!imageError && (
          <Image
            src={spot.imageUrls[currentImageIndex]}
            alt={`${spot.name} - ${currentImageIndex + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Waves className="h-12 w-12 text-sky-400/50" />
          </div>
        )}
        
        {/* Navigation Arrows */}
        {hasMultipleImages && !imageError && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Image Counter Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {spot.imageUrls.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    index === currentImageIndex
                      ? "bg-white w-4"
                      : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-3 left-3">
          <Badge
            className={cn(
              "font-medium shadow-sm",
              surfTypeColors[spot.surfType]
            )}
          >
            <Waves className="mr-1 h-3 w-3" />
            {surfTypeLabels[spot.surfType]}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors">
            {spot.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{spot.location}</span>
          </div>
        </div>

        <p className={cn(
          "text-sm text-slate-600 mb-3",
          !isExpanded && "line-clamp-2"
        )}>
          {spot.description}
        </p>

        {spot.notes && (
          <div className="mt-3 border-t pt-3">
            <p className={cn(
              "text-xs text-muted-foreground",
              !isExpanded && "line-clamp-2"
            )}>
              {spot.notes}
            </p>
            {(spot.description.length > 100 || spot.notes.length > 100) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-xs text-primary hover:underline mt-1 flex items-center gap-0.5"
              >
                {isExpanded ? (
                  <>
                    Свернуть <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    Читать далее <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Additional Information */}
        {(spot.address || spot.bestSeason || spot.instructor || spot.contact || spot.mapLink) && (
          <div className="mt-3 pt-3 border-t space-y-1.5">
            {spot.address && (
              <div className="flex items-start gap-1.5 text-xs">
                <MapPin className="h-3 w-3 text-slate-400 mt-0.5 shrink-0" />
                <span className="text-slate-600">{spot.address}</span>
              </div>
            )}
            {spot.bestSeason && (
              <div className="flex items-center gap-1.5 text-xs">
                <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="text-slate-600">{spot.bestSeason}</span>
              </div>
            )}
            {spot.instructor && (
              <div className="flex items-center gap-1.5 text-xs">
                <User className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="text-slate-600">{spot.instructor}</span>
              </div>
            )}
            {spot.contact && (
              <div className="flex items-center gap-1.5 text-xs">
                <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                {spot.contact.startsWith('http') ? (
                  <a
                    href={spot.contact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {spot.contact.includes('instagram') ? 'Instagram' : 'Contact'}
                  </a>
                ) : (
                  <span className="text-slate-600">{spot.contact}</span>
                )}
              </div>
            )}
            {spot.mapLink && (
              <div className="flex items-center gap-1.5 text-xs mt-2">
                <a
                  href={spot.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  Открыть на карте
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

