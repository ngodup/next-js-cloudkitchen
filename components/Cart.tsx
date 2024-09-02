import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectCartProducts,
  selectCartTotalPrice,
  removeFromCart,
  clearCart,
  updateQuantity,
  selectCartTotalItems,
} from "@/store/cart/cart-slice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

const Cart = () => {
  const dispatch = useAppDispatch();
  const cartProducts = useAppSelector(selectCartProducts);
  const totalAmount = useAppSelector(selectCartTotalPrice);
  const totalProduct = useAppSelector(selectCartTotalItems);
  const { isOpen, closeCart } = useCart();

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] mt-2">
          {cartProducts.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ${item.price} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleUpdateQuantity(item.productId, item.quantity - 1)
                  }
                >
                  -
                </Button>
                <span className="mx-2">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleUpdateQuantity(item.productId, item.quantity + 1)
                  }
                >
                  +
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem(item.productId)}
                  className="ml-2"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="mt-1">
          <p className="text-lg font-semibold">
            Total: ${totalAmount.toFixed(2)}
          </p>
          <Button className="w-full mt-2" onClick={handleClearCart}>
            Clear Cart
          </Button>
          <Link href="/checkout" legacyBehavior>
            <Button className="w-full mt-2" disabled={totalProduct <= 0}>
              Checkout
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
