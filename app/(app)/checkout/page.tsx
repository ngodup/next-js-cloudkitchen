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
import { Button } from "@/components/ui/button";
import AddressForm, {
  AddressFormData,
} from "@/components/checkout/AddressForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { IAddress } from "@/types";

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
  const [paymentData, setPaymentData] = useState<any>(null);

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

  const handlePaymentSubmit = (data: any) => {
    setPaymentData(data);
    setStep(CheckoutStep.Confirmation);
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
        paymentData,
      });

      if (
        response.data.success &&
        response.data.order &&
        response.data.order._id
      ) {
        console.log("Order placed:", response.data);
        toast({
          title: "Order Placed",
          description: "Your order has been successfully placed!",
          className: "bg-primary text-primary-foreground",
        });

        dispatch(clearCart());
        router.push(`/order-confirmation/${response.data.order._id}`);
      } else {
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
              {step === CheckoutStep.Address && (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    Select or Add Address
                  </h2>
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`p-4 border rounded mb-2 ${
                        selectedAddress?._id === address._id
                          ? "bg-blue-100 border-blue-300"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{address.street}</p>
                          <p className="text-sm text-gray-600">{`${address.city}, ${address.state} ${address.zip}`}</p>
                          <p className="text-sm text-gray-600">
                            {address.country}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant={
                              selectedAddress?._id === address._id
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handleAddressSelect(address)}
                          >
                            {selectedAddress?._id === address._id
                              ? "Selected"
                              : "Select"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAddress(address);
                              setIsEditingAddress(true);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isEditingAddress ? (
                    <AddressForm
                      initialData={selectedAddress || undefined}
                      onSubmit={
                        selectedAddress
                          ? handleAddressUpdate
                          : handleAddressSubmit
                      }
                      onCancel={() => setIsEditingAddress(false)}
                    />
                  ) : (
                    <div className="mt-4 space-x-4">
                      <Button onClick={() => setIsEditingAddress(true)}>
                        {addresses.length > 0
                          ? "Add New Address"
                          : "Add Address"}
                      </Button>
                      {selectedAddress && (
                        <Button onClick={() => setStep(CheckoutStep.Payment)}>
                          Continue to Payment
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
              {step === CheckoutStep.Payment && (
                <PaymentForm
                  onNext={handlePaymentSubmit}
                  onPrev={() => setStep(CheckoutStep.Address)}
                />
              )}
              {step === CheckoutStep.Confirmation && (
                <>
                  <h2 className="text-2xl font-bold mb-4">
                    Order Confirmation
                  </h2>
                  <p className="mb-4">
                    Please review your order details before placing the order.
                  </p>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">
                      Delivery Address
                    </h3>
                    {selectedAddress && (
                      <div className="p-4 border rounded border-gray-200">
                        <p className="font-medium">{selectedAddress.street}</p>
                        <p className="text-sm text-gray-600">{`${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zip}`}</p>
                        <p className="text-sm text-gray-600">
                          {selectedAddress.country}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <Button onClick={handlePlaceOrder} className="flex-grow">
                      Place Order
                    </Button>
                    <Button
                      onClick={() => setStep(CheckoutStep.Payment)}
                      variant="outline"
                    >
                      Back to Payment
                    </Button>
                  </div>
                </>
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
