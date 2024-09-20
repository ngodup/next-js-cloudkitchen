import { NextRequest, NextResponse } from "next/server";
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
    const event = constructWebhookEvent(body, sig);

    switch (event.type) {
      case "payment_intent.succeeded":
        return await handlePaymentIntentSucceeded(event);
      case "payment_intent.payment_failed":
        return await handlePaymentIntentFailed(event);
      // Add more event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
        return createNextResponse(true, "Webhook received", 200);
    }
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

async function handlePaymentIntentSucceeded(event: any) {
  const paymentIntent = event.data.object;
  const order = await OrderModel.findOneAndUpdate(
    { paymentIntentId: paymentIntent.id },
    { status: "paid", paymentStatus: "paid" },
    { new: true }
  );

  if (!order) {
    console.error(`Order not found for PaymentIntent: ${paymentIntent.id}`);
    return createNextResponse(false, "Order not found", 404);
  }

  // Add logic for sending confirmation emails, updating inventory, etc.

  return createNextResponse(true, "Payment processed successfully", 200);
}

async function handlePaymentIntentFailed(event: any) {
  const paymentIntent = event.data.object;
  const order = await OrderModel.findOneAndUpdate(
    { paymentIntentId: paymentIntent.id },
    { status: "payment_failed", paymentStatus: "failed" },
    { new: true }
  );

  if (!order) {
    console.error(`Order not found for PaymentIntent: ${paymentIntent.id}`);
    return createNextResponse(false, "Order not found", 404);
  }

  // Add logic for handling failed payments (e.g., notifying the user)

  return createNextResponse(true, "Payment failure handled", 200);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
