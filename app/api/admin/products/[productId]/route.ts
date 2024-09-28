import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { createNextResponse } from "@/lib/ApiResponse";
import { checkAdminAuthorization } from "../../adminAuth";
import dbConnect from "@/lib/dbConnect";
import { productItemSchema } from "@/schemas/productItemSchema";
import ProductModel from "@/model/Product";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  let connection: typeof mongoose | undefined;

  try {
    // Step 1: Connect to database
    await dbConnect();

    // Step 2: Check if user is authenticated and has admin role
    const authResponse = await checkAdminAuthorization();
    if (authResponse) return authResponse;

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

export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    // Step 1: Connect to database
    await dbConnect();

    // Step 2: Check if user is authenticated and has admin role
    const authResponse = await checkAdminAuthorization();
    if (authResponse) return authResponse;

    // Step 3: Validate product ID
    const { productId } = params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return createNextResponse(false, "Invalid product ID", 400);
    }

    // Step 4: Retrieve and validate data from request body
    const data = await req.json();
    if (!data) {
      return createNextResponse(false, "No data provided", 400);
    }
    const validationResult = productItemSchema.safeParse(data);
    if (!validationResult.success) {
      return createNextResponse(
        false,
        `Invalid product data ${validationResult.error.issues}`,
        400
      );
    }

    // Step 5: Update product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      validationResult.data,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return createNextResponse(false, "Product not found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return createNextResponse(
      false,
      `Error updating product: ${errorMessage}`,
      500
    );
  }
}
