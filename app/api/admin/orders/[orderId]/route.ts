import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuthorization } from "../../adminAuth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/Order";
import { createNextResponse } from "@/lib/ApiResponse";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await dbConnect();

    const authResponse = await checkAdminAuthorization();
    if (authResponse) return authResponse;

    const orderId = params.orderId;
    const { status } = await req.json();

    if (!status) {
      return createNextResponse(false, "Status is required", 400);
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return createNextResponse(false, "Order not found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully",
        data: updatedOrder,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return createNextResponse(false, "Error updating order status", 500);
  }
}
