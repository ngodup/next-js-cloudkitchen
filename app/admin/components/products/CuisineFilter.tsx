import React from "react";
import { Button } from "@/components/ui/button";

interface CuisineFilterProps {
  activeCuisine: string;
  setActiveCuisine: (cuisine: string) => void;
}

const cuisines = [
  "All Cuisines",
  "Indienne",
  "Français",
  "Japonaise",
  "Italienne",
  "Tibétaine",
  "Vietnamienne",
];

const CuisineFilter = ({
  activeCuisine,
  setActiveCuisine,
}: CuisineFilterProps) => {
  return (
    <div className="flex space-x-2 mb-6 flex-wrap gap-1">
      {cuisines.map((cuisine) => (
        <Button
          key={cuisine}
          variant={activeCuisine === cuisine ? "default" : "outline"}
          onClick={() => setActiveCuisine(cuisine)}
        >
          {cuisine}
        </Button>
      ))}
    </div>
  );
};

export default CuisineFilter;
