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
import { IAddress } from "@/types";
import { loadStripe } from "@stripe/stripe-js";
import AddressStep from "@/components/checkout/AddressStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ConfirmationStep from "@/components/checkout/ConfirmationStep";
import { useToastNotification } from "@/hooks/useToastNotification";
import { checkoutService } from "@/services/checkoutService";

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
    try {
      const fetchedAddresses = await checkoutService.fetchAddresses();
      setAddresses(fetchedAddresses);
      debugger;
      const defaultAddress = fetchedAddresses.find(
        (addr: IAddress) => addr.isDefault
      );
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      errorToast("Error", "Failed to fetch addresses. Please try again.");
    }
  };

  const handleAddressSubmit = async (data: AddressFormData) => {
    try {
      const newAddress = await checkoutService.addAddress(data);
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
    }
  };

  const handleAddressUpdate = async (updatedAddress: AddressFormData) => {
    if (!selectedAddress) return;
    try {
      const updatedAddressData = await checkoutService.updateAddress(
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
    }
  };

  const handleAddressSelect = (address: IAddress) => {
    setSelectedAddress(address);
  };

  const handlePlaceOrder = async () => {
    if (!session) {
      errorToast(
        "Authentication Required",
        "Please log in to complete the checkout."
      );
      router.push("/auth/sign-in?redirect=/checkout");
      return;
    }

    if (!selectedAddress) {
      errorToast(
        "Address Required",
        "Please provide a delivery address before placing the order."
      );
      return;
    }

    try {
      const orderData = {
        products: cartItems,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice,
        addressId: selectedAddress._id,
        paymentMethod,
      };
      const response = await checkoutService.createOrder(orderData);
      if (response.success) {
        if (paymentMethod === "stripe") {
          setClientSecret(response.clientSecret);
          setStep(CheckoutStep.Payment);
        } else {
          handlePaymentSuccess();
        }
      } else {
        throw new Error(response.message || "Failed to create order");
      }
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "There was an error creating your order. Please try again.";
      errorToast("Order Failed", errMsg);
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
