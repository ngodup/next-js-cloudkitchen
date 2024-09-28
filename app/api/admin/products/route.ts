import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import { checkAdminAuthorization } from "../adminAuth";
import { createNextResponse } from "@/lib/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";
import { productItemSchema } from "@/schemas/productItemSchema";

export async function GET(req: NextRequest) {
  try {
    const authResponse = await checkAdminAuthorization();
    if (authResponse) return authResponse;

    await dbConnect();

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const cuisine = searchParams.get("cuisine") || "";

    const query: any = {};

    if (cuisine && cuisine.toLowerCase() !== "all cuisines") {
      // Decode the URL-encoded cuisine parameter like "Française"
      const decodedCuisine = decodeURIComponent(cuisine.toLowerCase());
      query.cuisine = new RegExp(decodedCuisine, "i"); // Case-insensitive match
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
    return createNextResponse(
      false,
      "Unable to retrieve products at this time. Please check your database connection.",
      500
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResponse = await checkAdminAuthorization();
    if (authResponse) return authResponse;

    await dbConnect();

    const body = await req.json();

    const validationResult = productItemSchema.safeParse(body);

    if (!validationResult.success) {
      return createNextResponse(
        false,
        `Invalid product data ${validationResult.error.issues}`,
        400
      );
    }

    const validatedData = validationResult.data;

    const existingProduct = await ProductModel.findOne({
      name: validatedData.name,
    });

    if (existingProduct) {
      return createNextResponse(
        false,
        "Product with this name already exists",
        409
      );
    }

    const newProduct = new ProductModel(validatedData);

    const savedProduct = await newProduct.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: savedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/admin/products:", error);
    return createNextResponse(
      false,
      "An error occurred while creating the product. Please try again later.",
      500
    );
  }
}
