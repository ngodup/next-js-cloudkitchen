"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearCart,
  selectCartProducts,
  selectCartTotalPrice,
} from "@/store/cart/cart-slice";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressFormData } from "@/components/checkout/AddressForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { IAddress } from "@/types";
import { loadStripe } from "@stripe/stripe-js";
import AddressStep from "@/components/checkout/AddressStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ConfirmationStep from "@/components/checkout/ConfirmationStep";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

enum CheckoutStep {
  Address = 1,
  Payment = 2,
  Confirmation = 3,
}

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>(CheckoutStep.Address);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("default");
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const cartItems = useAppSelector(selectCartProducts);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in?redirect=/checkout");
    } else if (cartItems.length === 0) {
      router.push("/");
    } else if (status === "authenticated") {
      fetchAddresses();
    }
  }, [cartItems, status, router]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("/api/addresses");
      if (response.data.success && response.data.addresses) {
        setAddresses(response.data.addresses);
        const defaultAddress = response.data.addresses.find(
          (addr: IAddress) => addr.isDefault
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch addresses. Please try again.",
      });
    }
  };

  const handleAddressSubmit = async (data: AddressFormData) => {
    try {
      const response = await axios.post("/api/addresses", data);
      if (response.data.success && response.data.addresss) {
        // Note the 'addresss' key
        setAddresses([...addresses, response.data.addresss]);
        setSelectedAddress(response.data.addresss);
        setIsEditingAddress(false);
        setStep(CheckoutStep.Payment);
        toast({
          title: "Address Saved",
          description: "Your address has been successfully saved.",
          className: "bg-primary text-primary-foreground",
        });
      } else {
        throw new Error(response.data.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        variant: "destructive",
        title: "Address Save Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error saving your address. Please try again.",
      });
    }
  };

  const handleAddressUpdate = async (updatedAddress: AddressFormData) => {
    if (!selectedAddress) return;
    try {
      const response = await axios.put(`/api/addresses`, {
        addressId: selectedAddress._id,
        ...updatedAddress,
      });
      if (response.data.success && response.data.addresss) {
        // Note the 'addresss' key
        setAddresses(
          addresses.map((addr) =>
            addr._id === response.data.addresss._id
              ? response.data.addresss
              : addr
          )
        );
        setSelectedAddress(response.data.addresss);
        setIsEditingAddress(false);
        toast({
          title: "Address Updated",
          description: "Your address has been successfully updated.",
          className: "bg-primary text-primary-foreground",
        });
      } else {
        throw new Error(response.data.message || "Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update address. Please try again.",
      });
    }
  };

  const handleAddressSelect = (address: IAddress) => {
    setSelectedAddress(address);
  };

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

    if (!selectedAddress) {
      toast({
        variant: "destructive",
        title: "Address Required",
        description:
          "Please provide a delivery address before placing the order.",
      });
      return;
    }

    try {
      const response = await axios.post("/api/orders", {
        products: cartItems,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice,
        addressId: selectedAddress._id,
        paymentMethod,
      });

      if (response.data.success) {
        if (paymentMethod === "stripe") {
          setClientSecret(response.data.clientSecret);
          setStep(CheckoutStep.Payment);
        } else {
          handlePaymentSuccess();
        }
      } else {
        throw new Error(response.data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        variant: "destructive",
        title: "Order Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error creating your order. Please try again.",
      });
    }
  };

  const handlePaymentSuccess = () => {
    dispatch(clearCart());
    router.push(`/order-confirmation`);
    toast({
      title: "Order Placed Successfully",
      description: "Your order has been placed successfully!",
      className: "bg-primary text-primary-foreground",
    });
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
              {step === CheckoutStep.Address && (
                <AddressStep
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  isEditingAddress={isEditingAddress}
                  onAddressSelect={setSelectedAddress}
                  onEditAddress={() => setIsEditingAddress(true)}
                  onAddressSubmit={handleAddressSubmit}
                  onAddressUpdate={handleAddressUpdate}
                  onCancelEdit={() => setIsEditingAddress(false)}
                  onContinue={() => setStep(CheckoutStep.Payment)}
                />
              )}
              {step === CheckoutStep.Payment && (
                <PaymentStep
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  clientSecret={clientSecret}
                  onPlaceOrder={handlePlaceOrder}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              )}
              {step === CheckoutStep.Confirmation && (
                <ConfirmationStep
                  selectedAddress={selectedAddress}
                  onPlaceOrder={handlePlaceOrder}
                  onBack={() => setStep(CheckoutStep.Payment)}
                />
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
