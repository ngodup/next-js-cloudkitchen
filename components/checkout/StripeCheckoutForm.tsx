import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "../ui/button";

const StripeCheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message || "An error occurred during payment.");
      setProcessing(false);
    } else if (result.paymentIntent.status === "succeeded") {
      onSuccess();
    } else {
      setError("Unexpected payment status. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <Button type="submit" disabled={!stripe || processing} className="mt-4">
        {processing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

export default StripeCheckoutForm;
