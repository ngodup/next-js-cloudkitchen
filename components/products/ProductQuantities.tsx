import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PlusCircleIcon, MinusCircleIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addToCart,
  removeFromCart,
  selectCartItemQuantity,
  updateQuantity,
} from "@/store/cart/cart-slice";
import { IFoodItem } from "@/types";

interface ProductQuantitiesProps {
  className?: string;
  product: IFoodItem;
}

const ProductQuantities: React.FC<ProductQuantitiesProps> = ({
  className,
  product,
}) => {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector((state) =>
    selectCartItemQuantity(state, product._id!)
  );

  const handleIncrement = () => {
    dispatch(
      addToCart({
        productId: product._id!,
        name: product.name,
        price: product.price,
        imageName: product.imageName,
      })
    );
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      dispatch(
        updateQuantity({ productId: product._id!, quantity: quantity - 1 })
      );
    }
  };

  return (
    <Card
      className={cn(
        "flex justify-between items-center h-8 max-w-40 p-2",
        className
      )}
    >
      <MinusCircleIcon
        className="text-primary cursor-pointer"
        size={25}
        onClick={handleDecrement}
      />
      <span>{quantity}</span>
      <PlusCircleIcon
        className="text-primary cursor-pointer"
        size={25}
        onClick={handleIncrement}
      />
    </Card>
  );
};

export default ProductQuantities;
