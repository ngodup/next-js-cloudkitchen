import { NextRequest, NextResponse } from "next/server";
import { createNextResponse } from "@/lib/ApiResponse";
import stripe from "@/lib/stripe";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentIntentId = params.id;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return createNextResponse(false, "PaymentIntent not found", 404);
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error retrieving PaymentIntent:", error);
    if (error instanceof stripe.errors.StripeError) {
      if (error.type === "StripeInvalidRequestError") {
        return createNextResponse(false, "Invalid PaymentIntent ID", 400);
      }
    }
    // Fallback for other errors
    return createNextResponse(false, "Failed to retrieve PaymentIntent", 500);
  }
}
