"use client";

import { Map, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMapToggleProps {
  showMap: boolean;
  onClick: () => void;
}

export function MobileMapToggle({ showMap, onClick }: MobileMapToggleProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden" style={{ zIndex: 9999 }}>
      <Button
        onClick={onClick}
        size="lg"
        className="rounded-full px-6 shadow-xl bg-sky-600 hover:bg-sky-700 text-white gap-2 border-2 border-white"
      >
        {showMap ? (
          <>
            <List className="h-4 w-4" />
            Show List
          </>
        ) : (
          <>
            <Map className="h-4 w-4" />
            Show Map
          </>
        )}
      </Button>
    </div>
  );
}

