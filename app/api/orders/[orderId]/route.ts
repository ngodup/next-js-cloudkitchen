import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { createNextResponse } from "@/lib/ApiResponse";
import { authOptions } from "../../auth/[...nextauth]/options";
import OrderModel from "@/model/Order";
// import ProductModel from "@/model/Product";
import { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return createNextResponse(false, "Not Authenticated", 401);
    }

    const userId = session.user._id;
    const { orderId } = params;

    if (!Types.ObjectId.isValid(orderId)) {
      return createNextResponse(false, "Invalid order ID", 400);
    }

    const order = await OrderModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(orderId),
          userId: new Types.ObjectId(userId),
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          products: {
            $push: {
              productId: "$products.productId",
              quantity: "$products.quantity",
              price: "$products.price",
              name: "$productDetails.name",
              imageName: "$productDetails.imageName",
            },
          },
          totalItems: { $first: "$totalItems" },
          totalPrice: { $first: "$totalPrice" },
          createdAt: { $first: "$createdAt" },
          status: { $first: "$status" },
        },
      },
    ]);

    if (!order || order.length === 0) {
      return createNextResponse(false, "Order not found or unauthorized", 404);
    }

    return NextResponse.json(
      {
        success: true,
        order: order[0],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving order:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}
