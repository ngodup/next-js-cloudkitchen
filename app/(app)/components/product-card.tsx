import Image from "next/image";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FoodItem } from "@/types";
import { LeafyGreenIcon, BeefIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuItemProps {
  food: FoodItem;
}

export default function ProductCard({ food }: MenuItemProps) {
  return (
    <Card className="w-[200px] h-[330px] flex flex-col rounded-lg overflow-hidden">
      <CardHeader className="p-2 flex-shrink-0">
        <Image
          src={`/assets/images/${food.imageName}`}
          alt={food.name}
          width={170}
          height={100}
          className="w-full h-auto rounded-xl"
        />
      </CardHeader>
      <CardContent className="p-2 mt-2 flex-grow">
        <h5 className="font-bold text-sm">{food.name}</h5>
        <div className="flex justify-between text-sm">
          <p className="text-primary">€ {food.price}</p>
          <div className="flex gap-1 items-center">
            {food.repas === "végétarien" ? (
              <>
                <LeafyGreenIcon className="text-primary" />
                <span className="text-xs text-primary">Veg</span>
              </>
            ) : (
              <>
                <BeefIcon className="text-red-600" />
                <span className="text-xs text-red-600">Non Veg</span>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <Button className="mt-3 w-full text-xs h-8 bg-lightGreen text-gray-600">
            Add to Cart
          </Button>
          <Button className="mt-3  text-xs h-8 bg-primary text-primary-foreground">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}