import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";

import mongoose from "mongoose";
import { createNextResponse } from "@/lib/ApiResponse";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  let connection: typeof mongoose | undefined;

  try {
    // Step 1: Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return createNextResponse(false, "Unauthorized access", 403);
    }

    // Step 2: Connect to database
    await dbConnect();

    // Step 3: Validate product ID
    const { productId } = params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return createNextResponse(false, "Invalid product ID", 400);
    }

    // Step 4: Delete product
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (deletedProduct) {
      return NextResponse.json(
        {
          success: true,
          message: "Product deleted successfully",
          data: deletedProduct,
        },
        {
          status: 200,
        }
      );
    } else {
      return createNextResponse(false, "Product not found", 404);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return createNextResponse(
      false,
      `Error deleting product: ${errorMessage}`,
      500
    );
  } finally {
    // Ensure database connection is closed
    if (connection) {
      await connection.disconnect();
    }
  }
}
