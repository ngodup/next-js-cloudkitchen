import { IAddress } from "@/types";
import React from "react";
import { Button } from "../ui/button";

interface ConfirmationStepProps {
  selectedAddress: IAddress | null;
  onPlaceOrder: () => void;
  onBack: () => void;
}

const ConfirmationStep = ({
  selectedAddress,
  onPlaceOrder,
  onBack,
}: ConfirmationStepProps) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
      <p className="mb-4">
        Please review your order details before placing the order.
      </p>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Delivery Address</h3>
        {selectedAddress && (
          <div className="p-4 border rounded border-gray-200">
            <p className="font-medium">{selectedAddress.street}</p>
            <p className="text-sm text-gray-600">{`${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zip}`}</p>
            <p className="text-sm text-gray-600">{selectedAddress.country}</p>
          </div>
        )}
      </div>
      <div className="flex space-x-4">
        <Button onClick={onPlaceOrder} className="flex-grow">
          Place Order
        </Button>
        <Button onClick={onBack} variant="outline">
          Back to Payment
        </Button>
      </div>
    </>
  );
};

export default ConfirmationStep;
