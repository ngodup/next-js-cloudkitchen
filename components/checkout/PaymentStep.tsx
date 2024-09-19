import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import StripeCheckoutForm from "./StripeCheckoutForm";
import { Button } from "../ui/button";

interface PaymentStepProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  clientSecret: string | null;
  onPlaceOrder: () => void;
  onPaymentSuccess: () => void;
}
const PaymentStep = ({
  paymentMethod,
  setPaymentMethod,
  clientSecret,
  onPlaceOrder,
  onPaymentSuccess,
}: PaymentStepProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="mb-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" id="default" />
          <Label htmlFor="default">Default Payment Method</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="stripe" id="stripe" />
          <Label htmlFor="stripe">Pay with Stripe</Label>
        </div>
      </RadioGroup>
      {paymentMethod === "stripe" && clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeCheckoutForm
            clientSecret={clientSecret}
            onSuccess={onPaymentSuccess}
          />
        </Elements>
      ) : (
        <Button onClick={onPlaceOrder}>Place Order</Button>
      )}
    </>
  );
};

export default PaymentStep;
