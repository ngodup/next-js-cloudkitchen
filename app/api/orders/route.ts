// app/api/orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { createApiResponse } from "@/types/ApiResponse";
import { authOptions } from "../auth/[...nextauth]/options";
import OrderModel, { Order, OrderProduct } from "@/model/Order";

// Define valid order statuses
export enum OrderStatus {
  Pending = "pending",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Not Authenticated", 401),
        { status: 401 }
      );
    }

    const body = await req.json();
    const { products, totalItems, totalPrice, status } = body;

    if (!isValidOrderData(products, totalItems, totalPrice, status)) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Invalid order data", 400),
        { status: 400 }
      );
    }

    const newOrder = await createOrder(
      session.user._id,
      products,
      totalItems,
      totalPrice,
      status
    );

    return NextResponse.json(
      createApiResponse<Order>(
        true,
        "Order created successfully",
        201,
        newOrder
      ),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      createApiResponse<undefined>(false, message, 500),
      { status: 500 }
    );
  }
}

function isValidOrderData(
  products: OrderProduct[],
  totalItems: number,
  totalPrice: number,
  status?: string
): boolean {
  return (
    Array.isArray(products) &&
    products.length > 0 &&
    products.every(isValidProduct) &&
    typeof totalItems === "number" &&
    typeof totalPrice === "number" &&
    totalItems > 0 &&
    totalPrice > 0 &&
    (status === undefined || isValidStatus(status))
  );
}

function isValidProduct(product: OrderProduct): boolean {
  return (
    typeof product.productId === "string" &&
    typeof product.quantity === "number" &&
    typeof product.price === "number" &&
    product.quantity > 0 &&
    product.price >= 0
  );
}

function isValidStatus(status: string): boolean {
  return Object.values(OrderStatus).includes(status as OrderStatus);
}

async function createOrder(
  userId: string,
  products: OrderProduct[],
  totalItems: number,
  totalPrice: number,
  status?: string
): Promise<Order> {
  const newOrder = new OrderModel({
    userId,
    products: products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
      price: product.price,
    })),
    totalItems,
    totalPrice,
    orderDate: new Date(),
    status: status || OrderStatus.Pending,
  });

  return await newOrder.save();
}
