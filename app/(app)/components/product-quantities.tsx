import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PlusCircleIcon, MinusCircleIcon } from "lucide-react";

interface ProductQuantitiesProps {
  className?: string;
}

const ProductQuantities: React.FC<ProductQuantitiesProps> = ({ className }) => {
  return (
    <Card
      className={cn(
        "flex justify-between items-center h-8 max-w-40 p-2",
        className
      )}
    >
      <PlusCircleIcon className="text-primary" size={25} />
      <span>1</span>
      <MinusCircleIcon className="text-primary" size={25} />
    </Card>
  );
};

export default ProductQuantities;
