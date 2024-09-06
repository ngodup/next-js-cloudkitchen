// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import { createApiResponse, ApiResponse } from "@/types/ApiResponse";
import { IFoodItem } from "@/types";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const products = await ProductModel.find().skip(skip).limit(limit).lean();
    const totalProducts = await ProductModel.countDocuments();

    return NextResponse.json(
      {
        success: true,
        message:
          products.length > 0
            ? "Products retrieved successfully"
            : "No products found",
        products: products ? products : [],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/products:", error);

    return createApiResponse(
      false,
      "Unable to retrieve products at this time. Please check your database connection.",
      500
    );
  }
}
