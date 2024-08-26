// app/api/products/route.ts
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const products = await ProductModel.find();
    if (!products || products.length <= 0) {
      return NextResponse.json(
        {
          success: true,
          products: [],
          message: "No products found",
        },
        {
          status: 200,
        }
      );
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
    // Cast the error to a more specific type
    const errorMessage = (error as Error).message || "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: `Error getting products from server: ${errorMessage}`,
      },
      {
        status: 500,
      }
    );
  }
}
