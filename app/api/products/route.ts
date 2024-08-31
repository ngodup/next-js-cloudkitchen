// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import { createApiResponse } from "@/types/ApiResponse";
import { IFoodItem } from "@/types";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const products = await ProductModel.find().skip(skip).limit(limit).lean();

    const totalProducts = await ProductModel.countDocuments();

    if (!products || products.length === 0) {
      return NextResponse.json(
        createApiResponse<{ products: IFoodItem[]; pagination: any }>(
          true,
          "No products found",
          200,
          {
            products: [],
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(totalProducts / limit),
              totalProducts,
            },
          }
        )
      );
    }

    return NextResponse.json(
      {
        success: true,
        products: products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = (error as Error).message || "Unknown error";
    return NextResponse.json(
      createApiResponse<undefined>(
        false,
        `Error getting products from server: ${errorMessage}`,
        500
      )
    );
  }
}
