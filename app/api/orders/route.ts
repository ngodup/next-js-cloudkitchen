import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { createNextResponse } from "@/lib/ApiResponse";
import { authOptions } from "../auth/[...nextauth]/options";
import OrderModel, {
  OrderStatus,
  IOrder,
  IOrderProduct,
  PaymentStatus,
} from "@/model/Order";
import mongoose, { Types } from "mongoose";
import { createPaymentIntent } from "@/lib/stripe";
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return createNextResponse(false, "Not Authenticated", 401);
    }

    const userId = new Types.ObjectId(session.user._id);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const userOrders = await OrderModel.aggregate([
      { $match: { userId: userId } },
      { $skip: skip },
      { $limit: limit },
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
          status: { $first: "$status" },
          addressId: { $first: "$addressId" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const totalOrders = await OrderModel.countDocuments({ userId: userId });

    return NextResponse.json(
      {
        success: true,
        message: "User orders retrieved successfully",
        orders: userOrders,
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return createNextResponse(false, "Not Authenticated", 401);
    }

    const userId = session.user._id;

    const { products, totalItems, totalPrice, addressId, paymentMethod } =
      await req.json();

    console.log("Received order data:", {
      products,
      totalItems,
      totalPrice,
      addressId,
      paymentMethod,
    });

    if (
      !isValidOrderData(
        products,
        totalItems,
        totalPrice,
        addressId,
        paymentMethod
      )
    ) {
      return createNextResponse(false, "Invalid order data", 400);
    }

    let paymentIntentId: string | undefined;
    let clientSecret: string | undefined;

    if (paymentMethod === "stripe") {
      try {
        const paymentIntent = await createPaymentIntent(
          Math.round(totalPrice * 100),
          {
            userId: userId.toString(),
            addressId,
          }
        );
        paymentIntentId = paymentIntent.id;
        clientSecret = paymentIntent.client_secret || undefined;
        console.log("Created Stripe PaymentIntent:", paymentIntentId);
      } catch (stripeError) {
        console.error("Error creating Stripe PaymentIntent:", stripeError);
        return createNextResponse(
          false,
          "Failed to create payment intent",
          500
        );
      }
    }

    const newOrder = await createOrder(
      userId,
      products,
      totalItems,
      totalPrice,
      addressId,
      paymentMethod,
      paymentIntentId
    );

    console.log("Created new order:", newOrder._id);

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order: newOrder,
        clientSecret: clientSecret,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}

function isValidOrderData(
  products: IOrderProduct[],
  totalItems: number,
  totalPrice: number,
  addressId: string,
  paymentMethod: string
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
      addressId.length > 0,
    typeof paymentMethod === "string" &&
      ["stripe", "default"].includes(paymentMethod)
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
  addressId: string,
  paymentMethod: string,
  paymentIntentId?: string
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
    paymentStatus:
      paymentMethod === "stripe" ? PaymentStatus.Pending : PaymentStatus.Paid,
    addressId,
    paymentMethod,
    ...(paymentIntentId && { paymentIntentId }),
  });

  return await newOrder.save();
}
