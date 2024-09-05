import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { createApiResponse } from "@/types/ApiResponse";
import { authOptions } from "../auth/[...nextauth]/options";
import OrderModel, { OrderStatus, IOrder, IOrderProduct } from "@/model/Order";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Not Authenticated", 401)
      );
    }

    const userId = session.user._id;
    const userOrders = await OrderModel.find({ userId: userId });

    return NextResponse.json(
      {
        success: true,
        message: "User orders retrieved successfully",
        orders: userOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(createApiResponse<undefined>(false, message, 500));
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Not Authenticated", 401)
      );
    }

    const userId = session.user._id;
    console.log(`Creating order for user: ${userId}`);

    const { products, totalItems, totalPrice, addressId } = await req.json();

    if (!isValidOrderData(products, totalItems, totalPrice, addressId)) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Invalid order data", 400)
      );
    }

    const newOrder = await createOrder(
      userId,
      products,
      totalItems,
      totalPrice,
      addressId
    );

    console.log(`Order created: ${newOrder._id} for user: ${userId}`);

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(createApiResponse<undefined>(false, message, 500));
  }
}

function isValidOrderData(
  products: IOrderProduct[],
  totalItems: number,
  totalPrice: number,
  addressId: string
): boolean {
  return (
    Array.isArray(products) &&
    products.length > 0 &&
    products.every(isValidProduct) &&
    typeof totalItems === "number" &&
    typeof totalPrice === "number" &&
    totalItems > 0 &&
    totalPrice > 0 &&
    typeof addressId === "string" &&
    addressId.length > 0
  );
}

function isValidProduct(product: IOrderProduct): boolean {
  return (
    mongoose.Types.ObjectId.isValid(product.productId) &&
    typeof product.quantity === "number" &&
    typeof product.price === "number" &&
    product.quantity > 0 &&
    product.price >= 0
  );
}

async function createOrder(
  userId: string,
  products: IOrderProduct[],
  totalItems: number,
  totalPrice: number,
  addressId: string
): Promise<IOrder> {
  const newOrder = new OrderModel({
    userId,
    products: products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
      price: product.price,
    })),
    totalItems,
    totalPrice,
    status: OrderStatus.Pending,
    addressId,
  });

  return await newOrder.save();
}
