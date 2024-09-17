import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/Order";
import { createApiResponse } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        createApiResponse(false, "Unauthorized access", 403)
      );
    }

    await dbConnect();

    const orderId = params.orderId;
    const { status } = await req.json();
    console.log(` Order ID: ${orderId} | Status: ${status}`);

    if (!status) {
      return NextResponse.json(
        createApiResponse(false, "Status is required", 400)
      );
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    console.log("Updated order:", updatedOrder);

    if (!updatedOrder) {
      return NextResponse.json(
        createApiResponse(false, "Order not found", 404)
      );
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
    return NextResponse.json(
      createApiResponse(false, "Error updating order status", 500)
    );
  }
}
