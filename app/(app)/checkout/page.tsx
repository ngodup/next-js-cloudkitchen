"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import {
  selectCartProducts,
  selectCartTotalPrice,
} from "@/store/cart/cart-slice";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/useCar";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const cartItems = useAppSelector(selectCartProducts);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const { data: session, status } = useSession();
  const { openCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in?redirect=/checkout");
    } else if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, status, router]);

  const handleNextStep = () => setStep((prevStep) => prevStep + 1);
  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);

  const handlePlaceOrder = async () => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to complete the checkout.",
      });
      router.push("/auth/sign-in?redirect=/checkout");
      return;
    }

    try {
      // Implement order submission logic here
      // For example:
      // const response = await submitOrder(cartItems, session.user.id);
      console.log("Placing order...");
      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed!",
      });
      // Clear cart and redirect to order confirmation page
      // clearCart();
      // router.push("/order-confirmation");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
      });
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && <AddressForm onNext={handleNextStep} />}
              {step === 2 && (
                <PaymentForm
                  onPrev={handlePrevStep}
                  onNext={(data) => {
                    console.log(data); // Handle the payment data
                    handleNextStep();
                  }}
                />
              )}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Order Confirmation
                  </h2>
                  <p>
                    Please review your order details before placing the order.
                  </p>
                  <Button onClick={handlePlaceOrder} className="mt-4">
                    Place Order
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <OrderSummary items={cartItems} total={totalPrice} />
        </div>
      </div>
    </div>
  );
}
