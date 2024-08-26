import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
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
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
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
    return NextResponse.json(
      {
        success: false,
        message: `Error fetching product: ${errorMessage}`,
      },
      {
        status: 500,
      }
    );
  }
}
