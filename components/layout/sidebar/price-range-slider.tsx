"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PriceRangeSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  formatPrice?: (value: number) => string;
}

const PriceRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  PriceRangeSliderProps
>(({ className, formatPrice = (value) => `€${value}`, ...props }, ref) => {
  const [localValue, setLocalValue] = React.useState(
    props.defaultValue || [0, 100]
  );

  React.useEffect(() => {
    if (props.value) {
      setLocalValue(props.value);
    }
  }, [props.value]);

  const handleValueChange = (newValue: number[]) => {
    setLocalValue(newValue);
    props.onValueChange?.(newValue);
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
      onValueChange={handleValueChange}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {[0, 1].map((index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">{formatPrice(localValue[index])}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </SliderPrimitive.Root>
  );
});
PriceRangeSlider.displayName = "PriceRangeSlider";

export { PriceRangeSlider };
