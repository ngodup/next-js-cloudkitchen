"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingProps {
  maxRating?: number;
  value: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  className?: string;
}

const Rating = ({
  maxRating = 5,
  value,
  onRatingChange,
  readOnly = false,
  className,
}: RatingProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(maxRating)].map((_, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          className={cn(
            "p-0 h-auto",
            index < value ? "text-yellow-400" : "text-gray-300",
            readOnly && "cursor-default"
          )}
          onClick={() =>
            !readOnly && onRatingChange && onRatingChange(index + 1)
          }
          disabled={readOnly}
        >
          <Star className="h-6 w-6 fill-current" />
        </Button>
      ))}
    </div>
  );
};

export default Rating;
