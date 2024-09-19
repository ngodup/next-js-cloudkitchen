import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export default stripe;

export { Stripe };

export const createPaymentIntent = async (
  amount: number,
  metadata: any
): Promise<Stripe.PaymentIntent> => {
  return stripe.paymentIntents.create({
    amount,
    currency: "eur", // Changed to EUR
    metadata,
  });
};

export const constructWebhookEvent = (
  payload: string | Buffer,
  sig: string
): Stripe.Event => {
  return stripe.webhooks.constructEvent(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
};
