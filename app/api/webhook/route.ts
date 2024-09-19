import { NextRequest } from "next/server";
import Stripe from "stripe";
import { constructWebhookEvent } from "@/lib/stripe";
import { createNextResponse } from "@/lib/ApiResponse";
import OrderModel from "@/model/Order";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return createNextResponse(false, "No Stripe signature found", 400);
  }

  try {
    const event = constructWebhookEvent(body, sig) as Stripe.Event;

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const order = await OrderModel.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: "paid" },
        { new: true }
      );

      if (!order) {
        console.error(`Order not found for PaymentIntent: ${paymentIntent.id}`);
        return createNextResponse(false, "Order not found", 404);
      }

      // Here you can add any additional logic, like sending confirmation emails, etc.

      return createNextResponse(true, "Payment processed successfully", 200);
    }

    return createNextResponse(true, "Received", 200);
  } catch (err) {
    console.error(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`
    );
    return createNextResponse(
      false,
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      400
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
