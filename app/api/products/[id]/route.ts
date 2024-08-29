import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import { createApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

// Dynamic route to fetch a single product by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const { id } = params;

    // Use .lean() to avoid circular structure issues
    const product = await ProductModel.findById(id).lean();

    if (!product) {
      return createApiResponse<undefined>(false, "Product not found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        product: product,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = (error as Error).message || "Unknown error";
    return createApiResponse<undefined>(
      false,
      `Error fetching product: ${errorMessage}`,
      500
    );
  }
}
