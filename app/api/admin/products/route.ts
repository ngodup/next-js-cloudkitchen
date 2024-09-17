import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import { createApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        createApiResponse(false, "Unauthorized access", 403)
      );
    }

    await dbConnect();

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const cuisine = searchParams.get("cuisine") || "";

    const query: any = {};

    if (cuisine && cuisine.toLowerCase() !== "all cuisines") {
      query.cuisine = cuisine.toLowerCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const pipeline: PipelineStage[] = [
      { $match: query },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page, limit } }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
    ];

    const result = await ProductModel.aggregate(pipeline);

    const products = result[0].data;
    const metadata = result[0].metadata[0];

    return NextResponse.json(
      {
        success: true,
        message:
          products.length > 0
            ? "Products retrieved successfully"
            : "No products found",
        products: products,
        pagination: metadata
          ? {
              currentPage: metadata.page,
              totalPages: Math.ceil(metadata.total / limit),
              totalProducts: metadata.total,
            }
          : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      createApiResponse(
        false,
        "Unable to retrieve products at this time. Please check your database connection.",
        500
      )
    );
  }
}
