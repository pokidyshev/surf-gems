"use client";

import { SurfSpot } from "@/data/surf-spots";
import { Badge } from "@/components/ui/badge";
import { Waves, Wind, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface SurfTypeFilterProps {
  selectedType: SurfSpot["surfType"] | null;
  onSelectType: (type: SurfSpot["surfType"] | null) => void;
}

const surfTypeConfig: Record<
  SurfSpot["surfType"],
  { label: string; icon: React.ReactNode; color: string; activeColor: string }
> = {
  ocean: {
    label: "Океан",
    icon: <Waves className="h-3.5 w-3.5" />,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    activeColor: "bg-blue-600 text-white border-blue-600",
  },
  rapid: {
    label: "Rapid",
    icon: <Wind className="h-3.5 w-3.5" />,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    activeColor: "bg-emerald-600 text-white border-emerald-600",
  },
  wake: {
    label: "Вейк",
    icon: <Droplets className="h-3.5 w-3.5" />,
    color: "bg-violet-50 text-violet-700 border-violet-200",
    activeColor: "bg-violet-600 text-white border-violet-600",
  },
};

export function SurfTypeFilter({
  selectedType,
  onSelectType,
}: SurfTypeFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-slate-600">Тип:</span>
      {(Object.keys(surfTypeConfig) as SurfSpot["surfType"][]).map((type) => {
        const isSelected = selectedType === type;
        const config = surfTypeConfig[type];

        return (
          <Badge
            key={type}
            variant="outline"
            className={cn(
              "cursor-pointer transition-all border px-3 py-1.5 gap-1.5 hover:scale-105",
              isSelected ? config.activeColor : config.color
            )}
            onClick={() => onSelectType(type)}
          >
            {config.icon}
            {config.label}
          </Badge>
        );
      })}
      {selectedType && (
        <button
          onClick={() => onSelectType(null)}
          className="text-xs text-slate-500 hover:text-slate-700 underline ml-1"
        >
          Показать все
        </button>
      )}
    </div>
  );
}

