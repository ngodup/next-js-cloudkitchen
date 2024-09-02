"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearCart,
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
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const cartItems = useAppSelector(selectCartProducts);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const { data: session, status } = useSession();
  // const { openCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in?redirect=/checkout");
    } else if (cartItems.length === 0) {
      router.push("/checkout");
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
      const response = await axios.post<ApiResponse<{ _id: string }>>(
        "/api/orders",
        {
          products: cartItems,
          totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice,
        }
      );

      if (
        response.data.success &&
        response.data.data &&
        response.data.data._id
      ) {
        console.log("Order placed:", response.data);
        toast({
          title: "Order Placed",
          description: "Your order has been successfully placed!",
        });

        dispatch(clearCart());
        router.push(`/order-confirmation/${response.data.data._id}`);
      } else {
        // If we don't have the expected data, throw an error
        throw new Error(
          response.data.message || "Failed to place order: No order ID received"
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        variant: "destructive",
        title: "Order Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error placing your order. Please try again.",
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
