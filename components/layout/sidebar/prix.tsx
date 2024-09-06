import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceRange } from "@/types";

export interface PrixProps {
  priceRanges: PriceRange[];
  selectedPrice: string;
  onPriceChange: (selectedPrice: string) => void;
}

const Prix: React.FC<PrixProps> = ({
  priceRanges,
  selectedPrice,
  onPriceChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">PRIX</h3>
      <Select value={selectedPrice} onValueChange={onPriceChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionnez une gamme de prix" />
        </SelectTrigger>
        <SelectContent>
          {priceRanges.map((range) => (
            <SelectItem key={range.id} value={range.id}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Prix;
