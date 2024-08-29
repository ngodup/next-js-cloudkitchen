// app/api/products/route.ts
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import { IFoodItem } from "@/types";
import { createApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const products = await ProductModel.find();
    if (!products || products.length <= 0) {
      return createApiResponse<IFoodItem[]>(true, "No products found", 200, []);
    }
    return NextResponse.json(
      {
        success: true,
        products: products,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = (error as Error).message || "Unknown error";
    return createApiResponse<undefined>(
      false,
      `Error getting products from server: ${errorMessage}`,
      500
    );
  }
}
