"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearCart,
  selectCartProducts,
  selectCartTotalPrice,
} from "@/store/cart/cart-slice";
import { useSession } from "next-auth/react";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressFormData } from "@/components/checkout/AddressForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useRouter } from "next/navigation";
import { IAddress } from "@/types";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import AddressStep from "@/components/checkout/AddressStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ConfirmationStep from "@/components/checkout/ConfirmationStep";
import { useToastNotification } from "@/hooks/useToastNotification";
import { Elements } from "@stripe/react-stripe-js";

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
  const [isLoading, setIsLoading] = useState(false);

  const { successToast, errorToast } = useToastNotification();

  const cartItems = useAppSelector(selectCartProducts);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const { data: session, status } = useSession();
  const router = useRouter();
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
    setIsLoading(true);
    try {
      const fetchedAddresses = await addressService.fetchAddresses();
      setAddresses(fetchedAddresses);
      const defaultAddress = fetchedAddresses.find(
        (addr: IAddress) => addr.isDefault
      );
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      errorToast("Error", "Failed to fetch addresses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    try {
      const newAddress = await addressService.addAddress(data);
      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newAddress);
      setIsEditingAddress(false);
      setStep(CheckoutStep.Payment);
      successToast(
        "Address Saved",
        "Your address has been successfully saved."
      );
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "There was an error saving your address. Please try again.";
      errorToast("Address Save Failed", errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressUpdate = async (updatedAddress: AddressFormData) => {
    if (!selectedAddress) return;
    setIsLoading(true);
    try {
      const updatedAddressData = await addressService.updateAddress(
        selectedAddress._id,
        updatedAddress
      );
      setAddresses(
        addresses.map((addr) =>
          addr._id === updatedAddressData._id ? updatedAddressData : addr
        )
      );
      setSelectedAddress(updatedAddressData);
      setIsEditingAddress(false);
      successToast(
        "Address Updated",
        "Your address has been successfully updated."
      );
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "Failed to update address. Please try again.";
      errorToast("Update Failed", errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      errorToast(
        "Address Required",
        "Please provide a delivery address before placing the order."
      );
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        products: cartItems,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice,
        addressId: selectedAddress._id,
        paymentMethod,
      };
      const response = await orderService.createOrder(orderData);

      if (response.success) {
        if (paymentMethod === "stripe") {
          if (!response.clientSecret && response.order?.paymentIntentId) {
            const paymentIntentData = await orderService.fetchPaymentIntent(
              response.order.paymentIntentId
            );
            setClientSecret(paymentIntentData.clientSecret);
            setClientSecret(paymentIntentData.clientSecret);
          } else {
            setClientSecret(response.clientSecret || null);
          }
          setStep(CheckoutStep.Payment);
        } else {
          handlePaymentSuccess();
        }
      } else {
        throw new Error(response.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      errorToast(
        "Order Failed",
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    dispatch(clearCart());
    router.push(`/order-confirmation`);
    successToast(
      "Order Placed Successfully",
      "Your order has been placed successfully!"
    );
  };

  if (status === "loading" || isLoading) {
    return <Card className="p-4">Loading...</Card>;
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
                  stripePromise={stripePromise}
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
