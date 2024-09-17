import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/Order";
import { createNextResponse } from "@/lib/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return createNextResponse(false, "Unauthorized access", 403);
    }

    await dbConnect();

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const matchStage: any = {};

    if (status && status !== "All Orders") {
      matchStage.status = status.toLowerCase();
    }

    if (search) {
      const isValidObjectId = ObjectId.isValid(search);

      matchStage.$or = [
        ...(isValidObjectId ? [{ _id: new ObjectId(search) }] : []),
        { "user.username": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } },
      ];
    }

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $addFields: {
          productNames: {
            $reduce: {
              input: "$productDetails",
              initialValue: "",
              in: { $concat: ["$$value", " ", "$$this.name"] },
            },
          },
        },
      },
      { $match: matchStage },
      {
        $addFields: {
          products: {
            $map: {
              input: "$products",
              as: "orderProduct",
              in: {
                $mergeObjects: [
                  "$$orderProduct",
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$productDetails",
                          cond: {
                            $eq: ["$$this._id", "$$orderProduct.productId"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          products: {
            productId: 1,
            quantity: 1,
            price: 1,
            name: 1,
          },
          totalItems: 1,
          totalPrice: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          "user.username": 1,
          "user.email": 1,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page, limit } }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
    ];

    const result = await OrderModel.aggregate(pipeline);

    const orders = result[0].data;
    const metadata = result[0].metadata[0];

    return NextResponse.json(
      {
        success: true,
        message:
          orders.length > 0
            ? "Orders retrieved successfully"
            : "No orders found",
        orders: orders,
        pagination: metadata
          ? {
              currentPage: metadata.page,
              totalPages: Math.ceil(metadata.total / limit),
              totalOrders: metadata.total,
            }
          : null,
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error occurred while fetching the orders from the database";
    return createNextResponse(false, message, 500);
  }
}
